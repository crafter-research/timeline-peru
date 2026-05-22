# Round 4 Integration Guide

## Quick Integration into EditorialTimeline.tsx

This guide shows how to integrate Round 4 enhancements into the existing timeline component with minimal disruption.

---

## Step 1: Add Round 4 Hook Import

At the top of `EditorialTimeline.tsx`, add the import:

```typescript
import { useRound4Enhancements } from "../hooks/useRound4Enhancements";
import { AudioToggle } from "../components/AudioToggle";
```

---

## Step 2: Use the Hook in Component

Inside the `EditorialTimeline` component, after existing state declarations:

```typescript
export function EditorialTimeline({ events }: EditorialTimelineProps) {
  // ... existing state declarations ...
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ROUND 4: Add advanced enhancements
  const {
    playSound,
    triggerConfetti,
    isSoundEnabled
  } = useRound4Enhancements(scrollContainerRef, {
    enableParallax: true,
    enableSound: false, // Muted by default
    enableMobileGestures: true,
    enableConfetti: true,
  });

  // ... rest of component ...
}
```

---

## Step 3: Add Sound to Interactions

### Event Click Sound
Find the event click handler and add:

```typescript
const handleEventClick = (event: HistoricalEvent) => {
  setSelectedEvent(event);
  playSound('success'); // ROUND 4: Success sound

  // Existing haptic feedback
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
};
```

### Era Filter Sound
Find the era button onClick handler and add:

```typescript
onClick={() => {
  const newEra = selectedEra === era ? null : era;
  setIsTransitioning(true);
  playSound('whoosh'); // ROUND 4: Transition sound

  setTimeout(() => {
    setSelectedEra(newEra);
    // ... rest of handler ...
  }, 150);
}}
```

### Easter Egg Confetti
Find the easter egg handler (5 clicks) and update:

```typescript
if (newCount === 5) {
  setShowEasterEgg(true);

  // ROUND 4: Enhanced celebration
  triggerConfetti(); // Fires confetti + sound

  // Existing haptic
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 100, 50, 100, 200]);
  }

  setTimeout(() => setShowEasterEgg(false), 5000);
  return 0;
}
```

### Zoom Sound (Optional)
Find zoom button handlers and add:

```typescript
onClick={() => {
  setZoomLevel((z) => Math.max(0.5, z - 0.25));
  playSound('click'); // ROUND 4: Click feedback
}}
```

---

## Step 4: Add Magnetic Hover to Event Dots

Find the event dot rendering section and update className:

```typescript
<button
  key={event.id}
  type="button"
  onClick={handleEventClick}
  className={`absolute top-1/2 -translate-y-1/2 group event-dot-magnetic ${isVisible ? `event-scroll-reveal ${staggerClass}` : ''}`}
  // ... rest of props ...
>
  {/* Add magnetic field visualization */}
  <div className="magnetic-field" style={{ color: config.color }}></div>

  {/* Existing event dot content */}
  <div className="relative flex flex-col items-center event-dot-wrapper">
    {/* ... existing dot markup ... */}
  </div>
</button>
```

---

## Step 5: Add Parallax to Era Backgrounds

Find the era background rendering and update:

```typescript
{eraSegments.map((segment) => (
  <div
    key={segment.era}
    className="absolute top-0 bottom-0 era-background era-background-parallax gpu-accelerated"
    style={{
      left: `${segment.startPos}%`,
      width: `${segment.endPos - segment.startPos}%`,
      backgroundColor: ERA_CONFIG[segment.era].color,
    }}
  />
))}
```

---

## Step 6: Add AudioToggle Component

At the end of the component JSX, before the closing `</div>`, add:

```typescript
return (
  <div className="min-h-screen bg-[#F5F1E8]">
    {/* ... existing JSX ... */}

    {/* ROUND 4: Audio Toggle */}
    <AudioToggle />
  </div>
);
```

---

## Step 7: Add GPU Acceleration Classes

Update performance-critical elements with GPU acceleration:

### Timeline Container
```typescript
<div
  ref={scrollContainerRef}
  className={`overflow-x-auto overflow-y-hidden gpu-accelerated ${isTransitioning ? 'page-transition-fade' : ''}`}
  // ... rest of props ...
>
```

### Era Backgrounds (already done in Step 5)
```typescript
className="... era-background-parallax gpu-accelerated"
```

### Event Dots
```typescript
className="... event-dot-magnetic gpu-accelerated"
```

---

## Step 8: Add Touch Ripples to Buttons (Automatic)

No code changes needed! The `useRound4Enhancements` hook automatically enables touch ripples on all buttons on mobile devices.

To verify:
1. Open on mobile or DevTools mobile view
2. Tap any button
3. See ripple expand from touch point

---

## Step 9: Add Zoom Indicator (Optional)

Create a new state for zoom changes:

```typescript
const [showZoomIndicator, setShowZoomIndicator] = useState(false);
const [zoomIndicatorValue, setZoomIndicatorValue] = useState(100);
```

Update zoom handlers:

```typescript
const handleZoomChange = (newZoom: number) => {
  setZoomLevel(newZoom);
  setZoomIndicatorValue(Math.round(newZoom * 100));
  setShowZoomIndicator(true);

  setTimeout(() => setShowZoomIndicator(false), 1000);

  playSound('click'); // ROUND 4: Click feedback
};

// Apply to zoom buttons
<button onClick={() => handleZoomChange(Math.max(0.5, zoomLevel - 0.25))}>-</button>
<button onClick={() => handleZoomChange(Math.min(3, zoomLevel + 0.25))}>+</button>
```

Add indicator JSX:

```typescript
{showZoomIndicator && (
  <div className="zoom-indicator-overlay">
    {zoomIndicatorValue}%
  </div>
)}
```

---

## Step 10: Test Everything

### Desktop Testing
1. **Parallax**: Scroll timeline, watch era backgrounds move subtly
2. **Magnetic hover**: Hover over event dots, watch them follow cursor
3. **Sound toggle**: Click AudioToggle (bottom-right), enable sounds
4. **Event sounds**: Click event dot, hear success sound
5. **Era sounds**: Click era filter, hear whoosh sound
6. **Confetti**: Click title 5 times, see confetti burst
7. **Zoom indicator**: Change zoom, see percentage overlay

### Mobile Testing
1. **Touch ripples**: Tap any button, see ripple effect
2. **Swipe**: Swipe timeline left/right
3. **Pull refresh**: Pull down from top (if at scroll position 0)
4. **Haptic**: Feel vibrations on Android (iOS doesn't support)

### Accessibility Testing
1. Enable "Reduce motion" in OS settings
2. Verify all animations disabled
3. AudioToggle keyboard accessible (Tab to focus, Enter to toggle)
4. Sound muted by default

---

## Minimal Integration (Just Sound + Confetti)

If you want to start with just sound and confetti:

```typescript
// Minimal setup
const { playSound, triggerConfetti } = useRound4Enhancements(scrollContainerRef, {
  enableParallax: false,
  enableSound: false,
  enableMobileGestures: false,
  enableConfetti: true,
});

// In easter egg handler
if (newCount === 5) {
  triggerConfetti(); // Just confetti, no other features
}

// In event click
const handleEventClick = (event) => {
  setSelectedEvent(event);
  playSound('success'); // Manual sound trigger when needed
};
```

---

## Configuration Options

### Hook Configuration

```typescript
useRound4Enhancements(containerRef, {
  enableParallax: boolean,        // Default: true
  enableSound: boolean,           // Default: false (muted)
  enableMobileGestures: boolean,  // Default: true
  enableConfetti: boolean,        // Default: true
});
```

### Parallax Intensity

To adjust parallax strength, edit `/src/hooks/useRound4Enhancements.ts`:

```typescript
// In parallax setup
parallax.register(bg as HTMLElement, {
  intensity: 0.08,  // Default: 0.05-0.15 (adjust here)
  direction: 'horizontal',
  friction: 0.8,    // Default: 0.8 (higher = slower)
});
```

### Magnetic Strength

To adjust magnetic pull, edit event dot rendering:

```typescript
// Add data attribute
<button
  data-magnetic-strength="0.5"  // Default: 0.3, max: 1.0
  className="event-dot-magnetic"
>
```

### Confetti Count

To adjust particle count:

```typescript
triggerConfetti(element, 50); // Default: 30, max recommended: 50
```

---

## Performance Monitoring

### Check FPS During Animations

Open Chrome DevTools → Performance:

1. Click "Record"
2. Scroll timeline (test parallax)
3. Hover over event dots (test magnetic)
4. Trigger confetti (test particles)
5. Click "Stop"
6. Check FPS: Should be 60fps green line

### Check Memory Usage

DevTools → Memory → Take Heap Snapshot:

1. Take snapshot before interactions
2. Trigger confetti 10 times
3. Take snapshot after
4. Compare: Should be <1MB difference (auto-cleanup working)

### Check Bundle Size

```bash
npm run build
ls -lh dist/assets/*.js
```

Increase should be <10KB gzipped.

---

## Troubleshooting

### Parallax Not Working
- Check if element has `.era-background` class
- Verify `scrollContainerRef` attached to scrollable div
- Check console for errors
- Test with reduced motion disabled

### Magnetic Hover Janky
- Ensure `.event-dot-magnetic` class applied
- Check if too many dots visible (performance issue)
- Reduce magnetic strength (0.2 instead of 0.3)
- Verify GPU acceleration class present

### Sounds Not Playing
- Click AudioToggle to enable
- Check browser console for Web Audio API errors
- iOS: User interaction required before first sound
- Verify `soundManager.isEnabled()` returns true

### Confetti Laggy
- Reduce particle count to 30 or 20
- Check if reduced motion enabled (disables confetti)
- Test on lower-end device (may need optimization)

### Mobile Gestures Conflicting
- Check if another library handling touch events
- Verify `{ passive: true }` on listeners
- May need to disable native pull-to-refresh

---

## Rollback Plan

If Round 4 causes issues, you can disable features individually:

### Disable All Round 4
Remove or comment out the hook:

```typescript
// const { playSound, triggerConfetti } = useRound4Enhancements(...);
```

### Disable Specific Features
```typescript
useRound4Enhancements(containerRef, {
  enableParallax: false,         // Disable parallax only
  enableSound: false,            // Disable sound only
  enableMobileGestures: false,   // Disable mobile only
  enableConfetti: false,         // Disable confetti only
});
```

### Remove CSS Import
In `global.css`, comment out:

```css
/* @import "./round4-polish.css"; */
```

---

## Next Steps

1. **Test on staging**: Deploy to staging environment
2. **Collect feedback**: User testing session
3. **A/B test**: Compare version with/without Round 4
4. **Performance monitoring**: Real user metrics
5. **Iterate**: Adjust based on feedback

---

**Integration Time Estimate**: 30-60 minutes
**Testing Time Estimate**: 30 minutes
**Total Time**: ~1.5 hours

Good luck! 🚀
