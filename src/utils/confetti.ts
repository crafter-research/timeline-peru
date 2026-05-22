/**
 * Confetti Particle System
 * Creates celebratory particle effects
 */

export interface ConfettiOptions {
  particleCount?: number;
  colors?: string[];
  duration?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

const DEFAULT_COLORS = [
  '#C4342D', // Peru red
  '#FFFFFF', // White
  '#D4A574', // Gold
  '#8B7355', // Brown
  '#FFE8C5', // Light gold
];

/**
 * Create a single confetti particle
 */
function createParticle(
  container: HTMLElement,
  color: string,
  delay: number,
  origin: { x: number; y: number }
): HTMLDivElement {
  const particle = document.createElement('div');
  particle.className = 'confetti-particle';

  // Random shape
  const shapes = ['square', 'circle', 'rectangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  particle.classList.add(`confetti-particle-${shape}`);

  // Random size
  const size = Math.random() * 8 + 6;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  // Color
  particle.style.backgroundColor = color;

  // Starting position (origin)
  particle.style.left = `${origin.x}px`;
  particle.style.top = `${origin.y}px`;

  // Random horizontal offset
  const horizontalOffset = (Math.random() - 0.5) * 300;
  particle.style.setProperty('--horizontal-offset', `${horizontalOffset}px`);

  // Animation delay
  particle.style.animationDelay = `${delay}ms`;

  // Random animation duration
  const duration = Math.random() * 1000 + 2000;
  particle.style.animationDuration = `${duration}ms`;

  return particle;
}

/**
 * Launch confetti effect
 */
export function launchConfetti(options: ConfettiOptions = {}): void {
  const {
    particleCount = 50,
    colors = DEFAULT_COLORS,
    duration = 3000,
    spread = 360,
    origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  } = options;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  // Create particles
  const particles: HTMLDivElement[] = [];
  for (let i = 0; i < particleCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 300;
    const particle = createParticle(container, color, delay, origin);
    particles.push(particle);
    container.appendChild(particle);
  }

  // Clean up after animation
  setTimeout(() => {
    container.remove();
  }, duration + 500);
}

/**
 * Launch confetti from multiple origins (fireworks effect)
 */
export function launchFireworks(count: number = 3): void {
  const origins = [
    { x: window.innerWidth * 0.25, y: window.innerHeight * 0.3 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
    { x: window.innerWidth * 0.75, y: window.innerHeight * 0.3 },
  ];

  origins.slice(0, count).forEach((origin, index) => {
    setTimeout(() => {
      launchConfetti({
        particleCount: 30,
        origin,
      });
    }, index * 200);
  });
}

/**
 * Confetti burst effect (from a specific element)
 */
export function confettiBurst(element: HTMLElement, particleCount: number = 20): void {
  const rect = element.getBoundingClientRect();
  const origin = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  launchConfetti({
    particleCount,
    origin,
    spread: 120,
  });
}
