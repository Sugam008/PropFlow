'use client';

import React from 'react';
import { spacing, typography, colors } from '@propflow/theme';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { Card } from '../../src/components/Card';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../../src/api/properties';

export default function AnalyticsPage() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties()
  });

  // Calculate metrics
  const metrics = React.useMemo(() => {
    const valued = properties?.filter(p => p.status === 'VALUED') || [];
    const totalValued = valued.length;
    const pendingReview = properties?.filter(p => p.status === 'SUBMITTED').length || 0;
    const followUps = properties?.filter(p => p.status === 'FOLLOW_UP').length || 0;
    
    const totalValue = valued
      .filter(p => p.estimated_value)
      .reduce((sum, p) => sum + (p.estimated_value || 0), 0);

    return { totalValued, pendingReview, followUps, totalValue };
  }, [properties]);

  const formatCurrency = React.useCallback((val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  }, []);

  const stats = React.useMemo(() => [
    {
      label: 'Total Valuations',
      value: metrics.totalValued,
      change: '+12%',
      trend: 'up',
      icon: <CheckCircle2 size={24} color={colors.success} />,
      bgColor: colors.success + '10'
    },
    {
      label: 'Avg. Turnaround',
      value: '1.4 Days',
      change: '-5%',
      trend: 'up', // Down is good for turnaround
      icon: <Clock size={24} color={colors.primary[500]} />,
      bgColor: colors.primary[50]
    },
    {
      label: 'Portfolio Value',
      value: formatCurrency(metrics.totalValue),
      change: '+18%',
      trend: 'up',
      icon: <TrendingUp size={24} color={colors.warning[600]} />,
      bgColor: colors.warning[50]
    },
    {
      label: 'Accuracy Score',
      value: '98.2%',
      change: '+0.4%',
      trend: 'up',
      icon: <BarChart3 size={24} color={colors.info} />,
      bgColor: colors.info + '10'
    }
  ], [metrics.totalValued, metrics.totalValue, formatCurrency]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div style={{ padding: isMobile ? spacing[4] : spacing[8], maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: spacing[8],
        gap: spacing[4]
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? typography.fontSizes.xl : typography.fontSizes['3xl'], fontWeight: typography.fontWeights.bold, color: colors.gray[900], marginBottom: spacing[1] }}>
            Performance Analytics
          </h1>
          <p style={{ color: colors.gray[500], fontSize: typography.fontSizes.sm }}>
            Monitor valuation throughput and team performance
          </p>
        </div>
        
        <button 
          aria-label="Select date range"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing[2], 
            backgroundColor: colors.white, 
            border: `1px solid ${colors.border}`, 
            padding: `${spacing[2]}px ${spacing[4]}px`, 
            borderRadius: 8,
            fontSize: typography.fontSizes.sm,
            fontWeight: typography.fontWeights.medium,
            color: colors.gray[700],
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <Calendar size={16} aria-hidden="true" /> Last 30 Days
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
        gap: spacing[6], 
        marginBottom: spacing[8] 
      }}>
        {stats.map((stat, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[4] }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 12, 
                backgroundColor: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4,
                fontSize: typography.fontSizes.xs,
                fontWeight: typography.fontWeights.semibold,
                color: stat.trend === 'up' ? colors.success : colors.error,
                backgroundColor: (stat.trend === 'up' ? colors.success : colors.error) + '10',
                padding: '2px 8px',
                borderRadius: 12,
                height: 'fit-content'
              }}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500], marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: typography.fontSizes['2xl'], fontWeight: typography.fontWeights.bold, color: colors.gray[900] }}>
              {isLoading ? '...' : stat.value}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isTablet ? '1fr' : '2fr 1fr', 
        gap: spacing[8] 
      }}>
        {/* Weekly Activity Mockup */}
        <Card title="Valuation Activity (Weekly)">
          <div 
            role="img" 
            aria-label="Bar chart showing valuation activity for the last 7 days. Monday: 45, Tuesday: 62, Wednesday: 58, Thursday: 75, Friday: 90, Saturday: 82, Sunday: 95."
            style={{ height: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: `0 ${spacing[4]}px` }}
          >
            {[45, 62, 58, 75, 90, 82, 95].map((height, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2], width: '10%' }}>
                <div 
                  aria-hidden="true"
                  style={{ 
                    width: '100%', 
                    height: `${height}%`, 
                    backgroundColor: i === 6 ? colors.primary[500] : colors.primary[200],
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} 
                />
                <span style={{ fontSize: typography.fontSizes.xs, color: colors.gray[500] }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Status Distribution */}
        <Card title="Workflow Health">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSizes.sm }}>
                <span id="label-completed" style={{ color: colors.gray[600] }}>Completed</span>
                <span style={{ fontWeight: typography.fontWeights.bold }}>{metrics.totalValued}</span>
              </div>
              <div 
                role="progressbar" 
                aria-labelledby="label-completed"
                aria-valuenow={75} 
                aria-valuemin={0} 
                aria-valuemax={100}
                style={{ height: 8, backgroundColor: colors.gray[100], borderRadius: 4, overflow: 'hidden' }}
              >
                <div style={{ width: '75%', height: '100%', backgroundColor: colors.success }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSizes.sm }}>
                <span id="label-pending" style={{ color: colors.gray[600] }}>Pending Review</span>
                <span style={{ fontWeight: typography.fontWeights.bold }}>{metrics.pendingReview}</span>
              </div>
              <div 
                role="progressbar" 
                aria-labelledby="label-pending"
                aria-valuenow={15} 
                aria-valuemin={0} 
                aria-valuemax={100}
                style={{ height: 8, backgroundColor: colors.gray[100], borderRadius: 4, overflow: 'hidden' }}
              >
                <div style={{ width: '15%', height: '100%', backgroundColor: colors.primary[500] }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSizes.sm }}>
                <span id="label-followup" style={{ color: colors.gray[600] }}>In Follow-up</span>
                <span style={{ fontWeight: typography.fontWeights.bold }}>{metrics.followUps}</span>
              </div>
              <div 
                role="progressbar" 
                aria-labelledby="label-followup"
                aria-valuenow={10} 
                aria-valuemin={0} 
                aria-valuemax={100}
                style={{ height: 8, backgroundColor: colors.gray[100], borderRadius: 4, overflow: 'hidden' }}
              >
                <div style={{ width: '10%', height: '100%', backgroundColor: colors.warning[500] }} />
              </div>
            </div>

            <div style={{ 
              marginTop: spacing[4],
              padding: spacing[4], 
              backgroundColor: colors.primary[50], 
              borderRadius: 12,
              display: 'flex',
              gap: spacing[3],
              alignItems: 'center'
            }}>
              <AlertCircle size={20} color={colors.primary[600]} />
              <div style={{ fontSize: typography.fontSizes.sm, color: colors.primary[800], lineHeight: 1.4 }}>
                <strong>Pro Tip:</strong> Resolving follow-ups within 4 hours increases accuracy scores by 15%.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
