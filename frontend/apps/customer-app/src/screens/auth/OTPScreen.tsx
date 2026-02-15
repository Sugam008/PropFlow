import { colors } from '@propflow/theme';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { authApi } from '../../api/auth';
import { getErrorMessage } from '../../api/errors';
import { RootStackScreenProps } from '../../navigation/AppNavigator';
import { useToast } from '../../providers/ToastProvider';
import { useAuthStore } from '../../store/useAuthStore';

export const OTPScreen = ({ navigation, route }: RootStackScreenProps<'OTP'>) => {
  const { phone = '' } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (!phone) {
      navigation.goBack();
    }
  }, [navigation, phone]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (error) {
      setError(null);
    }
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode: string) => {
    if (!phone) {
      setError('Phone number missing. Please restart login.');
      return;
    }

    if (otpCode.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await authApi.verifyOtp({ phone, otp: otpCode });
      setAuth(
        {
          id: response.user.id,
          phone: response.user.phone,
          name: response.user.name,
          role: response.user.role,
          is_active: response.user.is_active,
        },
        response.access_token
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, 'error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!phone || resendTimer > 0 || isResending) {
      return;
    }

    setIsResending(true);
    try {
      await authApi.requestOtp({ phone });
      setResendTimer(30);
      setError(null);
      showToast('New OTP sent', 'success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, 'error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {phone || 'your phone'}
          </Text>
          {error ? (
            <Text 
              style={styles.errorText}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
            >
              {error}
            </Text>
          ) : null}

          <View style={styles.otpContainer} accessibilityLabel="OTP Input" accessibilityRole="none">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isVerifying && !isResending}
                accessibilityLabel={`Digit ${index + 1} of 6`}
                textContentType="oneTimeCode"
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.button, otp.some(d => d === '') && styles.buttonDisabled]} 
            onPress={() => handleVerify(otp.join(''))}
            disabled={otp.some(d => d === '') || isVerifying || isResending}
            accessibilityRole="button"
            accessibilityLabel="Verify OTP"
            accessibilityState={{ disabled: otp.some(d => d === '') || isVerifying || isResending }}
          >
            {isVerifying ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>VERIFY</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendTimer > 0 || isResending || isVerifying}
              accessibilityRole="button"
              accessibilityLabel="Resend OTP code"
              accessibilityState={{ disabled: resendTimer > 0 || isResending || isVerifying }}
            >
              <Text style={[styles.resendLink, resendTimer > 0 && styles.resendLinkDisabled]}>
                {isResending
                  ? 'Resending...'
                  : resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : 'Resend Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.white 
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    padding: 20,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: colors.black,
    marginBottom: 12,
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.gray[500], 
    lineHeight: 24,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 13,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary[500],
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
    backgroundColor: colors.gray[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: { 
    color: colors.white, 
    fontSize: 18, 
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  resendText: {
    color: colors.gray[500],
    fontSize: 16,
  },
  resendLink: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: colors.gray[400],
  },
});
