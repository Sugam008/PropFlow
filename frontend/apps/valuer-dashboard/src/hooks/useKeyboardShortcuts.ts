import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (!keyMatch) continue;

        // Check modifiers
        const hasCtrl = shortcut.modifiers?.includes('ctrl') ?? false;
        const hasAlt = shortcut.modifiers?.includes('alt') ?? false;
        const hasShift = shortcut.modifiers?.includes('shift') ?? false;
        const hasMeta = shortcut.modifiers?.includes('meta') ?? false;

        const modifierMatch =
          event.ctrlKey === hasCtrl &&
          event.altKey === hasAlt &&
          event.shiftKey === hasShift &&
          event.metaKey === hasMeta;

        if (modifierMatch) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Common shortcuts for valuer dashboard
export const createQueueShortcuts = (
  onNavigateUp: () => void,
  onNavigateDown: () => void,
  onOpenSelected: () => void,
  onShowHelp: () => void,
): KeyboardShortcut[] => [
  { key: 'j', description: 'Navigate down', handler: onNavigateDown },
  { key: 'k', description: 'Navigate up', handler: onNavigateUp },
  { key: 'Enter', description: 'Open selected', handler: onOpenSelected },
  { key: '?', description: 'Show keyboard shortcuts', handler: onShowHelp },
];

export const createReviewShortcuts = (
  onApprove: () => void,
  onFollowUp: () => void,
  onFlag: () => void,
  onNextPhoto: () => void,
  onPrevPhoto: () => void,
  onFullscreen: () => void,
  onBack: () => void,
): KeyboardShortcut[] => [
  { key: 'a', description: 'Approve valuation', handler: onApprove },
  { key: 'r', description: 'Request follow-up', handler: onFollowUp },
  { key: 'f', description: 'Flag for review', handler: onFlag },
  { key: 'ArrowRight', description: 'Next photo', handler: onNextPhoto },
  { key: 'ArrowLeft', description: 'Previous photo', handler: onPrevPhoto },
  { key: 'e', description: 'Toggle fullscreen', handler: onFullscreen },
  { key: 'Escape', description: 'Go back', handler: onBack },
];

export const createNumberShortcuts = (handlers: (() => void)[]): KeyboardShortcut[] => {
  return handlers.map((handler, index) => ({
    key: (index + 1).toString(),
    description: `Jump to item ${index + 1}`,
    handler,
  }));
};
