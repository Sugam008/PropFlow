import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@propflow/theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { usePropertyStore } from '../../store/usePropertyStore';

export const PhotoCaptureScreen = ({ navigation }: RootStackScreenProps<'PhotoCapture'>) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const { setDraft } = usePropertyStore();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container} accessibilityRole="none">
        <Text style={styles.message} accessibilityRole="text">We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel="Grant Camera Permission"
          accessibilityHint="Allows the app to access your camera to take property photos"
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
          exif: false,
        });
        if (photo) {
          setPhotos((prev) => [...prev, photo.uri]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const removePhoto = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please capture at least one photo of the property.');
      return;
    }
    setDraft({ photos });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PhotoReview');
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          accessibilityLabel="Camera Preview"
          accessibilityHint="Use the capture button below to take photos of the property"
        />
        <View style={styles.overlay}>
          <Text style={styles.guideText} accessibilityRole="header">Capture clear photos of the property</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <FlatList
          horizontal
          data={photos}
          keyExtractor={(item) => item}
          accessibilityLabel="Captured photos list"
          renderItem={({ item, index }) => (
            <View style={styles.photoPreviewContainer} accessible={true} accessibilityLabel={`Photo ${index + 1}`}>
              <Image 
                source={{ uri: item }} 
                style={styles.photoPreview} 
                contentFit="cover"
                transition={200}
                accessibilityLabel={`Captured property photo ${index + 1}`}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
                accessibilityRole="button"
                accessibilityLabel={`Remove photo ${index + 1}`}
                accessibilityHint="Deletes this photo from your submission"
              >
                <Ionicons name="close-circle" size={24} color={colors.error} aria-hidden />
              </TouchableOpacity>
            </View>
          )}
          style={styles.photoList}
          contentContainerStyle={styles.photoListContent}
        />

        <View style={styles.actionRow}>
          <View style={styles.flex1} />
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={takePicture}
            accessibilityRole="button"
            accessibilityLabel="Take Photo"
            accessibilityHint="Captures a photo using the rear camera"
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <View style={styles.flex1}>
            {photos.length > 0 && (
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={handleNext}
                accessibilityRole="button"
                accessibilityLabel={`Next, ${photos.length} photos captured`}
                accessibilityHint="Proceeds to review your captured photos"
              >
                <Text style={styles.nextButtonText} accessibilityLiveRegion="polite">Next ({photos.length})</Text>
                <Ionicons name="arrow-forward" size={20} color={colors.white} aria-hidden />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: colors.white,
    fontSize: typography.fontSizes.base,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: spacing[4],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  guideText: {
    color: colors.white,
    backgroundColor: colors.gray[800],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium as TextStyle['fontWeight'],
  },
  controls: {
    backgroundColor: colors.white,
    paddingVertical: spacing[4],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  photoList: {
    maxHeight: 100,
    marginBottom: spacing[4],
  },
  photoListContent: {
    paddingHorizontal: spacing[4],
  },
  photoPreviewContainer: {
    marginRight: spacing[2],
    position: 'relative',
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    marginRight: spacing[1],
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
  },
});
