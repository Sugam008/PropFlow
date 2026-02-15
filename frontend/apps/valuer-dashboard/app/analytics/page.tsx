'use client';

import { colors, shadow, spacing } from '@propflow/theme';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, Calendar, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import React from 'react';
import { propertyApi } from '../../src/api/properties';
import { Card } from '../../src/components/Card';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { useToast } from '../../src/providers/ToastProvider';

export default function AnalyticsPage() {
  const { showToast } = useToast();
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties(),
  });

  const metrics = React.useMemo(() => {
    const valued = properties?.filter((p) => p.status === 'VALUED') || [];
    const totalValued = valued.length;
    const pendingReview = properties?.filter((p) => p.status === 'SUBMITTED').length || 0;
    const followUps = properties?.filter((p) => p.status === 'FOLLOW_UP').length || 0;

    const totalValue = valued
      .filter((p) => p.estimated_value)
      .reduce((sum, p) => sum + (p.estimated_value || 0), 0);

    return { totalValued, pendingReview, followUps, totalValue };
  }, [properties]);

  const formatCurrency = React.useCallback((val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }, []);

  const stats = React.useMemo(
    () => [
      {
        label: 'Total Valuations',
        value: metrics.totalValued,
        change: '+12%',
        trend: 'up',
        icon: CheckCircle2,
        iconColor: colors.success[500],
        bgColor: colors.success[50],
      },
      {
        label: 'Avg. Turnaround',
        value: '1.4 Days',
        change: '-5%',
        trend: 'up',
        icon: Clock,
        iconColor: colors.primary[500],
        bgColor: colors.primary[50],
      },
      {
        label: 'Portfolio Value',
        value: formatCurrency(metrics.totalValue),
        change: '+18%',
        trend: 'up',
        icon: TrendingUp,
        iconColor: colors.warning[500],
        bgColor: colors.warning[50],
      },
      {
        label: 'Accuracy Score',
        value: '98.2%',
        change: '+0.4%',
        trend: 'up',
        icon: BarChart3,
        iconColor: colors.info[500],
        bgColor: colors.info[50],
      },
    ],
    [metrics.totalValued, metrics.totalValue, formatCurrency],
  );

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div
      style={{
        minHeight: '100%',
        backgroundColor: colors.gray[50],
        position: 'relative',
        paddingBottom: spacing[20],
      }}
    >
      {/* Premium Background Effects */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-5%',
            right: '-10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, rgba(0, 100, 255, 0.04) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '-15%',
            width: '70vw',
            height: '70vw',
            background: 'radial-gradient(circle, rgba(100, 0, 255, 0.03) 0%, transparent 70%)',
            filter: 'blur(140px)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: isMobile ? spacing[6] : `${spacing[10]}px ${spacing[12]}px`,
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing[12] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: colors.primary[600],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 8px 20px ${colors.primary[600]}33`,
              }}
            >
              <BarChart3 size={22} />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                color: colors.primary[700],
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Intelligence Suite
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: isMobile ? 36 : 56,
                  fontWeight: 900,
                  color: colors.gray[900],
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: -2,
                }}
              >
                Performance <span style={{ color: colors.primary[600] }}>Analytics</span>
              </h1>
              <p
                style={{
                  color: colors.gray[500],
                  fontSize: 18,
                  marginTop: 16,
                  fontWeight: 500,
                  maxWidth: 640,
                  lineHeight: 1.6,
                }}
              >
                Visualize throughput metrics, accuracy distributions, and turnaround efficiency
                benchmarked against quarterly valuation targets.
              </p>
            </div>

            <motion.button
              whileHover={{ y: -2, boxShadow: shadow.md }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast('Configuring intelligence filters...', 'info')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray[200]}`,
                padding: '14px 24px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 800,
                color: colors.gray[700],
                cursor: 'pointer',
                boxShadow: shadow.sm,
              }}
            >
              <Calendar size={18} color={colors.primary[500]} /> Last 30 Days
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 24,
            marginBottom: spacing[12],
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                variant="glass"
                style={{
                  padding: 24,
                  borderRadius: 32,
                  border: `1px solid ${colors.gray[100]}`,
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon size={24} color={stat.iconColor} />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 900,
                      color: stat.trend === 'up' ? colors.success[600] : colors.error[600],
                      backgroundColor: stat.trend === 'up' ? colors.success[50] : colors.error[50],
                      padding: '4px 10px',
                      borderRadius: 12,
                    }}
                  >
                    {stat.trend === 'up' ? <TrendingUp size={12} /> : <AlertCircle size={12} />}
                    {stat.change}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: colors.gray[900],
                    marginBottom: 4,
                    letterSpacing: -1,
                  }}
                >
                  {isLoading ? '...' : stat.value}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.gray[500] }}>
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Insights Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '2fr 1fr',
            gap: 32,
          }}
        >
          {/* Activity Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              variant="glass"
              style={{
                borderRadius: 40,
                border: `1px solid ${colors.gray[100]}`,
                padding: 40,
                height: '100%',
                backgroundColor: 'white',
              }}
            >
              <div style={{ marginBottom: 40 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 900,
                    color: colors.gray[900],
                    letterSpacing: -0.5,
                  }}
                >
                  Throughput Trajectory
                </h3>
                <p style={{ color: colors.gray[400], fontSize: 13, fontWeight: 600, marginTop: 8 }}>
                  Weekly distribution of finalized property valuations across active regions.
                </p>
              </div>

              <div
                style={{
                  height: 320,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 16,
                  paddingBottom: 20,
                }}
              >
                {[45, 62, 58, 75, 90, 82, 95].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        style={{
                          width: '100%',
                          maxWidth: 50,
                          backgroundColor: i === 6 ? colors.primary[600] : colors.primary[100],
                          borderRadius: '12px 12px 4px 4px',
                          position: 'relative',
                          boxShadow: i === 6 ? `0 10px 20px ${colors.primary[600]}33` : 'none',
                        }}
                      >
                        {i === 6 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: -30,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: 11,
                              fontWeight: 900,
                              color: colors.primary[600],
                            }}
                          >
                            PEAK
                          </div>
                        )}
                      </motion.div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: colors.gray[400],
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Workflow Distribution Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card
              variant="glass"
              style={{
                borderRadius: 40,
                border: `1px solid ${colors.gray[100]}`,
                padding: 40,
                height: '100%',
                backgroundColor: 'white',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 900,
                  color: colors.gray[900],
                  letterSpacing: -0.5,
                  marginBottom: 40,
                }}
              >
                Workflow Integrity
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  {
                    label: 'Valuations Finalized',
                    value: metrics.totalValued,
                    total: 100,
                    color: colors.success[600],
                  },
                  {
                    label: 'Verification Queue',
                    value: metrics.pendingReview,
                    total: 100,
                    color: colors.primary[600],
                  },
                  {
                    label: 'Follow-up Latency',
                    value: metrics.followUps,
                    total: 100,
                    color: colors.warning[600],
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: colors.gray[500] }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 900, color: colors.gray[900] }}>
                        {item.value}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 10,
                        backgroundColor: colors.gray[50],
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / item.total) * 100}%` }}
                        transition={{ duration: 1, delay: 0.8 + idx * 0.2 }}
                        style={{ height: '100%', backgroundColor: item.color, borderRadius: 10 }}
                      />
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 20,
                    padding: 24,
                    backgroundColor: colors.primary[50],
                    borderRadius: 24,
                    border: `1px solid ${colors.primary[100]}`,
                    display: 'flex',
                    gap: 16,
                  }}
                >
                  <AlertCircle size={20} color={colors.primary[600]} style={{ flexShrink: 0 }} />
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: colors.primary[700],
                        marginBottom: 4,
                      }}
                    >
                      Optimization Alert
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.primary[600],
                        lineHeight: 1.6,
                        fontWeight: 600,
                      }}
                    >
                      Efficiency is trending 8% higher than last week. Maintain current throughput
                      to exceed monthly quota.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
