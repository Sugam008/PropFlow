import { useCallback, useEffect, useRef, useState } from 'react';

export interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  state_district?: string;
  postcode?: string;
  country?: string;
  county?: string;
}

export interface AddressSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
  type: string;
  importance: number;
}

export interface ReverseGeocodeResult {
  address: string;
  city: string;
  state: string;
  pincode: string;
  display_name: string;
}

interface SearchContext {
  city?: string;
  state?: string;
  pincode?: string;
}

/**
 * Intelligent address autocomplete hook using OpenStreetMap Nominatim.
 *
 * Supports:
 * - Contextual search (scoped by city/state/pincode when available)
 * - Reverse geocoding (lat/lng → address fields)
 * - Debounced queries (400ms)
 * - India-focused results
 */
export const useAddressAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  /**
   * Build the optimal Nominatim query URL based on available context.
   *
   * Strategy:
   * - If we have city/state/pincode context, use Nominatim's structured query
   *   (`street=`, `city=`, etc.) for much better result relevance
   * - If no context, fall back to free-form `q=` search scoped to India
   * - Pincode is used as `postalcode=` which heavily biases results
   */
  const buildSearchUrl = useCallback((query: string, context: SearchContext): string => {
    const base = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      format: 'json',
      addressdetails: '1',
      limit: '6',
      countrycodes: 'in',
    });

    const hasContext = context.city || context.state || context.pincode;

    if (hasContext) {
      // Structured query — dramatically better relevance
      params.set('street', query);
      if (context.city) params.set('city', context.city);
      if (context.state) params.set('state', context.state);
      if (context.pincode) params.set('postalcode', context.pincode);
    } else {
      // Free-form with viewbox hint for India
      params.set('q', query);
      params.set('viewbox', '68.1,6.7,97.4,35.5'); // India bounding box
      params.set('bounded', '1');
    }

    return `${base}?${params.toString()}`;
  }, []);

  /**
   * Search for addresses with optional context from already-filled fields.
   * Results are debounced by 400ms and abort previous in-flight requests.
   */
  const searchAddress = useCallback(
    (query: string, context: SearchContext = {}) => {
      // Clear previous debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        // Abort previous request
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        setIsSearching(true);
        try {
          const url = buildSearchUrl(query, context);
          const response = await fetch(url, {
            signal: abortRef.current.signal,
            headers: { Accept: 'application/json' },
          });
          const data = await response.json();
          setSuggestions(data || []);
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Geocoding search error:', error);
            setSuggestions([]);
          }
        } finally {
          setIsSearching(false);
        }
      }, 400);
    },
    [buildSearchUrl],
  );

  /**
   * Reverse geocode: given lat/lng, resolve to a structured address.
   * Used when:
   * - User drags the map pin
   * - GPS location is acquired and no address is entered yet
   */
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<ReverseGeocodeResult | null> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          { headers: { Accept: 'application/json' } },
        );
        const data = await response.json();

        if (!data || data.error) return null;

        const addr = data.address || {};

        // Build a readable street address
        const streetParts = [addr.house_number, addr.road, addr.neighbourhood, addr.suburb].filter(
          Boolean,
        );

        return {
          address:
            streetParts.join(', ') || data.display_name?.split(',').slice(0, 2).join(',') || '',
          city: addr.city || addr.town || addr.village || addr.state_district || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          display_name: data.display_name || '',
        };
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
      }
    },
    [],
  );

  /**
   * Extract a clean, user-friendly address from a suggestion.
   */
  const extractAddress = useCallback((suggestion: AddressSuggestion) => {
    const addr = suggestion.address;

    const streetParts = [addr.house_number, addr.road, addr.neighbourhood, addr.suburb].filter(
      Boolean,
    );

    return {
      address: streetParts.join(', ') || suggestion.display_name.split(',').slice(0, 2).join(','),
      city: addr.city || addr.town || addr.village || addr.state_district || '',
      state: addr.state || '',
      pincode: addr.postcode || '',
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    };
  }, []);

  /**
   * Lookup City/State by Pincode.
   * Scoped to India.
   */
  const lookupByPincode = useCallback(async (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return null;

    const fetchWithRetry = async (retries = 1): Promise<any> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincode}&countrycodes=in&addressdetails=1&limit=5`,
          {
            headers: { Accept: 'application/json' },
            mode: 'cors',
          },
        );
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
          return fetchWithRetry(retries - 1);
        }
        throw error;
      }
    };

    try {
      const data = await fetchWithRetry();
      if (!data || data.length === 0) return null;

      // Find the best match that has a state, otherwise fallback to first
      const bestMatch = data.find((item: any) => item.address && item.address.state) || data[0];
      const addr = bestMatch.address;

      return {
        city: addr.city || addr.town || addr.village || addr.state_district || '',
        state: addr.state || '',
      };
    } catch (error) {
      console.error('Pincode lookup error:', error);
      return null;
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isSearching,
    searchAddress,
    reverseGeocode,
    extractAddress,
    clearSuggestions,
    lookupByPincode,
  };
};
