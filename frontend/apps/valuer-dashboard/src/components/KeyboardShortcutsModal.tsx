import React from 'react';
import { Keyboard } from 'lucide-react';
import { colors, spacing, typography } from '@propflow/theme';
import { Modal } from './Modal';

interface Shortcut {
  key: string;
  description: string;
  modifiers?: string[];
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts?: Shortcut[];
}

const defaultQueueShortcuts: Shortcut[] = [
  { key: 'J', description: 'Navigate down in queue' },
  { key: 'K', description: 'Navigate up in queue' },
  { key: 'Enter', description: 'Open selected property' },
  { key: '1-9', description: 'Jump to property at position' },
  { key: '?', description: 'Show keyboard shortcuts' },
];

const defaultReviewShortcuts: Shortcut[] = [
  { key: 'A', description: 'Approve valuation' },
  { key: 'R', description: 'Request follow-up' },
  { key: 'F', description: 'Flag for review' },
  { key: '←', description: 'Previous photo' },
  { key: '→', description: 'Next photo' },
  { key: 'E', description: 'Toggle fullscreen' },
  { key: 'Esc', description: 'Go back / close modal' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
}) => {
  const displayShortcuts = shortcuts || [
    ...defaultQueueShortcuts,
    { key: '', description: '' },
    ...defaultReviewShortcuts,
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div style={{ padding: spacing[4] }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            marginBottom: spacing[6],
            padding: spacing[4],
            backgroundColor: colors.primary[50],
            borderRadius: '8px',
          }}
        >
          <Keyboard size={24} color={colors.primary[500]} />
          <span
            style={{
              fontSize: typography.fontSizes.sm,
              color: colors.gray[700],
            }}
          >
            Use these shortcuts to navigate faster. Press <strong>?</strong> anytime to see this
            help.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
          {displayShortcuts.map((shortcut, index) => {
            if (!shortcut.key) {
              return (
                <div
                  key={`divider-${index}`}
                  style={{
                    height: '1px',
                    backgroundColor: colors.gray[200],
                    margin: `${spacing[2]}px 0`,
                  }}
                />
              );
            }

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing[2]}px 0`,
                }}
              >
                <span
                  style={{
                    fontSize: typography.fontSizes.sm,
                    color: colors.gray[700],
                  }}
                >
                  {shortcut.description}
                </span>
                <kbd
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '32px',
                    height: '32px',
                    padding: `0 ${spacing[3]}px`,
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: '6px',
                    boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
                    fontSize: typography.fontSizes.sm,
                    fontWeight: typography.fontWeights.semibold as any,
                    color: colors.gray[800],
                    fontFamily: 'monospace',
                  }}
                >
                  {shortcut.key}
                </kbd>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsModal;
