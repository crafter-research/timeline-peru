/**
 * Round 4 Enhancement Hook
 * Integrates all advanced microinteractions, parallax, sound, and mobile gestures
 */

import { useEffect, useRef, RefObject } from 'react';
import { soundManager } from '../utils/soundManager';
import { launchConfetti, confettiBurst } from '../utils/confetti';
import { ParallaxScroller } from '../utils/parallax';
import {
  useSwipeGesture,
  usePullToRefresh,
  enableTouchRipples,
} from '../utils/mobileGestures';

export interface Round4Config {
  enableParallax?: boolean;
  enableSound?: boolean;
  enableMobileGestures?: boolean;
  enableConfetti?: boolean;
}

export function useRound4Enhancements(
  containerRef: RefObject<HTMLDivElement>,
  config: Round4Config = {}
) {
  const {
    enableParallax = true,
    enableSound = false, // Muted by default per requirements
    enableMobileGestures = true,
    enableConfetti = true,
  } = config;

  const parallaxRef = useRef<ParallaxScroller | null>(null);
  const cleanupFnsRef = useRef<Array<() => void>>([]);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setEnabled(enableSound);
  }, [enableSound]);

  // Setup parallax effects
  useEffect(() => {
    if (!enableParallax || !containerRef.current) return;

    const container = containerRef.current;
    const parallax = new ParallaxScroller(container);
    parallaxRef.current = parallax;

    // Register era backgrounds for parallax
    const eraBackgrounds = container.querySelectorAll('.era-background');
    eraBackgrounds.forEach((bg, index) => {
      parallax.register(bg as HTMLElement, {
        intensity: 0.05 + index * 0.01, // Stagger intensity
        direction: 'horizontal',
        friction: 0.8,
      });
    });

    return () => {
      parallax.destroy();
      parallaxRef.current = null;
    };
  }, [enableParallax, containerRef]);

  // Setup mobile gestures
  useEffect(() => {
    if (!enableMobileGestures || !containerRef.current) return;
    if (typeof window === 'undefined') return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const container = containerRef.current;

    // Enable touch ripples
    enableTouchRipples(container);

    // Swipe gestures for navigation
    const swipeCleanup = useSwipeGesture(container, {
      threshold: 50,
      timeout: 300,
      onSwipeLeft: () => {
        // Visual feedback
        if (enableSound) soundManager.playWhoosh();
      },
      onSwipeRight: () => {
        // Visual feedback
        if (enableSound) soundManager.playWhoosh();
      },
    });

    cleanupFnsRef.current.push(swipeCleanup);

    // Pull to refresh (optional - can be disabled)
    const pullCleanup = usePullToRefresh(container, {
      threshold: 80,
      onRefresh: async () => {
        // Simulate refresh
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (enableSound) soundManager.playSuccess();
      },
    });

    cleanupFnsRef.current.push(pullCleanup);

    return () => {
      cleanupFnsRef.current.forEach((cleanup) => cleanup());
      cleanupFnsRef.current = [];
    };
  }, [enableMobileGestures, enableSound, containerRef]);

  // Utility functions to expose
  const playSound = (type: 'click' | 'whoosh' | 'success' | 'error' | 'celebration') => {
    if (enableSound) {
      soundManager.play(type);
    }
  };

  const triggerConfetti = (element?: HTMLElement) => {
    if (!enableConfetti) return;

    if (element) {
      confettiBurst(element, 30);
    } else {
      launchConfetti({
        particleCount: 50,
        origin: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      });
    }

    if (enableSound) {
      soundManager.playCelebration();
    }
  };

  const toggleSound = () => {
    const newState = !soundManager.isEnabled();
    soundManager.setEnabled(newState);
    return newState;
  };

  return {
    playSound,
    triggerConfetti,
    toggleSound,
    isSoundEnabled: soundManager.isEnabled(),
  };
}
