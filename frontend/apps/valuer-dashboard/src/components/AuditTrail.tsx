import React from 'react';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { colors, spacing, typography } from '@propflow/theme';

export interface AuditEntry {
  id: string;
  timestamp: string;
  action:
    | 'created'
    | 'submitted'
    | 'assigned'
    | 'reviewed'
    | 'approved'
    | 'rejected'
    | 'follow_up'
    | 'completed';
  actor: {
    id: string;
    name: string;
    role: string;
  };
  details?: string;
  metadata?: Record<string, any>;
}

interface AuditTrailProps {
  entries: AuditEntry[];
  className?: string;
}

const actionConfig: Record<AuditEntry['action'], { icon: any; color: string; label: string }> = {
  created: { icon: FileText, color: colors.info, label: 'Property Created' },
  submitted: { icon: ArrowRight, color: colors.info, label: 'Submitted for Review' },
  assigned: { icon: User, color: colors.warning, label: 'Assigned to Valuer' },
  reviewed: { icon: Clock, color: colors.warning, label: 'Review Started' },
  approved: { icon: CheckCircle2, color: colors.success, label: 'Valuation Approved' },
  rejected: { icon: AlertCircle, color: colors.error, label: 'Valuation Rejected' },
  follow_up: { icon: MessageSquare, color: colors.warning, label: 'Follow-up Requested' },
  completed: { icon: CheckCircle2, color: colors.success, label: 'Process Completed' },
};

export const AuditTrail: React.FC<AuditTrailProps> = ({ entries, className }) => {
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={className} style={{ width: '100%' }}>
      <h3
        style={{
          fontSize: typography.fontSizes.lg,
          fontWeight: typography.fontWeights.semibold as any,
          color: colors.gray[900],
          marginBottom: spacing[4],
        }}
      >
        Audit Trail
      </h3>

      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '2px',
            backgroundColor: colors.gray[200],
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
          {entries.map((entry, index) => {
            const config = actionConfig[entry.action];
            const Icon = config.icon;

            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  gap: spacing[4],
                  position: 'relative',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: colors.white,
                    border: `2px solid ${config.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Icon size={18} color={config.color} />
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    padding: spacing[3],
                    backgroundColor: colors.gray[50],
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: spacing[1],
                    }}
                  >
                    <span
                      style={{
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.semibold as any,
                        color: colors.gray[900],
                      }}
                    >
                      {config.label}
                    </span>
                    <span
                      style={{
                        fontSize: typography.fontSizes.xs,
                        color: colors.gray[500],
                      }}
                    >
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: typography.fontSizes.sm,
                      color: colors.gray[600],
                      marginBottom: spacing[1],
                    }}
                  >
                    By <strong>{entry.actor.name}</strong> ({entry.actor.role})
                  </div>

                  {entry.details && (
                    <div
                      style={{
                        fontSize: typography.fontSizes.sm,
                        color: colors.gray[700],
                        marginTop: spacing[2],
                        padding: spacing[2],
                        backgroundColor: colors.white,
                        borderRadius: '4px',
                      }}
                    >
                      {entry.details}
                    </div>
                  )}

                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                    <div
                      style={{
                        marginTop: spacing[2],
                        fontSize: typography.fontSizes.xs,
                        color: colors.gray[500],
                      }}
                    >
                      {Object.entries(entry.metadata).map(([key, value]) => (
                        <div key={key}>
                          {key}: {JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
