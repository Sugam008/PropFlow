import { borderRadius, colors, spacing, typography } from '@propflow/theme';
import { PropertyType } from '@propflow/types';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { usePropertyStore } from '../../store/usePropertyStore';

const PROPERTY_TYPES = [
  { label: 'Apartment', value: PropertyType.APARTMENT, icon: '🏢' },
  { label: 'Independent House', value: PropertyType.HOUSE, icon: '🏡' },
  { label: 'Villa', value: PropertyType.VILLA, icon: '🏰' },
  { label: 'Commercial', value: PropertyType.COMMERCIAL, icon: '🏬' },
  { label: 'Land / Plot', value: PropertyType.LAND, icon: '📍' },
];

export const PropertyTypeScreen = ({ navigation }: RootStackScreenProps<'PropertyType'>) => {
  const { draft, setDraft } = usePropertyStore();

  const handleSelect = (type: PropertyType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft({ property_type: type });
    navigation.navigate('PropertyDetails');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">What type of property is it?</Text>
          <Text style={styles.subtitle} accessibilityRole="text">Select the category that best describes your property</Text>
        </View>

        <View style={styles.grid} accessibilityRole="radiogroup">
          {PROPERTY_TYPES.map((item) => {
            const isSelected = draft.property_type === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => handleSelect(item.value)}
                accessibilityRole="radio"
                accessibilityLabel={`${item.label} property type`}
                accessibilityState={{ selected: isSelected }}
                accessibilityHint={`Selects ${item.label} as your property type and proceeds to details`}
              >
                <Text style={styles.icon} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">{item.icon}</Text>
                <Text style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: spacing[4],
  },
  header: {
    marginBottom: spacing[8],
    marginTop: spacing[4],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.black,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    color: colors.gray[500],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.gray[50],
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[4],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  cardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing[3],
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    color: colors.gray[700],
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.primary[600],
  },
});
