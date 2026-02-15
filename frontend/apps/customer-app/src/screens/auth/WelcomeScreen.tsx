import { colors } from '@propflow/theme';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { authApi } from '../../api/auth';
import { RootStackScreenProps } from '../../navigation/AppNavigator';

export const WelcomeScreen = ({ navigation }: RootStackScreenProps<'Welcome'>) => {
  const logoOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);
  const [phone, setPhone] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ABC Logo fade-in (600ms)
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });

    // Tagline slide-up (400ms) with a slight delay
    contentTranslateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.back(1.5)),
    });
    contentOpacity.value = withTiming(1, {
      duration: 400,
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: interpolate(logoOpacity.value, [0, 1], [0.8, 1], Extrapolate.CLAMP) }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const isValidPhone = (value: string) => /^\+?[1-9]\d{9,14}$/.test(value);

  const handleGetStarted = async () => {
    const normalizedPhone = phone.trim();
    if (!isValidPhone(normalizedPhone)) {
      setError('Enter a valid phone number with country code. Example: +919876543210');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError(null);
    setIsSendingOtp(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await authApi.requestOtp({ phone: normalizedPhone });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('OTP', { phone: normalizedPhone });
    } catch {
      setError('Unable to send OTP right now. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer} accessible={true} accessibilityLabel="PropFlow Logo">
        {/* @ts-ignore */}
        <Animated.View style={[styles.logoPlaceholder, logoStyle]}>
          <Text style={styles.logoText}>PF</Text>
        </Animated.View>
        {/* @ts-ignore */}
        <Animated.Text 
          style={[styles.title, logoStyle]} 
          accessibilityRole="header"
        >
          PropFlow
        </Animated.Text>
      </View>

      {/* @ts-ignore */}
      <Animated.View style={[styles.contentContainer, contentStyle]}>
        <Text style={styles.subtitle}>Self-Valuation made easy</Text>
        <Text style={styles.description}>
          Get an accurate valuation of your property in minutes using our AI-powered flow.
        </Text>

        <TextInput
          style={styles.phoneInput}
          value={phone}
          onChangeText={(value) => {
            setPhone(value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Enter phone number (+countrycode)"
          placeholderTextColor={colors.gray[400]}
          keyboardType="phone-pad"
          autoCapitalize="none"
          editable={!isSendingOtp}
          accessibilityLabel="Phone Number Input"
          accessibilityHint="Enter your phone number with country code to receive an OTP"
        />
        {error ? (
          <Text 
            style={styles.errorText} 
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}

        <View style={styles.badgeContainer} accessible={true} accessibilityLabel="Key Features">
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Fast</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Secure</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Free</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, isSendingOtp ? styles.buttonDisabled : null]} 
          onPress={handleGetStarted}
          disabled={isSendingOtp}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isSendingOtp ? "Sending OTP" : "Get Started"}
          accessibilityHint="Requests a one-time password to be sent to your phone"
        >
          {isSendingOtp ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>GET STARTED</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleGetStarted}
          disabled={isSendingOtp}
          accessibilityRole="button"
          accessibilityLabel="Track Existing Valuation"
          accessibilityHint="Navigates to track an existing property valuation"
        >
          <Text style={styles.secondaryButtonText}>Track Here →</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: colors.primary[600],
    letterSpacing: -0.5,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  subtitle: { 
    fontSize: 24, 
    fontWeight: '600',
    color: colors.black, 
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray[500],
    lineHeight: 24,
    marginBottom: 20,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    color: colors.black,
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    fontSize: 13,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[600],
  },
  button: { 
    backgroundColor: colors.primary[500], 
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { 
    color: colors.white, 
    fontSize: 18, 
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
});
