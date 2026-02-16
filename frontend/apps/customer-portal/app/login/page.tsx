'use client';

import { borderRadius, colors, shadow, spacing, typography } from '@propflow/theme';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { isLoading, error, requestOtp, verifyOtp } = useAuthStore();
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await requestOtp(phone);
    if (success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(phone, otp);
    if (success) {
      router.push('/');
    }
  };

  const getInputWrapperStyle = (fieldName: string) => ({
    display: 'flex',
    alignItems: 'center',
    border: `1.5px solid ${focused === fieldName ? colors.primary[500] : colors.border}`,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === fieldName ? `0 0 0 3px ${colors.primary[100]}` : 'none',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.gray[50]} 0%, ${colors.primary[50]} 100%)`,
        padding: spacing[4],
      }}
    >
      <div
        style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius['2xl'],
          boxShadow: shadow.xl,
          padding: spacing[10],
          width: '100%',
          maxWidth: 420,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
          <div
            style={{
              width: 72,
              height: 72,
              backgroundColor: colors.white,
              borderRadius: borderRadius.xl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing[5],
              boxShadow: shadow.brand,
              padding: spacing[2],
              overflow: 'hidden',
            }}
          >
            <img
              src="/ab-capital-logo.png"
              alt="Aditya Birla Capital"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <h1
            style={{
              fontSize: typography.fontSizes['2xl'],
              fontWeight: typography.fontWeights.bold,
              color: colors.gray[900],
              marginBottom: spacing[2],
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            PropFlow Customer
          </h1>
          <p
            style={{
              color: colors.gray[500],
              fontSize: typography.fontSizes.base,
              lineHeight: typography.lineHeights.relaxed,
            }}
          >
            {otpSent ? 'Enter the OTP sent to your phone' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: spacing[3],
              backgroundColor: colors.error[50],
              color: colors.error[700],
              borderRadius: borderRadius.md,
              fontSize: typography.fontSizes.sm,
              textAlign: 'center',
              marginBottom: spacing[5],
            }}
          >
            {error}
          </div>
        )}

        {!otpSent ? (
          <form
            onSubmit={handleRequestOtp}
            style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}
          >
            <div>
              <label
                htmlFor="phone-input"
                style={{
                  display: 'block',
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.medium,
                  color: colors.gray[700],
                  marginBottom: spacing[1.5],
                }}
              >
                Phone Number
              </label>
              <div style={getInputWrapperStyle('phone')}>
                <div
                  aria-hidden="true"
                  style={{
                    padding: `0 ${spacing[3]}px`,
                    color: colors.gray[400],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your phone number"
                  aria-invalid={!!error}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: `${spacing[2.5]}px 0`,
                    fontSize: typography.fontSizes.sm,
                    color: colors.gray[900],
                    backgroundColor: 'transparent',
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: spacing[2],
                width: '100%',
                backgroundColor: colors.primary[600],
                color: colors.white,
                border: 'none',
                borderRadius: borderRadius.lg,
                padding: spacing[3],
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.semibold,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: shadow.md,
              }}
            >
              {isLoading ? (
                <svg
                  className="animate-spin"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}
          >
            <div>
              <label
                htmlFor="otp-input"
                style={{
                  display: 'block',
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.medium,
                  color: colors.gray[700],
                  marginBottom: spacing[1.5],
                }}
              >
                Enter OTP
              </label>
              <div style={getInputWrapperStyle('otp')}>
                <div
                  aria-hidden="true"
                  style={{
                    padding: `0 ${spacing[3]}px`,
                    color: colors.gray[400],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="otp-input"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onFocus={() => setFocused('otp')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter the 6-digit code"
                  aria-invalid={!!error}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: `${spacing[2.5]}px 0`,
                    fontSize: typography.fontSizes.sm,
                    color: colors.gray[900],
                    backgroundColor: 'transparent',
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: spacing[2],
                width: '100%',
                backgroundColor: colors.primary[600],
                color: colors.white,
                border: 'none',
                borderRadius: borderRadius.lg,
                padding: spacing[3],
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.semibold,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: shadow.md,
              }}
            >
              {isLoading ? (
                <svg
                  className="animate-spin"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: colors.primary[600],
                fontSize: typography.fontSizes.sm,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
