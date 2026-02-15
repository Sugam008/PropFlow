import { borderRadius, colors, spacing, typography } from '@propflow/theme';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';

type RootStackParamList = {
  ValuationResult: { propertyId: string };
};

type ValuationResultRouteProp = RouteProp<RootStackParamList, 'ValuationResult'>;

interface Comparable {
  address: string;
  area_sqft: number;
  sale_price: number;
  distance_km?: number;
}

interface ValuationData {
  estimated_value: number;
  confidence_score: number;
  valuation_date: string;
  methodology: string;
  comps?: Comparable[];
  notes?: string;
}

const { width } = Dimensions.get('window');

export const ValuationResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ValuationResultRouteProp>();
  const { propertyId } = route.params || {};

  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValuation = async () => {
      try {
        // Mock data - replace with actual API call
        setTimeout(() => {
          setValuation({
            estimated_value: 7500000,
            confidence_score: 0.85,
            valuation_date: new Date().toISOString(),
            methodology: 'Comparative Market Analysis',
            comps: [
              {
                address: 'Koramangala, Bangalore',
                area_sqft: 1200,
                sale_price: 7200000,
                distance_km: 0.5,
              },
              {
                address: 'HSR Layout, Bangalore',
                area_sqft: 1150,
                sale_price: 6800000,
                distance_km: 1.2,
              },
              {
                address: 'JP Nagar, Bangalore',
                area_sqft: 1250,
                sale_price: 7800000,
                distance_km: 2.0,
              },
            ],
            notes: 'Property in good condition, well-maintained society.',
          });
          setLoading(false);
        }, 1500);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchValuation();
  }, [propertyId]);

  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatLakhs = (amount: number): string => {
    return `${(amount / 100000).toFixed(1)} Lakhs`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your valuation...</Text>
        </View>
      </View>
    );
  }

  const minValue = valuation ? valuation.estimated_value * 0.95 : 0;
  const maxValue = valuation ? valuation.estimated_value * 1.05 : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Success Animation Container */}
      <View style={styles.successContainer}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
        <Text style={styles.title}>Valuation Complete!</Text>
        <Text style={styles.subtitle}>Your property has been valued</Text>
      </View>

      {/* Value Card */}
      <View style={styles.valueCard}>
        <Text style={styles.valueLabel}>Estimated Market Value</Text>
        <Text style={styles.valueAmount}>{formatINR(valuation?.estimated_value || 0)}</Text>
        <Text style={styles.valueRange}>
          Range: {formatINR(minValue)} - {formatINR(maxValue)}
        </Text>

        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence Score</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                { width: `${(valuation?.confidence_score || 0) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.confidenceValue}>
            {Math.round((valuation?.confidence_score || 0) * 100)}%
          </Text>
        </View>
      </View>

      {/* Value in Lakhs */}
      <View style={styles.lakhsCard}>
        <Text style={styles.lakhsValue}>₹{formatLakhs(valuation?.estimated_value || 0)}</Text>
        <Text style={styles.lakhsLabel}>Property Worth</Text>
      </View>

      {/* Comparables */}
      {valuation?.comps && valuation.comps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comparable Properties</Text>
          <Text style={styles.sectionSubtitle}>Based on similar properties in the area</Text>

          {valuation.comps.map((comp, index) => (
            <View key={index} style={styles.compCard}>
              <View style={styles.compHeader}>
                <Text style={styles.compAddress}>{comp.address}</Text>
                <Text style={styles.compDistance}>{comp.distance_km?.toFixed(1)} km away</Text>
              </View>
              <View style={styles.compDetails}>
                <View style={styles.compDetail}>
                  <Text style={styles.compDetailLabel}>Area</Text>
                  <Text style={styles.compDetailValue}>{comp.area_sqft} sq.ft</Text>
                </View>
                <View style={styles.compDetail}>
                  <Text style={styles.compDetailLabel}>Sale Price</Text>
                  <Text style={styles.compDetailValue}>{formatINR(comp.sale_price)}</Text>
                </View>
                <View style={styles.compDetail}>
                  <Text style={styles.compDetailLabel}>Price/sq.ft</Text>
                  <Text style={styles.compDetailValue}>
                    {formatINR(Math.round(comp.sale_price / comp.area_sqft))}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Methodology */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Valuation Methodology</Text>
        <View style={styles.methodologyCard}>
          <Text style={styles.methodologyText}>
            {valuation?.methodology || 'Comparative Market Analysis'}
          </Text>
          {valuation?.notes && <Text style={styles.notesText}>{valuation.notes}</Text>}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>DOWNLOAD REPORT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>CONTINUE FOR LOAN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkButtonText}>← Back to Status</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizes.lg,
    color: colors.gray[600],
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    color: colors.primary[100],
    marginTop: spacing[1],
  },
  valueCard: {
    margin: spacing[4],
    padding: spacing[5],
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueAmount: {
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.primary[600],
    marginVertical: spacing[2],
  },
  valueRange: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[500],
  },
  confidenceContainer: {
    width: '100%',
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  confidenceLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[600],
    marginBottom: spacing[2],
  },
  confidenceBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  confidenceValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    color: colors.success,
    marginTop: spacing[1],
    textAlign: 'right',
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lakhsCard: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    padding: spacing[5],
    backgroundColor: '#FFF5F5',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFCCCC',
    alignItems: 'center',
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lakhsValue: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: '700' as const,
    color: '#8B0000',
  },
  lakhsLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary[600],
    marginTop: spacing[1],
  },
  section: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    color: colors.gray[800],
    marginBottom: spacing[1],
  },
  sectionSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[500],
    marginBottom: spacing[3],
  },
  compCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  compHeader: {
    marginBottom: spacing[3],
  },
  compAddress: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium as TextStyle['fontWeight'],
    color: colors.gray[800],
  },
  compDistance: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray[500],
    marginTop: spacing[1],
  },
  compDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compDetail: {
    flex: 1,
  },
  compDetailLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray[500],
  },
  compDetailValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium as TextStyle['fontWeight'],
    color: colors.gray[700],
  },
  methodologyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  methodologyText: {
    fontSize: typography.fontSizes.base,
    color: colors.gray[700],
    lineHeight: 24,
  },
  notesText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[500],
    marginTop: spacing[3],
    fontStyle: 'italic',
  },
  actions: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  primaryButton: {
    backgroundColor: colors.primary[500] as string,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary[500],
    marginBottom: spacing[3],
  },
  secondaryButtonText: {
    color: colors.primary[500],
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  linkButtonText: {
    color: colors.gray[600],
    fontSize: typography.fontSizes.sm,
  },
});
