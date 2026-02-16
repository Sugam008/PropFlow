'use client';

import { colors } from '@propflow/theme';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div role="list" aria-label="Progress" style={{ width: '100%', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={index}
              role="listitem"
              style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor:
                      isCompleted || isActive ? colors.primary[600] : colors.gray[200],
                    color: isCompleted || isActive ? 'white' : colors.gray[500],
                    fontSize: '14px',
                    fontWeight: 600,
                    marginRight: '8px',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {index + 1}
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: isActive ? colors.gray[900] : colors.gray[500],
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step}
                </span>
              </div>

              {!isLast && (
                <div
                  style={{
                    height: '2px',
                    flex: 1,
                    backgroundColor: isCompleted ? colors.primary[600] : colors.gray[200],
                    margin: '0 12px',
                    minWidth: '20px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
