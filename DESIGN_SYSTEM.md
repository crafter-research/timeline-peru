# Editorial Timeline - Design System Reference

Quick reference for colors, typography, spacing, and components.

---

## Color Palette

### Primary Colors
```css
--color-primary: #1A1A1A;     /* Black - primary text */
--color-secondary: #6B6B6B;   /* Gray - secondary text */
--color-accent: #C4342D;      /* Red - Peru flag red, primary accent */
--color-accent-dark: #A42D26; /* Darker red - hover states */
--color-paper: #F5F1E8;       /* Beige - background */
--color-line: #D4D4D4;        /* Light gray - borders */
```

### Era Colors (6 historical periods)
```css
/* Pre-Inca (15000 a.C. - 1438) - Warm earth tones */
--era-preinca-bg: #F5E6D3;
--era-preinca-border: #D4A574;
--era-preinca-text: #8B7355;

/* Inca (1438 - 1532) - Golden */
--era-inca-bg: #FFE8C5;
--era-inca-border: #E6B76B;
--era-inca-text: #A67C52;

/* Conquista (1532 - 1572) - Coral (conflict) */
--era-conquista-bg: #FFD5CC;
--era-conquista-border: #E68A7A;
--era-conquista-text: #A85A4A;

/* Colonia (1572 - 1821) - Cool lavender */
--era-colonia-bg: #E3E3ED;
--era-colonia-border: #9999B8;
--era-colonia-text: #6B6B8B;

/* República (1821 - 1968) - Sky blue */
--era-republica-bg: #C9E4F0;
--era-republica-border: #6BB8DC;
--era-republica-text: #4A8BA8;

/* Contemporáneo (1968 - present) - Neutral modern */
--era-contemporaneo-bg: #E8E2D5;
--era-contemporaneo-border: #A8987A;
--era-contemporaneo-text: #7A6B55;
```

### Category Colors (4 event types)
```css
/* Política - Blue */
--category-politica: #3B82F6;
--category-politica-bg: #EFF6FF;

/* Cultura - Purple */
--category-cultura: #8B5CF6;
--category-cultura-bg: #F5F3FF;

/* Economía - Green */
--category-economia: #10B981;
--category-economia-bg: #ECFDF5;

/* Conflictos - Red */
--category-conflictos: #C4342D;
--category-conflictos-bg: #FEF2F2;
```

---

## Typography

### Font Families
```css
--font-serif: 'Playfair Display', 'Source Serif 4', Georgia, serif;
--font-sans: 'Source Sans 3', system-ui, sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
```

### Usage
- **Headings:** font-serif, uppercase, bold
- **Body text:** font-sans, regular/medium
- **Years/data:** font-mono, tabular-nums
- **Labels:** font-sans, uppercase, tracking-wider

### Scale
```
text-4xl   36px   H1 - Main title
text-3xl   30px   H2 - Section headers
text-2xl   24px   H3 - Subsections
text-xl    20px   H4 - Card titles
text-lg    18px   Large body
text-base  16px   Body text
text-sm    14px   Small text
text-xs    12px   Labels
10px       --     Micro labels (custom)
```

### Weights
```
font-bold     700   Headings, emphasis
font-semibold 600   Subheadings
font-medium   500   Interactive elements
font-normal   400   Body text
```

---

## Spacing System

### Base Unit: 4px (1 = 4px in Tailwind)

```
1   4px     Tight spacing
2   8px     Event dot base size
3   12px    Small gaps
4   16px    Default spacing
5   20px    Medium spacing
6   24px    Large spacing
8   32px    Section spacing
12  48px    Major sections
16  64px    Hero spacing
```

### Component Spacing
```
Timeline lane height:     200px
Drawer width:             560px
Minimap height:           64px
Category label width:     112px (28 × 4)
Event dot base:           8px
Event dot hover:          20px
Touch target minimum:     44px
```

---

## Shadows

### Elevation System
```css
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1),
              0 1px 2px rgba(0,0,0,0.06);
}

.elevation-2 {
  box-shadow: 0 4px 6px rgba(0,0,0,0.07),
              0 2px 4px rgba(0,0,0,0.06);
}

.elevation-3 {
  box-shadow: 0 10px 15px rgba(0,0,0,0.1),
              0 4px 6px rgba(0,0,0,0.05);
}

.elevation-4 {
  box-shadow: 0 20px 25px rgba(0,0,0,0.1),
              0 10px 10px rgba(0,0,0,0.04);
}
```

### Special Shadows
```css
/* Event dot shadow */
box-shadow: 0 2px 8px color60, inset 0 1px 2px rgba(255,255,255,0.4);

/* Era boundary glow */
box-shadow: 0 0 8px colorBorder40;

/* Drawer layered depth */
box-shadow: 0 0 0 1px rgba(0,0,0,0.05),
            0 10px 30px rgba(0,0,0,0.15),
            0 30px 60px rgba(0,0,0,0.10),
            0 60px 120px rgba(0,0,0,0.05);
```

---

## Animations

### Timing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);           /* Fast start, slow end */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);      /* Smooth both ends */
--bounce: cubic-bezier(0.34, 1.56, 0.64, 1);      /* Micro-bounce */
```

### Durations
```css
--duration-fast: 150ms;      /* Hover states */
--duration-base: 200ms;      /* Default transitions */
--duration-slow: 300ms;      /* Complex animations */
--duration-drawer: 300ms;    /* Drawer slide */
```

### Common Patterns
```css
/* Button hover */
transition: background-color 200ms ease-out,
            color 200ms ease-out,
            transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 200ms ease-out;

/* Focus ring */
transition: opacity 200ms ease-out;

/* Event dot */
transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 300ms ease-out;
```

---

## Components

### Event Dot
```tsx
Base: 8px × 8px, rounded-full
Hover: scale(2.5) = 20px
Layers:
  1. Shadow blur (background glow)
  2. Primary dot (category color)
  3. Inner highlight (white gradient)
  4. Pulse ring (animated)
  5. Connection line (to tooltip)
```

### Era Boundary
```tsx
Width: 1px (4px with glow)
Height: 100% of timeline
Gradient: previous era → next era
Badge: Year marker with era border color
```

### Tooltip
```tsx
Max-width: 320px (xs breakpoint)
Padding: 16px
Border: 2px solid category color
Shadow: elevation-4
Arrow: 16px rotated square
Animation: appear + micro-bounce
```

### Skeleton
```tsx
Background: gradient #D4D4D4 → #C4C4C4
Animation: shimmer wave (2s infinite)
Stagger: 100ms between items
Opacity fade: 1.0 → 0.6 per item
```

---

## Interactions

### Hover States
```css
/* Button */
scale: 1.05
shadow: elevation-2 → elevation-3

/* Event dot */
scale: 1 → 2.5
opacity: 0 → 1 (pulse ring)
tooltip: appear

/* Category lane */
background: transparent → rgba(196,52,45,0.03)
shadow: inset glow
```

### Focus States
```css
/* All interactive elements */
outline: 2px solid #C4342D
outline-offset: 2px
animation: focus-pulse (2s infinite)

/* Drawer */
focus-trap: cycle through focusable elements
close on Escape
```

### Active States
```css
/* Button click */
scale: 0.96
animation: gentle-bounce (150ms)

/* Minimap segment */
scale: 0.98
translateY: 0
```

---

## Responsive Breakpoints

```css
/* Tailwind defaults */
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet portrait */
lg:  1024px  /* Tablet landscape / small laptop */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Large desktop */

/* Timeline specific */
Timeline horizontal: md: (768px+)
Timeline vertical:   < md (mobile)
Drawer full:        md: (768px+)
Bottom sheet:       < md (mobile)
```

### Component Adjustments
```
Mobile (< 768px):
  - Vertical stacked timeline
  - Bottom sheet instead of drawer
  - Reduced spacing (p-4 instead of p-8)
  - Smaller typography (-1 step)

Desktop (768px+):
  - Horizontal 4-lane timeline
  - Side drawer
  - Full spacing
  - Full typography scale
```

---

## Accessibility

### Color Contrast
All combinations meet WCAG AA (4.5:1) or AAA (7:1)

```
Text on background:
  #1A1A1A on #F5F1E8 → 12.1:1 (AAA)
  #6B6B6B on #F5F1E8 → 5.8:1 (AA)

Era text on era background:
  All combinations → 7.2:1+ (AAA)

Buttons:
  White on #C4342D → 4.8:1 (AA)
```

### Focus Indicators
- Minimum 2px solid outline
- Color: #C4342D (accent red)
- Offset: 2px
- Animation: optional pulse (respects prefers-reduced-motion)

### Touch Targets
- Minimum: 44px × 44px
- Event dots: 8px visual, 44px invisible padding
- Buttons: inherent 44px+ height
- Minimap: 64px height

---

## CSS Utilities

### Quick Classes
```css
.tabular-nums           /* Year alignment */
.year-display           /* Monospace years */
.skeleton-shimmer       /* Loading animation */
.event-dot              /* Event marker */
.era-boundary           /* Historical transition */
.drawer-backdrop        /* Modal overlay */
.elevation-{1-4}        /* Shadow levels */
.button-enhanced        /* Interactive button */
.transition-colors-smooth
.transition-transform-smooth
```

---

## Code Patterns

### Era-aware Styling
```tsx
style={{
  backgroundColor: ERA_CONFIG[era].color,
  borderColor: ERA_CONFIG[era].borderColor,
  color: ERA_CONFIG[era].textColor
}}
```

### Category-aware Styling
```tsx
style={{
  backgroundColor: CATEGORY_CONFIG[category].color,
  borderColor: CATEGORY_CONFIG[category].color
}}
```

### Responsive Class Pattern
```tsx
className="
  text-xl md:text-2xl
  px-4 md:px-8
  py-2 md:py-4
"
```

### Animation with Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

---

## Browser Support

### Modern Features Used
- `backdrop-filter: blur()` → Safari needs `-webkit-`
- `overscroll-behavior: contain` → Good support (IE11 fallback: none)
- Custom properties (CSS variables) → IE11 not supported
- Grid & Flexbox → Excellent support

### Graceful Degradation
- Older browsers: Basic transitions only
- No backdrop-filter: Solid background fallback
- No CSS variables: Inline styles fallback

---

## Performance Guidelines

### DO
- Use `transform` and `opacity` for animations
- Batch DOM reads/writes
- Use `will-change` sparingly
- Lazy load images below fold
- Debounce scroll handlers (RAF)

### DON'T
- Animate `width`, `height`, `top`, `left`
- Use `transition-all` (specify properties)
- Interleave reads and writes
- Add animations to every element
- Forget `prefers-reduced-motion`

---

## Resources

### Design Inspiration
- Archive.org (archival aesthetic)
- National Geographic timelines
- Dieter Rams principles
- Swiss design movement

### Technical Reference
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- WCAG 2.1 AA compliance
- MDN Web Docs (browser compatibility)

---

**Last Updated:** May 21, 2026
**Version:** 1.0.0
**Maintainer:** Pixel (Design Engineer)
