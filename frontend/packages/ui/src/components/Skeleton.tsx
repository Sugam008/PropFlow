import React from 'react';
import { colors, borderRadius, animations } from '@propflow/theme';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = 'text',
  variant = 'text',
}) => {
  const getBorderRadius = () => {
    if (radius !== 'text') return radius;
    switch (variant) {
      case 'circular':
        return '50%';
      case 'rectangular':
        return borderRadius.base;
      default:
        return 4;
    }
  };

  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: getBorderRadius(),
    background: `linear-gradient(90deg, ${colors.gray[200]} 0%, ${colors.gray[100]} 50%, ${colors.gray[200]} 100%)`,
    backgroundSize: '200% 100%',
    animation: `${animations.duration[1000]}ms ease-in-out infinite shimmer`,
  };

  const shimmer = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  return (
    <>
      <style>{shimmer}</style>
      <div style={style} />
    </>
  );
};
