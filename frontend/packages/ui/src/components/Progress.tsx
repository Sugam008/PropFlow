import React from 'react';
import { colors, borderRadius, spacing } from '@propflow/theme';

export interface ProgressProps {
  value: number; // 0-100
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  variant = 'linear',
  size = 'md',
  color = 'primary',
  showLabel = false,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorMap = {
    primary: colors.primary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
  };

  const sizeMap = {
    linear: {
      sm: 4,
      md: 8,
      lg: 12,
    },
    circular: {
      sm: 24,
      md: 40,
      lg: 56,
    },
  };

  if (variant === 'circular') {
    const strokeWidth = sizeMap.circular[size as keyof typeof sizeMap.circular] / 4;
    const radius = (sizeMap.circular[size as keyof typeof sizeMap.circular] - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedValue / 100) * circumference;

    const containerStyle: React.CSSProperties = {
      width: sizeMap.circular[size as keyof typeof sizeMap.circular],
      height: sizeMap.circular[size as keyof typeof sizeMap.circular],
      position: 'relative',
    };

    return (
      <div style={containerStyle}>
        <svg
          width={sizeMap.circular[size as keyof typeof sizeMap.circular]}
          height={sizeMap.circular[size as keyof typeof sizeMap.circular]}
          viewBox={`0 0 ${sizeMap.circular[size as keyof typeof sizeMap.circular]} ${sizeMap.circular[size as keyof typeof sizeMap.circular]}`}
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={colors.gray[200]}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={colorMap[color]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${sizeMap.circular[size as keyof typeof sizeMap.circular] / 2} ${sizeMap.circular[size as keyof typeof sizeMap.circular] / 2})`}
            style={{ transition: 'stroke-dashoffset 0.3s' }}
          />
        </svg>
        {showLabel && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: size === 'sm' ? '8px' : size === 'lg' ? '14px' : '11px',
              fontWeight: 600,
              color: colors.gray[700],
            }}
          >
            {Math.round(clampedValue)}%
          </div>
        )}
      </div>
    );
  }

  const height = sizeMap.linear[size as keyof typeof sizeMap.linear];

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  };

  const fillStyle: React.CSSProperties = {
    width: `${clampedValue}%`,
    height: '100%',
    backgroundColor: colorMap[color],
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle} />
    </div>
  );
};
