import { borderRadius, colors, spacing, typography } from '@propflow/theme';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
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
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { usePropertyStore } from '../../store/usePropertyStore';

export const PropertyDetailsScreen = ({ navigation }: RootStackScreenProps<'PropertyDetails'>) => {
  const { draft, setDraft } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.area_sqft || draft.area_sqft <= 0) newErrors.area_sqft = 'Required';
    if (!draft.bedrooms || draft.bedrooms <= 0) newErrors.bedrooms = 'Required';
    if (!draft.bathrooms || draft.bathrooms <= 0) newErrors.bathrooms = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate('Location');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderInput = (
    label: string, 
    key: keyof typeof draft, 
    placeholder: string, 
    keyboardType: 'numeric' | 'default' = 'numeric',
    hint?: string
  ) => (
    <View style={styles.inputGroup} accessibilityRole="none">
      <Text style={styles.label} nativeID={`${key}-label`}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] ? styles.inputError : null]}
        value={draft[key]?.toString() || ''}
        onChangeText={(text) => {
          const val = keyboardType === 'numeric' ? parseFloat(text) || 0 : text;
          setDraft({ [key]: val });
          if (errors[key]) setErrors({ ...errors, [key]: '' });
        }}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={colors.gray[400]}
        accessibilityLabel={label}
        accessibilityHint={hint || `Enter ${label.toLowerCase()}`}
        accessibilityLabelledBy={`${key}-label`}
      />
      {errors[key] && (
        <Text 
          style={styles.errorText} 
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
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
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          accessibilityRole="none"
        >
          <View style={styles.header} accessibilityRole="header">
            <Text style={styles.title}>{draft.property_type ? `${draft.property_type} Details` : 'Property Details'}</Text>
            <Text style={styles.subtitle}>Enter the basic specifications of your {draft.property_type?.toLowerCase() || 'property'}</Text>
          </View>

          <View style={styles.form} accessibilityRole="none">
            {renderInput('Super Built-up Area (sq ft)', 'area_sqft', 'e.g. 1200', 'numeric', 'Total area of the property in square feet')}
            
            <View style={styles.row}>
              <View style={styles.flex1SpacingRight}>
                {renderInput('Bedrooms', 'bedrooms', 'e.g. 2', 'numeric', 'Number of bedrooms')}
              </View>
              <View style={styles.flex1SpacingLeft}>
                {renderInput('Bathrooms', 'bathrooms', 'e.g. 2', 'numeric', 'Number of bathrooms')}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1SpacingRight}>
                {renderInput('Floor No.', 'floor', 'e.g. 5', 'numeric', 'Current floor number')}
              </View>
              <View style={styles.flex1SpacingLeft}>
                {renderInput('Total Floors', 'total_floors', 'e.g. 10', 'numeric', 'Total number of floors in the building')}
              </View>
            </View>

            {renderInput('Age of Property (years)', 'age', 'e.g. 5', 'numeric', 'Age of the property since construction')}
          </View>

          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next: Location"
            accessibilityHint="Proceed to capture property location"
          >
            <Text style={styles.nextButtonText}>NEXT: LOCATION</Text>
          </TouchableOpacity>
        </ScrollView>
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
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  header: {
    marginBottom: spacing[6],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.black,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    color: colors.gray[500],
  },
  form: {
    marginBottom: spacing[8],
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
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    padding: spacing[3],
    fontSize: typography.fontSizes.base,
    color: colors.black,
  },
  inputError: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.error[500],
    marginTop: spacing[1],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1SpacingRight: {
    flex: 1,
    marginRight: spacing[2],
  },
  flex1SpacingLeft: {
    flex: 1,
    marginLeft: spacing[2],
  },
  nextButton: {
    backgroundColor: colors.primary[500],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    letterSpacing: 1,
  },
});
