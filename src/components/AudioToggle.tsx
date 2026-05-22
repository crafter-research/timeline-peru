/**
 * Audio Toggle Component
 * Allows users to enable/disable sound effects
 */

import { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundManager';

interface AudioToggleProps {
  onToggle?: (enabled: boolean) => void;
}

export function AudioToggle({ onToggle }: AudioToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(soundManager.isEnabled());
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    soundManager.setEnabled(newState);
    setIsEnabled(newState);
    onToggle?.(newState);

    // Play test sound
    if (newState) {
      soundManager.playSuccess();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="audio-indicator gpu-accelerated"
      aria-label={isEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}
      title={isEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}
    >
      {isEnabled ? (
        <div className="flex items-center gap-1">
          <div className="audio-wave-bar"></div>
          <div className="audio-wave-bar"></div>
          <div className="audio-wave-bar"></div>
        </div>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      )}
    </button>
  );
}
