'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, typography, spacing, borderRadius, shadow, layout } from '@propflow/theme';
import { LogIn, Phone, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(phone, password);
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
              background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
              borderRadius: borderRadius.xl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing[5],
              boxShadow: shadow.brand,
            }}
          >
            <LogIn size={36} color={colors.white} />
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
            PropFlow Valuer
          </h1>
          <p
            style={{
              color: colors.gray[500],
              fontSize: typography.fontSizes.base,
              lineHeight: typography.lineHeights.relaxed,
            }}
          >
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: spacing[5] }}>
            <label
              htmlFor="phone"
              style={{
                display: 'block',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
                marginBottom: spacing[2],
              }}
            >
              Phone Number
            </label>
            <div style={getInputWrapperStyle('phone')}>
              <Phone
                size={18}
                color={focused === 'phone' ? colors.primary[500] : colors.gray[400]}
                style={{ marginLeft: spacing[4], transition: 'color 0.2s' }}
              />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
                placeholder="+919999900002"
                required
                autoComplete="tel"
                style={{
                  flex: 1,
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  border: 'none',
                  outline: 'none',
                  fontSize: typography.fontSizes.base,
                  backgroundColor: 'transparent',
                  color: colors.gray[900],
                  height: layout.inputHeight.lg,
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: spacing[6] }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
                marginBottom: spacing[2],
              }}
            >
              Password
            </label>
            <div style={getInputWrapperStyle('password')}>
              <Lock
                size={18}
                color={focused === 'password' ? colors.primary[500] : colors.gray[400]}
                style={{ marginLeft: spacing[4], transition: 'color 0.2s' }}
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                style={{
                  flex: 1,
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  border: 'none',
                  outline: 'none',
                  fontSize: typography.fontSizes.base,
                  backgroundColor: 'transparent',
                  color: colors.gray[900],
                  height: layout.inputHeight.lg,
                }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: colors.error[50],
                color: colors.error[600],
                padding: spacing[3],
                paddingLeft: spacing[4],
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSizes.sm,
                marginBottom: spacing[5],
                border: `1px solid ${colors.error[200]}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: colors.error[500],
                  flexShrink: 0,
                }}
              />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: `${spacing[3]}px`,
              background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
              color: colors.white,
              border: 'none',
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSizes.base,
              fontWeight: typography.fontWeights.semibold,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.8 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              height: layout.buttonHeight.lg,
              boxShadow: shadow.brand,
              transition: 'opacity 0.2s, transform 0.1s',
              transform: isLoading ? 'none' : 'scale(1)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: spacing[8],
            padding: spacing[4],
            backgroundColor: colors.gray[50],
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.gray[100]}`,
          }}
        >
          <p
            style={{
              fontWeight: typography.fontWeights.semibold,
              marginBottom: spacing[2],
              fontSize: typography.fontSizes.xs,
              color: colors.gray[700],
              textTransform: 'uppercase',
              letterSpacing: typography.letterSpacing.wider,
            }}
          >
            Demo Credentials
          </p>
          <div
            style={{
              fontSize: typography.fontSizes.sm,
              color: colors.gray[600],
              lineHeight: typography.lineHeights.relaxed,
            }}
          >
            <p style={{ marginBottom: spacing[1] }}>
              <span style={{ color: colors.gray[500] }}>Valuer:</span> +919999900002 / demo123
            </p>
            <p>
              <span style={{ color: colors.gray[500] }}>Admin:</span> +919999900003 / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
