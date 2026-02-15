import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@propflow/theme';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { usePropertyStore } from '../../store/usePropertyStore';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - spacing[12]) / 2;

export const PhotoReviewScreen = ({ navigation }: RootStackScreenProps<'PhotoReview'>) => {
  const { draft } = usePropertyStore();
  const photos = draft.photos || [];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Submit');
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Review Photos</Text>
          <Text style={styles.subtitle}>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'} captured
          </Text>
        </View>

        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <View key={uri} style={styles.photoWrapper}>
              <Image 
                source={{ uri }} 
                style={styles.photo} 
                contentFit="cover"
                transition={200}
                accessibilityLabel={`Property photo ${index + 1}`}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.retakeButton} 
          onPress={handleRetake}
          accessibilityRole="button"
          accessibilityLabel="Add More or Retake Photos"
        >
          <Ionicons name="camera" size={20} color={colors.primary[500]} />
          <Text style={styles.retakeButtonText}>Add More / Retake</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel="Continue to Summary"
        >
          <Text style={styles.nextButtonText}>Continue to Summary</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
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
  header: {
    marginBottom: spacing[6],
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
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    marginBottom: spacing[4],
    borderRadius: 12,
    backgroundColor: colors.gray[200],
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    marginTop: spacing[2],
  },
  retakeButtonText: {
    marginLeft: spacing[2],
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    fontSize: typography.fontSizes.base,
  },
  footer: {
    padding: spacing[6],
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  nextButton: {
    backgroundColor: colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: 12,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    marginRight: spacing[2],
  },
});
