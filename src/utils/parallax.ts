/**
 * Parallax Effects Utility
 * Subtle depth effects on scroll
 */

export interface ParallaxConfig {
  intensity?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
  friction?: number;
}

/**
 * Apply parallax effect to an element based on scroll position
 */
export function applyParallax(
  element: HTMLElement,
  scrollProgress: number,
  config: ParallaxConfig = {}
): void {
  const { intensity = 0.1, direction = 'horizontal', friction = 0.5 } = config;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const movement = scrollProgress * intensity * 100;
  const smoothMovement = movement * friction;

  switch (direction) {
    case 'horizontal':
      element.style.transform = `translate3d(${smoothMovement}px, 0, 0)`;
      break;
    case 'vertical':
      element.style.transform = `translate3d(0, ${smoothMovement}px, 0)`;
      break;
    case 'both':
      element.style.transform = `translate3d(${smoothMovement}px, ${smoothMovement}px, 0)`;
      break;
  }
}

/**
 * Parallax scroll controller with RAF optimization
 */
export class ParallaxScroller {
  private elements: Map<HTMLElement, ParallaxConfig> = new Map();
  private rafId: number | null = null;
  private scrollProgress: number = 0;

  constructor(private container: HTMLElement) {
    this.handleScroll = this.handleScroll.bind(this);
    container.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  /**
   * Register an element for parallax effect
   */
  register(element: HTMLElement, config: ParallaxConfig = {}): void {
    this.elements.set(element, config);
  }

  /**
   * Unregister an element
   */
  unregister(element: HTMLElement): void {
    this.elements.delete(element);
  }

  /**
   * Handle scroll event with RAF throttling
   */
  private handleScroll(): void {
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      const { scrollLeft, scrollWidth, clientWidth } = this.container;
      const maxScroll = scrollWidth - clientWidth;
      this.scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

      this.update();
      this.rafId = null;
    });
  }

  /**
   * Update all registered elements
   */
  private update(): void {
    this.elements.forEach((config, element) => {
      applyParallax(element, this.scrollProgress, config);
    });
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.container.removeEventListener('scroll', this.handleScroll);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.elements.clear();
  }
}

/**
 * Magnetic hover effect - pulls element toward cursor
 */
export function applyMagneticEffect(
  element: HTMLElement,
  event: MouseEvent,
  strength: number = 0.3
): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = (event.clientX - centerX) * strength;
  const deltaY = (event.clientY - centerY) * strength;

  element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
}

/**
 * Reset magnetic effect
 */
export function resetMagneticEffect(element: HTMLElement): void {
  element.style.transform = 'translate3d(0, 0, 0)';
}

/**
 * Create magnetic hover controller for event dots
 */
export class MagneticHover {
  private isHovering = false;
  private rafId: number | null = null;

  constructor(
    private element: HTMLElement,
    private strength: number = 0.3
  ) {
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    element.addEventListener('mouseenter', this.handleMouseEnter);
    element.addEventListener('mousemove', this.handleMouseMove);
    element.addEventListener('mouseleave', this.handleMouseLeave);
  }

  private handleMouseEnter(): void {
    this.isHovering = true;
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.isHovering) return;
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      applyMagneticEffect(this.element, event, this.strength);
      this.rafId = null;
    });
  }

  private handleMouseLeave(): void {
    this.isHovering = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    resetMagneticEffect(this.element);
  }

  destroy(): void {
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
