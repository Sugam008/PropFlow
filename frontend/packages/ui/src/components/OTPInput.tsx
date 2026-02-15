import React, { useRef, useState, useEffect } from 'react';
import { colors, borderRadius, spacing, typography } from '@propflow/theme';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  error = false,
  disabled = false,
}) => {
  const [otp, setOtp] = useState(value);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newOtp = otp.split('');
    newOtp[index] = digit;
    const finalOtp = newOtp.join('').slice(0, length);
    setOtp(finalOtp);
    onChange?.(finalOtp);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    setOtp(pastedData);
    onChange?.(pastedData);
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing[2],
    justifyContent: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semibold,
    fontFamily: typography.fonts.sans,
    borderRadius: borderRadius.md,
    border: `2px solid ${error ? colors.error : otp.length === length ? colors.success : colors.border}`,
    backgroundColor: colors.white,
    color: colors.gray[800],
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={containerStyle} onPaste={handlePaste}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          style={inputStyle}
        />
      ))}
    </div>
  );
};
