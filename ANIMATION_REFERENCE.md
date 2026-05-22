# Animation Quick Reference

## CSS Classes Available

### Utility Classes

```css
/* Transitions */
.color-transition           /* Smooth color/bg/border changes - 150ms */
.filter-transition          /* All properties - 150ms */
.hover-lift                 /* Translate + shadow on hover */

/* Animations */
.event-fade-in             /* Fade + slide up - 300ms */
.event-reveal              /* Scale + fade in - 250ms (with delays) */
.modal-backdrop            /* Fade in backdrop - 150ms */
.modal-content             /* Scale in content - 200ms */
.drawer-slide-in           /* Slide from right - 300ms */
.drawer-slide-out          /* Slide to right - 250ms */
.bottom-sheet-slide-up     /* Slide from bottom - 250ms */
.bottom-sheet-slide-down   /* Slide to bottom - 250ms */
.scroll-hint               /* Pulse + translate - 2s infinite */
.year-marker               /* Fade + slide down - 400ms */
.skeleton-item             /* Opacity pulse - 1.5s infinite */
.zoom-indicator            /* Appear, hold, fade - 1.5s */

/* Era Atmospheres */
.era-background            /* Base era styling */
.era-preinca               /* Warm beige gradient - 30s */
.era-inca                  /* Golden gradient - 25s */
.era-conquista             /* Red-tinted gradient - 20s */
.era-colonia               /* Cool gray gradient - 35s */
.era-republica             /* Blue gradient - 28s */
.era-contemporaneo         /* Sepia gradient - 32s */

/* Special Effects */
.drawer-backdrop           /* 4px blur + transition */
.category-lane             /* Hover glow on lanes */
.category-badge-hover      /* Scale + shadow on badges */
```

## Common Patterns

### Hover Button
```tsx
className="transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-lg"
```

### Focus Ring
```tsx
className="focus:outline-none focus:ring-2 focus:ring-[#C4342D]/20 focus:border-[#C4342D]"
```

### Disabled State
```tsx
className="disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
```

### Modal Entry
```tsx
className="modal-backdrop" // Backdrop
className="modal-content"  // Content
```

### Card Hover
```tsx
className="hover-lift transition-all duration-300 hover:border-[#C4342D] hover:shadow-lg"
```

## Tailwind Transition Classes

```tsx
/* Duration */
duration-100  // 100ms
duration-200  // 200ms
duration-300  // 300ms (standard)
duration-500  // 500ms

/* Easing */
ease-linear   // Linear
ease-in       // Slow start
ease-out      // Slow end (standard for UI)
ease-in-out   // Slow both ends

/* Timing Function */
transition-all       // All properties
transition-colors    // Color properties only
transition-transform // Transform only
transition-opacity   // Opacity only
```

## Scale Reference

```tsx
scale-95    // Active press (95%)
scale-100   // Normal (100%)
scale-105   // Hover small (105%)
scale-110   // Hover medium (110%)
scale-125   // Hover large (125%)
scale-[1.8] // Custom event dot hover (180%)
scale-[2]   // Custom event dot focus (200%)
```

## Shadow Reference

```tsx
shadow-sm    // Subtle elevation
shadow-md    // Medium elevation (selected states)
shadow-lg    // High elevation (hover)
shadow-xl    // Very high (hover on elevated)
shadow-2xl   // Maximum (modals, tooltips)
```

## Custom Keyframes

### Event Reveal (Staggered)
```css
@keyframes eventReveal {
  from {
    opacity: 0;
    transform: scale(0.3) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Use with delay classes */
.event-reveal-1 { animation-delay: 0ms; }
.event-reveal-2 { animation-delay: 50ms; }
...
.event-reveal-10 { animation-delay: 450ms; }
```

### Era Atmosphere
```css
@keyframes preincaAtmosphere {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

background: linear-gradient(135deg, color1, color2);
background-size: 200% 200%;
animation: preincaAtmosphere 30s ease-in-out infinite;
```

### Zoom Indicator
```css
@keyframes zoomIndicatorAppear {
  0% { opacity: 0; transform: scale(0.8); }
  20% { opacity: 1; transform: scale(1); }
  80% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.2); }
}
```

## Performance Tips

### Good (GPU-Accelerated)
- `transform: scale()`
- `transform: translate()`
- `transform: rotate()`
- `opacity`
- `filter: blur()` (use sparingly)

### Avoid (Triggers Reflow)
- `width`, `height`
- `margin`, `padding`
- `top`, `left`, `right`, `bottom`
- `font-size`

### Best Practices
1. Always use `transform` over positional properties
2. Combine transforms in single property: `transform: scale(1.05) translateY(-2px)`
3. Use `will-change` for heavy animations (cleanup after)
4. Prefer CSS transitions over JS animations
5. Use RAF for scroll-based animations

## Accessibility Pattern

Always include reduced motion fallback:

```css
.your-animation {
  animation: yourKeyframes 300ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .your-animation {
    animation: none;
    /* Preserve final state without motion */
    opacity: 1;
    transform: none;
  }
}
```

## React Component Patterns

### Conditional Animation Class
```tsx
className={`transition-all duration-300 ${
  isActive ? "scale-105 shadow-lg" : "scale-100"
}`}
```

### Dynamic Style Object
```tsx
style={{
  transform: `scale(${zoomLevel})`,
  transition: "transform 300ms ease-out",
}}
```

### Animation State Hook
```tsx
const [isAnimating, setIsAnimating] = useState(false);

const handleClick = () => {
  setIsAnimating(true);
  setTimeout(() => setIsAnimating(false), 300);
};
```

## Debugging

### Check Animation Performance
```javascript
// Chrome DevTools > Performance > Record
// Look for "Rendering" and "Painting" sections
```

### Inspect Animation Timing
```javascript
// Chrome DevTools > Elements > Styles > Computed
// Check transition/animation values
```

### Test Reduced Motion
```javascript
// Chrome DevTools > Rendering > Emulate CSS media feature
// Set prefers-reduced-motion: reduce
```

## Common Combinations

### Interactive Card
```tsx
className="
  transition-all duration-300 ease-out
  hover:scale-105 hover:shadow-lg hover:border-[#C4342D]
  active:scale-95
  focus:ring-2 focus:ring-[#C4342D]/20
"
```

### Icon Button
```tsx
className="
  p-2 rounded-lg
  text-[#6B6B6B] hover:text-[#C4342D]
  bg-white hover:bg-[#FEF2F2]
  transition-all duration-300
  hover:scale-110 active:scale-95
  hover:rotate-90
"
```

### Pill/Badge
```tsx
className="
  px-4 py-2 rounded-full
  transition-all duration-300 ease-out
  hover:scale-105 active:scale-95
  shadow-md hover:shadow-lg
"
```

### Drawer Trigger
```tsx
onClick={() => setIsOpen(true)}
className="
  hover-lift
  event-fade-in
  transition-all duration-300
"
```

## Color Variables

Use theme variables for consistent transitions:

```css
var(--color-paper)        /* #F5F3EF - Background */
var(--color-primary)      /* #1A1A1A - Text */
var(--color-secondary)    /* #6B6B6B - Muted text */
var(--color-line-gray)    /* #D4D4D4 - Borders */
var(--color-accent-red)   /* #C4342D - Primary actions */
var(--color-sepia-dark)   /* #8B7355 - Warm accent */
var(--color-sepia-light)  /* #D4C4A8 - Subtle bg */
```

## Z-Index Layers

```css
z-10   /* Fixed labels (category lanes) */
z-20   /* Sticky headers */
z-30   /* Legend, minimap */
z-40   /* Scroll hint */
z-50   /* Modals, tooltips, zoom indicator */
```

## Timing Cheat Sheet

| Duration | Use Case |
|----------|----------|
| 100ms | Instant feedback (button press) |
| 150ms | Quick state change |
| 200ms | Button hover |
| 300ms | Standard UI transitions (default) |
| 400ms | Smooth movement (drawers start) |
| 500ms | Era background transitions |
| 1.5s | Loading indicators |
| 2s | Subtle pulsing (scroll hint) |
| 20-35s | Atmospheric backgrounds |

## Easing Cheat Sheet

| Easing | Feel | Use Case |
|--------|------|----------|
| `linear` | Constant | Progress bars |
| `ease-in` | Slow start | Exit animations |
| `ease-out` | Slow end | Entry animations (standard) |
| `ease-in-out` | Slow both | Continuous loops |
| `cubic-bezier(0.4, 0, 0.2, 1)` | Apple-like | Zoom, scroll |

## Quick Copy-Paste Snippets

### Smooth Button
```tsx
<button className="px-4 py-2 bg-[#C4342D] text-white rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95 hover:bg-[#A42D26]">
  Click me
</button>
```

### Interactive Card
```tsx
<div className="border border-[#D4D4D4] bg-white p-4 rounded-lg hover:border-[#C4342D] hover:shadow-lg transition-all duration-300 ease-out hover-lift">
  Content
</div>
```

### Fade In Element
```tsx
<div className="event-fade-in">
  Appears with fade + slide up
</div>
```

### Tooltip
```tsx
<div className="opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-out">
  Tooltip content
</div>
```
