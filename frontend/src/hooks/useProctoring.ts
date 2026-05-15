'use client';

import { useEffect, useCallback } from 'react';

interface ProctoringOptions {
  onViolation: (type: string, details: string) => void;
  enabled: boolean;
}

export const useProctoring = ({ onViolation, enabled }: ProctoringOptions) => {
  const reportViolation = useCallback((type: string, details: string) => {
    if (enabled) {
      onViolation(type, details);
    }
  }, [enabled, onViolation]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Tab Switching / Visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportViolation('TAB_SWITCH', 'User switched to another tab or minimized the window.');
      }
    };

    // 2. Window Blur (Focus Loss)
    const handleBlur = () => {
      reportViolation('WINDOW_BLUR', 'User lost focus on the exam window.');
    };

    // 3. Fullscreen Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        reportViolation('FULLSCREEN_EXIT', 'User exited full-screen mode.');
      }
    };

    // 4. Disable Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportViolation('CONTEXT_MENU', 'User attempted to right-click.');
    };

    // 5. Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        reportViolation('SCREENSHOT', 'User attempted to take a screenshot.');
      }

      // Prevent Copy/Paste/Cut (Ctrl+C, Ctrl+V, Ctrl+X)
      if (e.ctrlKey && ['c', 'v', 'x', 'a', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        reportViolation('KEYBOARD_SHORTCUT', `User attempted shortcut: Ctrl+${e.key.toUpperCase()}`);
      }

      // Prevent Inspect Element (Ctrl+Shift+I, F12)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        reportViolation('INSPECT_ELEMENT', 'User attempted to open developer tools.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, reportViolation]);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  return { enterFullscreen };
};
