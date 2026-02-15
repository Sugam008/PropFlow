import { borderRadius, colors, spacing, typography } from '@propflow/theme';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';

interface FollowUpItem {
  id: string;
  type: 'photo' | 'document' | 'info';
  title: string;
  description: string;
  status: 'required' | 'optional';
  photoUrl?: string;
}

export const FollowUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([
    {
      id: '1',
      type: 'photo',
      title: 'Kitchen Photo',
      description: 'Please capture a clear photo of the kitchen counter with appliances visible.',
      status: 'required',
    },
    {
      id: '2',
      type: 'photo',
      title: 'Bathroom Photo',
      description: 'Please capture the bathroom showing fittings and ventilation.',
      status: 'required',
    },
    {
      id: '3',
      type: 'info',
      title: 'Property Age Verification',
      description: 'Please provide the year of construction or last renovation.',
      status: 'required',
    },
  ]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const handleRetakePhoto = (item: FollowUpItem) => {
    if (item.type === 'photo') {
      Alert.alert('Retake Photo', `Opening camera for: ${item.title}`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Camera',
          onPress: () => {
            setCompletedItems((prev) => [...prev, item.id]);
          },
        },
      ]);
    } else {
      Alert.alert('Provide Information', `Please provide: ${item.title}`, [{ text: 'OK' }]);
    }
  };

  const handleMarkComplete = (itemId: string) => {
    setCompletedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const handleSubmit = () => {
    const requiredItems = followUpItems.filter((item) => item.status === 'required');
    const completedRequired = requiredItems.filter((item) => completedItems.includes(item.id));

    if (completedRequired.length < requiredItems.length) {
      Alert.alert('Incomplete', 'Please complete all required items before submitting.', [
        { text: 'OK' },
      ]);
      return;
    }

    Alert.alert('Submitted', 'Your follow-up information has been submitted successfully.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const getStatusIcon = (item: FollowUpItem) => {
    if (completedItems.includes(item.id)) {
      return '✓';
    }
    return item.status === 'required' ? '⚠️' : 'ℹ️';
  };

  const getStatusColor = (item: FollowUpItem) => {
    if (completedItems.includes(item.id)) {
      return colors.success;
    }
    return item.status === 'required' ? colors.warning : colors.info;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.warningEmoji}>⚠️</Text>
        <Text style={styles.title}>Action Required</Text>
        <Text style={styles.subtitle}>
          Please complete the following items to proceed with your valuation
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedItems.length / followUpItems.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedItems.length} of {followUpItems.length} completed
        </Text>
      </View>

      {/* Items List */}
      <View style={styles.section}>
        {followUpItems.map((item) => (
          <View
            key={item.id}
            style={[styles.itemCard, completedItems.includes(item.id) && styles.itemCardCompleted]}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemIconContainer}>
                <Text style={styles.itemIcon}>{item.type === 'photo' ? '📷' : '📄'}</Text>
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: getStatusColor(item) }]}>
                    {getStatusIcon(item)} {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              {completedItems.includes(item.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>

            <Text style={styles.itemDescription}>{item.description}</Text>

            {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.thumbnail} />}

            <TouchableOpacity style={styles.actionButton} onPress={() => handleRetakePhoto(item)}>
              <Text style={styles.actionButtonText}>
                {completedItems.includes(item.id) ? 'Update' : 'Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why is this needed?</Text>
        <Text style={styles.infoText}>
          Our valuation team requires additional information to complete the property assessment.
          Providing these details will help us give you an accurate valuation within 24 hours.
        </Text>
      </View>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, completedItems.length === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={completedItems.length === 0}
        >
          <Text style={styles.submitButtonText}>SUBMIT FOLLOW-UP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back to Status</Text>
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
  header: {
    backgroundColor: colors.warning,
    paddingTop: spacing[8],
    paddingBottom: spacing[5],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  warningEmoji: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing[2],
    opacity: 0.9,
  },
  progressContainer: {
    padding: spacing[4],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[600],
    marginTop: spacing[2],
    textAlign: 'center',
  },
  section: {
    padding: spacing[4],
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  itemCardCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  itemIcon: {
    fontSize: 24,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    color: colors.gray[800],
    marginBottom: spacing[1],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium as TextStyle['fontWeight'],
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
  },
  itemDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[600],
    lineHeight: 20,
    marginBottom: spacing[3],
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
    marginBottom: spacing[3],
  },
  actionButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
  },
  infoCard: {
    margin: spacing[4],
    padding: spacing[4],
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    color: colors.info,
    marginBottom: spacing[2],
  },
  infoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[700],
    lineHeight: 20,
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  backButtonText: {
    color: colors.gray[600],
    fontSize: typography.fontSizes.sm,
  },
});
