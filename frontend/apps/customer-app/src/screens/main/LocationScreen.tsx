import { borderRadius, colors, spacing, typography } from '@propflow/theme';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { usePropertyStore } from '../../store/usePropertyStore';

export const LocationScreen = ({ navigation }: RootStackScreenProps<'Location'>) => {
  const { draft, setDraft } = usePropertyStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapRegion, setMapRegion] = useState({
    latitude: draft.lat || 19.0760, // Default to Mumbai
    longitude: draft.lng || 72.8777,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (draft.lat && draft.lng) {
      setMapRegion(prev => ({
        ...prev,
        latitude: draft.lat!,
        longitude: draft.lng!,
      }));
    }
  }, [draft.lat, draft.lng]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrors({ location: 'Permission to access location was denied' });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setDraft({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setErrors({ location: 'Failed to get location' });
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.address) newErrors.address = 'Address is required';
    if (!draft.city) newErrors.city = 'City is required';
    if (!draft.pincode) newErrors.pincode = 'Pincode is required';
    if (!draft.lat || !draft.lng) newErrors.location = 'Please capture your current location';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate('PhotoCapture');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderInput = (
    label: string, 
    key: keyof typeof draft, 
    placeholder: string,
    multiline = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline ? styles.textArea : null,
          errors[key] ? styles.inputError : null
        ]}
        value={draft[key]?.toString() || ''}
        onChangeText={(text) => {
          setDraft({ [key]: text });
          if (errors[key]) setErrors({ ...errors, [key]: '' });
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.gray[400]}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={label}
        accessibilityHint={`Enter the ${label.toLowerCase()}`}
      />
      {errors[key] && (
        <Text 
          style={styles.errorText}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {errors[key]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Property Location</Text>
            <Text style={styles.subtitle}>Enter the address and capture GPS coordinates</Text>
          </View>

          <View style={styles.form}>
            {renderInput('Complete Address', 'address', 'House No, Building, Street...', true)}
            
            <View style={styles.row}>
              <View style={styles.flex1}>
                {renderInput('City', 'city', 'e.g. Mumbai')}
              </View>
              <View style={styles.spacing} />
              <View style={styles.flex1}>
                {renderInput('Pincode', 'pincode', '6 digits')}
              </View>
            </View>

            {renderInput('State', 'state', 'e.g. Maharashtra')}

            <View style={styles.locationSection}>
              <Text style={styles.label}>GPS Coordinates</Text>
              <TouchableOpacity 
                style={[styles.locationButton, (draft.lat && draft.lng) ? styles.locationButtonSuccess : null]} 
                onPress={getCurrentLocation}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={(draft.lat && draft.lng) ? 'Location Captured' : 'Get Current Location'}
                accessibilityHint="Uses GPS to capture your current coordinates"
                accessibilityState={{ busy: loading }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.locationButtonText}>
                      {(draft.lat && draft.lng) ? '📍 Location Captured' : '📍 Get Current Location'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View 
                style={styles.mapContainer}
                accessibilityLabel="Property location map"
                accessibilityRole="image"
                accessibilityHint="Displays the property location. Tap to move the pin."
              >
                <MapView
                  style={styles.map}
                  region={mapRegion}
                  onRegionChangeComplete={setMapRegion}
                  onPress={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setDraft({ lat: latitude, lng: longitude });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  importantForAccessibility="no-hide-descendants"
                >
                  {draft.lat && draft.lng && (
                    <Marker
                      coordinate={{ latitude: draft.lat, longitude: draft.lng }}
                      draggable
                      onDragEnd={(e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate;
                        setDraft({ lat: latitude, lng: longitude });
                      }}
                      title="Property Location"
                    />
                  )}
                </MapView>
                <Text style={styles.mapHint}>Tap to move pin or drag existing pin</Text>
              </View>

              {(draft.lat && draft.lng) && (
                <Text 
                  style={styles.coordinatesText}
                  accessibilityLabel={`Coordinates: Latitude ${draft.lat.toFixed(6)}, Longitude ${draft.lng.toFixed(6)}`}
                >
                  Lat: {draft.lat.toFixed(6)}, Lng: {draft.lng.toFixed(6)}
                </Text>
              )}
              {errors.location && (
                <Text 
                  style={styles.errorText}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="assertive"
                >
                  {errors.location}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next: Photo Capture"
          >
            <Text style={styles.nextButtonText}>Next: Photo Capture</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
  },
  header: {
    marginBottom: spacing[8],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.black,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[500],
  },
  form: {
    gap: spacing[4],
  },
  inputGroup: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium as TextStyle['fontWeight'],
    color: colors.gray[700],
    marginBottom: spacing[1],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing[3],
    fontSize: typography.fontSizes.base,
    color: colors.black,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSizes.xs,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  spacing: {
    width: spacing[4],
  },
  locationSection: {
    marginTop: spacing[4],
    padding: spacing[4],
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing[3],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapHint: {
    position: 'absolute',
    bottom: spacing[2],
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: colors.white,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    fontSize: 10,
    overflow: 'hidden',
  },
  locationButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing[2],
  },
  locationButtonSuccess: {
    backgroundColor: colors.success,
  },
  locationButtonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    fontSize: typography.fontSizes.sm,
  },
  coordinatesText: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray[500],
    marginTop: spacing[2],
    textAlign: 'center',
  },
  footer: {
    padding: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  nextButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
  },
});
