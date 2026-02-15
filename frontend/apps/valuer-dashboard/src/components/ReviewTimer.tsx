import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { colors, typography, spacing } from '@propflow/theme';

interface ReviewTimerProps {
  startTime?: Date;
  onTimeUpdate?: (elapsedSeconds: number) => void;
  className?: string;
}

export const ReviewTimer: React.FC<ReviewTimerProps> = ({
  startTime = new Date(),
  onTimeUpdate,
  className,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = startTime.getTime();
      const seconds = Math.floor((now - start) / 1000);
      setElapsed(seconds);
      onTimeUpdate?.(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onTimeUpdate]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getColor = useCallback((seconds: number): string => {
    if (seconds < 300) return colors.success[500]; // < 5 min - good
    if (seconds < 600) return colors.warning[500]; // < 10 min - warning
    return colors.error[500]; // > 10 min - slow
  }, []);

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[3]}px`,
        backgroundColor: colors.gray[100],
        borderRadius: '6px',
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium as any,
        color: getColor(elapsed),
      }}
    >
      <Clock size={16} />
      <span>⏱️ {formatTime(elapsed)}</span>
    </div>
  );
};

export default ReviewTimer;
