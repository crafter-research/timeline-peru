/**
 * Mobile Gesture Utilities
 * Enhanced touch interactions for mobile devices
 */

export interface SwipeConfig {
  threshold: number;
  timeout: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface PullToRefreshConfig {
  threshold: number;
  onRefresh: () => Promise<void>;
  maxPull?: number;
}

/**
 * Swipe gesture detector
 */
export function useSwipeGesture(
  element: HTMLElement,
  config: SwipeConfig
): () => void {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = touchEndTime - touchStartTime;

    // Check if swipe was fast enough
    if (deltaTime > config.timeout) return;

    // Determine swipe direction
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY && absDeltaX > config.threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        config.onSwipeRight?.();
      } else {
        config.onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > config.threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        config.onSwipeDown?.();
      } else {
        config.onSwipeUp?.();
      }
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Pull-to-refresh gesture
 */
export function usePullToRefresh(
  element: HTMLElement,
  config: PullToRefreshConfig
): () => void {
  const maxPull = config.maxPull || 150;
  let touchStartY = 0;
  let isPulling = false;
  let currentPull = 0;

  const indicator = document.createElement('div');
  indicator.className = 'pull-refresh-indicator';
  indicator.innerHTML = '<div class="pull-refresh-spinner"></div>';
  document.body.appendChild(indicator);

  const updateIndicator = (distance: number) => {
    const progress = Math.min(distance / config.threshold, 1);
    currentPull = distance;
    indicator.style.setProperty('--pull-distance', `${Math.min(distance, maxPull)}px`);
  };

  const handleTouchStart = (e: TouchEvent) => {
    // Only trigger if at top of page
    if (element.scrollTop === 0) {
      touchStartY = e.touches[0].clientY;
      isPulling = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;

    if (deltaY > 0 && element.scrollTop === 0) {
      e.preventDefault();
      updateIndicator(deltaY);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    isPulling = false;

    if (currentPull >= config.threshold) {
      // Trigger refresh
      indicator.style.setProperty('--pull-distance', `${maxPull}px`);
      try {
        await config.onRefresh();
      } finally {
        indicator.style.setProperty('--pull-distance', '-100%');
      }
    } else {
      // Reset
      indicator.style.setProperty('--pull-distance', '-100%');
    }

    currentPull = 0;
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    indicator.remove();
  };
}

/**
 * Touch ripple effect
 */
export function createTouchRipple(
  element: HTMLElement,
  x: number,
  y: number
): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ripple = document.createElement('div');
  ripple.className = 'touch-ripple';

  const size = Math.max(element.clientWidth, element.clientHeight);
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;

  const rect = element.getBoundingClientRect();
  ripple.style.left = `${x - rect.left - size / 2}px`;
  ripple.style.top = `${y - rect.top - size / 2}px`;

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

/**
 * Add touch ripple to all buttons
 */
export function enableTouchRipples(container: HTMLElement = document.body): void {
  const handleTouch = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      const button = target.tagName === 'BUTTON' ? target : target.closest('button')!;
      const touch = e.touches[0];
      createTouchRipple(button, touch.clientX, touch.clientY);
    }
  };

  container.addEventListener('touchstart', handleTouch, { passive: true });
}
