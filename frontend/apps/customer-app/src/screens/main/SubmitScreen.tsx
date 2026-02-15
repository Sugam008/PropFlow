import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@propflow/theme';
import * as Haptics from 'expo-haptics';
import React, { ComponentProps, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { getErrorMessage } from '../../api/errors';
import { propertyApi } from '../../api/property';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { useToast } from '../../providers/ToastProvider';
import { usePropertyStore } from '../../store/usePropertyStore';

export const SubmitScreen = ({ navigation }: RootStackScreenProps<'Submit'>) => {
  const { draft, setDraft } = usePropertyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const getMissingFields = () => {
    const required = ['property_type', 'address', 'city', 'state', 'pincode', 'area_sqft'] as const;
    return required.filter((field) => !draft[field]);
  };

  const handleSubmit = async () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      Alert.alert('Missing Details', 'Please complete all required property details before submitting.');
      return;
    }

    if (!draft.photos || draft.photos.length === 0) {
      Alert.alert('Missing Photos', 'Please capture at least one property photo before submitting.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      const createdProperty = await propertyApi.createProperty({
        property_type: draft.property_type!,
        address: draft.address!,
        city: draft.city!,
        state: draft.state!,
        pincode: draft.pincode!,
        area_sqft: draft.area_sqft!,
        lat: draft.lat,
        lng: draft.lng,
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        floor: draft.floor,
        total_floors: draft.total_floors,
        age: draft.age,
      });

      for (const [index, uri] of draft.photos.entries()) {
        await propertyApi.uploadPhoto(createdProperty.id, uri, index);
      }

      await propertyApi.submitProperty(createdProperty.id);
      setDraft({ property_id: createdProperty.id });
      showToast('Valuation request submitted!', 'success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('Status');
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SummaryItem = ({ label, value, icon }: { label: string; value: string | number; icon: ComponentProps<typeof Ionicons>['name'] }) => (
    <View style={styles.summaryItem} accessible={true} accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.primary[500]} aria-hidden />
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.flex1} 
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="none"
      >
        <Text style={styles.title} accessibilityRole="header">Valuation Summary</Text>
        <Text style={styles.subtitle}>Review your property details before submitting</Text>

        <View style={styles.card} accessibilityRole="none">
          <Text style={styles.cardTitle} accessibilityRole="header">Property Details</Text>
          <SummaryItem 
            label="Type" 
            value={draft.property_type || 'N/A'} 
            icon="business-outline" 
          />
          <SummaryItem 
            label="Area" 
            value={draft.area_sqft ? `${draft.area_sqft} sq.ft.` : 'N/A'} 
            icon="expand-outline" 
          />
          <SummaryItem 
            label="Configuration" 
            value={draft.bedrooms ? `${draft.bedrooms} BHK, ${draft.bathrooms} Bath` : 'N/A'} 
            icon="bed-outline" 
          />
          <SummaryItem 
            label="Floor" 
            value={draft.floor ? `${draft.floor} of ${draft.total_floors}` : 'N/A'} 
            icon="layers-outline" 
          />
        </View>

        <View style={styles.card} accessibilityRole="none">
          <Text style={styles.cardTitle} accessibilityRole="header">Location</Text>
          <SummaryItem 
            label="Address" 
            value={draft.address || 'N/A'} 
            icon="location-outline" 
          />
          <SummaryItem 
            label="City" 
            value={draft.city ? `${draft.city}, ${draft.state} - ${draft.pincode}` : 'N/A'} 
            icon="map-outline" 
          />
        </View>

        <View style={styles.card} accessibilityRole="none">
          <Text style={styles.cardTitle} accessibilityRole="header">Media</Text>
          <SummaryItem 
            label="Photos" 
            value={`${draft.photos?.length || 0} photos captured`} 
            icon="camera-outline" 
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel={isSubmitting ? "Submitting your valuation request" : "Submit for Valuation"}
          accessibilityHint="Finalizes and sends your property valuation request to our team"
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit for Valuation</Text>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} aria-hidden />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.black,
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    color: colors.gray[600],
    marginTop: spacing[1],
    marginBottom: spacing[6],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[4],
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.black,
    marginBottom: spacing[4],
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    color: colors.gray[800],
    marginTop: 2,
  },
  footer: {
    padding: spacing[6],
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    marginRight: spacing[2],
  },
});
