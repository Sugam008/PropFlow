'use client';

import { colors } from '@propflow/theme';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div
      role="list"
      aria-label="Progress"
      style={{
        width: '100%',
        marginBottom: '40px',
        padding: '0 8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Background Line */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              role="listitem"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? colors.success[400]
                    : isActive
                      ? colors.white
                      : 'rgba(255,255,255,0.1)',
                  border: isActive ? `4px solid ${colors.primary[400]}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted || isActive ? colors.primary[900] : 'rgba(255,255,255,0.3)',
                  fontSize: 12,
                  fontWeight: 800,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.4)' : 'none',
                }}
              >
                {isCompleted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                  fontWeight: isActive ? 800 : 600,
                  marginTop: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  textAlign: 'center',
                  display: 'block',
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
