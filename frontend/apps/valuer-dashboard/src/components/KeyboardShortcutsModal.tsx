import { colors } from '@propflow/theme';
import { Keyboard } from 'lucide-react';
import React from 'react';
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
      <div style={{ paddingBottom: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
            padding: 24,
            backgroundColor: `${colors.primary[50]}80`,
            borderRadius: 24,
            border: `1px solid ${colors.primary[100]}`,
          }}
        >
          <Keyboard size={32} color={colors.primary[600]} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 14,
              color: colors.gray[600],
              lineHeight: 1.6,
            }}
          >
            Enhance your efficiency with keyboard precision. These shortcuts work across the entire{' '}
            <strong>PropFlow</strong> workspace.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayShortcuts.map((shortcut, index) => {
            if (!shortcut.key) {
              return (
                <div
                  key={`divider-${index}`}
                  style={{
                    height: '2px',
                    backgroundColor: colors.gray[100],
                    margin: '12px 0',
                    borderRadius: 1,
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
                  padding: '12px 16px',
                  borderRadius: 16,
                  transition: 'background 0.2s',
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: colors.gray[800],
                  }}
                >
                  {shortcut.description}
                </span>
                <kbd
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    height: '40px',
                    padding: '0 12px',
                    backgroundColor: colors.white,
                    border: `2px solid ${colors.gray[100]}`,
                    borderRadius: 12,
                    boxShadow: '0 4px 0 rgba(0,0,0,0.05)',
                    fontSize: 14,
                    fontWeight: 800,
                    color: colors.primary[600],
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
