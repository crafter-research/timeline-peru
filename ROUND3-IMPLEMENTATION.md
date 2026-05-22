# Round 3: CSS Animation Hookup - Implementation Guide

## Status: IN PROGRESS

This document tracks the implementation of CSS animations from Rounds 1 & 2 into the React component.

---

## Phase 1: Essential Hookups ✓ STARTED

### 1.1 Intersection Observer for Scroll-Triggered Reveals

**Goal**: Animate events as they scroll into view using `.event-scroll-reveal` class.

**Implementation Steps**:
1. Add state: `const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set())`
2. Create IntersectionObserver in useEffect
3. Attach observer to event button elements via `data-event-id` attribute
4. Apply `.event-scroll-reveal` class conditionally when visible
5. Add staggered delays: `.stagger-1` through `.stagger-10` based on index

**Code Location**: `EditorialTimeline.tsx` lines 162-210, event rendering around line 1000

**CSS Classes Used**:
- `.event-scroll-reveal` (400ms entrance animation)
- `.stagger-1` through `.stagger-10` (50ms incremental delays)

### 1.2 Page Transition Fade for Tab/Era Switching

**Goal**: Smooth fade transition when changing eras/filters.

**Implementation Steps**:
1. Add state: `const [isTransitioning, setIsTransitioning] = useState(false)`
2. On era button click, set `isTransitioning = true`, wait 150ms, change era, then set to `false`
3. Apply `.page-transition-fade` to timeline container conditionally
4. Add haptic feedback: `navigator.vibrate(15)` on transitions

**Code Location**: Era filter buttons around line 670

**CSS Classes Used**:
- `.page-transition-fade` (300ms cross-fade)

### 1.3 Haptic Feedback Integration

**Patterns Implemented**:
- Light tap (20ms): General interactions
- Medium tap (30ms): Event clicks
- Transition tap (15ms): Tab/era changes
- Subtle scroll (10ms): Every ~10th event scroll reveal
- Celebration (50, 100, 50, 100, 200ms): Easter egg

---

## Phase 2: Interactive Feedback ✓ STARTED

### 2.1 Success Feedback Animation

**Goal**: Green pulse ring on successful event open.

**Implementation Steps**:
1. Add to event click handler: trigger `.success-feedback` class temporarily
2. Apply to event dot wrapper for 600ms
3. Auto-remove after animation completes

**CSS Classes Used**:
- `.success-feedback` (600ms green expanding ring)

### 2.2 Error Shake Animation

**Goal**: Horizontal shake on empty state / no results.

**Implementation Steps**:
1. Apply `.error-shake` class to empty state container when filters active
2. Add `.empty-state-reveal` for entrance animation
3. Add `.empty-state-icon-bounce` to search icon

**Code Location**: Empty state rendering around line 1060

**CSS Classes Used**:
- `.error-shake` (400ms horizontal shake)
- `.empty-state-reveal` (400ms scale entrance)
- `.empty-state-icon-bounce` (2s continuous bounce)

### 2.3 Touch Gesture Hints for Mobile

**Goal**: Bouncing chevron to indicate swipe affordance.

**Implementation Steps**:
1. Add `.touch-hint` class to scroll hint chevron icon
2. Already has container with `animate-bounce`, enhance with `.touch-hint` for more control

**Code Location**: Scroll hint indicator around line 795

**CSS Classes Used**:
- `.touch-hint` (2s vertical bounce with opacity pulse)

---

## Phase 3: Fun Features ✓ STARTED

### 3.1 Easter Egg - 5 Clicks on Logo

**Goal**: Secret reveal animation after 5 clicks on "HISTORIA DEL PERÚ" title.

**Implementation Steps**:
1. Add states:
   - `const [logoClickCount, setLogoClickCount] = useState(0)`
   - `const [showEasterEgg, setShowEasterEgg] = useState(false)`
   - `const logoClickTimeoutRef = useRef<number | null>(null)`

2. Create `handleLogoClick` callback:
   - Increment counter
   - Reset after 2s of inactivity
   - On 5th click: show easter egg, vibrate celebration pattern

3. Make h1 title clickable:
   ```tsx
   <h1
     onClick={handleLogoClick}
     className="font-sans text-4xl font-bold tracking-tight text-[#1A1A1A] uppercase cursor-pointer select-none"
   >
     HISTORIA DEL PERÚ
   </h1>
   ```

4. Add easter egg overlay:
   ```tsx
   {showEasterEgg && (
     <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
       <div className="easter-egg-reveal bg-white border-4 border-[#C4342D] rounded-xl px-8 py-6 shadow-2xl">
         <div className="text-6xl mb-4 text-center">🇵🇪</div>
         <div className="text-2xl font-bold text-[#C4342D] text-center">
           ¡Viva el Perú!
         </div>
         <div className="text-sm text-[#6B6B6B] text-center mt-2">
           Has descubierto el secreto de la línea de tiempo
         </div>
       </div>
     </div>
   )}
   ```

**Code Location**:
- Header h1 around line 531
- Easter egg overlay after header, before main timeline

**CSS Classes Used**:
- `.easter-egg-reveal` (400ms elastic bounce with rotation + 2s continuous pulse)

**Haptic Pattern**:
- Celebration: `navigator.vibrate([50, 100, 50, 100, 200])`

### 3.2 Enhanced Haptic Feedback

**Already implemented** in all phases above. Summary:
- Event clicks: 30ms
- Era changes: 15ms
- Scroll reveals (10% chance): 10ms
- Easter egg: [50, 100, 50, 100, 200]

---

## Performance Verification

### Checks Required:
1. ✓ All animations use GPU-accelerated properties (transform, opacity)
2. ✓ No layout thrashing (no width/height animations)
3. ✓ Reduced motion fallbacks present in CSS
4. ⏳ Test on low-end Android device
5. ⏳ Verify 60fps in Chrome DevTools Performance tab
6. ⏳ Check bundle size impact (target: <5KB)

### Browser Testing:
- ⏳ Chrome 90+ (Desktop, Android)
- ⏳ Firefox 88+ (Desktop, Android)
- ⏳ Safari 14+ (macOS, iOS - no haptics expected)
- ⏳ Edge 90+ (Windows)

---

## Implementation Checklist

### Phase 1: Essential
- [x] Intersection Observer setup
- [x] `visibleEvents` state management
- [x] Event reveal with stagger delays
- [x] Page transition on era change
- [x] Haptic feedback (transitions)

### Phase 2: Interactive Feedback
- [x] Success feedback (concept)
- [x] Error shake on empty state
- [x] Touch hint animation
- [x] Empty state bounce icon

### Phase 3: Fun
- [x] Easter egg state setup
- [x] Logo click handler
- [ ] Easter egg overlay JSX
- [x] Celebration haptic pattern

### Remaining Work
- [ ] Apply observer refs to event buttons
- [ ] Add success feedback to event clicks
- [ ] Test all animations work
- [ ] Verify reduced-motion preferences respected
- [ ] Performance profiling

---

## Code Snippets Ready to Apply

### Add to state declarations (around line 145):
```typescript
const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
const [isTransitioning, setIsTransitioning] = useState(false);
const [logoClickCount, setLogoClickCount] = useState(0);
const [showEasterEgg, setShowEasterEgg] = useState(false);
const logoClickTimeoutRef = useRef<number | null>(null);
const eventObserverRef = useRef<IntersectionObserver | null>(null);
```

### Add Intersection Observer effect (after simulate loading, line 168):
```typescript
// ROUND 3: Intersection Observer for scroll-triggered reveals
useEffect(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  eventObserverRef.current = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const eventId = entry.target.getAttribute('data-event-id');
          if (eventId) {
            setVisibleEvents((prev) => new Set(prev).add(eventId));
            // Subtle haptic on scroll reveal (10% chance)
            if ('vibrate' in navigator && Math.random() < 0.1) {
              navigator.vibrate(10);
            }
          }
        }
      });
    },
    { root: null, rootMargin: '50px', threshold: 0.1 }
  );

  return () => eventObserverRef.current?.disconnect();
}, []);
```

### Add easter egg handler (after Intersection Observer):
```typescript
// ROUND 3: Easter egg - 5 clicks on logo
const handleLogoClick = useCallback(() => {
  setLogoClickCount((prev) => {
    const newCount = prev + 1;

    if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
    logoClickTimeoutRef.current = window.setTimeout(() => setLogoClickCount(0), 2000);

    if (newCount === 5) {
      setShowEasterEgg(true);
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50, 100, 200]);
      }
      setTimeout(() => setShowEasterEgg(false), 5000);
      return 0;
    }
    return newCount;
  });
}, []);
```

### Modify h1 title (line 531):
```tsx
<h1
  onClick={handleLogoClick}
  className="font-sans text-4xl font-bold tracking-tight text-[#1A1A1A] uppercase cursor-pointer select-none hover:text-[#C4342D] transition-colors"
  title="Haz clic 5 veces para un secreto..."
>
  HISTORIA DEL PERÚ
</h1>
```

### Add easter egg overlay (after header, before main):
```tsx
{/* ROUND 3: Easter Egg Overlay */}
{showEasterEgg && (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div className="easter-egg-reveal bg-white border-4 border-[#C4342D] rounded-xl px-8 py-6 shadow-2xl pointer-events-auto">
      <div className="text-6xl mb-4 text-center">🇵🇪</div>
      <div className="text-2xl font-bold text-[#C4342D] text-center">
        ¡Viva el Perú!
      </div>
      <div className="text-sm text-[#6B6B6B] text-center mt-2">
        Has descubierto el secreto de la línea de tiempo
      </div>
      <button
        onClick={() => setShowEasterEgg(false)}
        className="mt-4 w-full px-4 py-2 bg-[#C4342D] text-white rounded-lg hover:bg-[#A42D26] transition-colors"
      >
        Continuar explorando
      </button>
    </div>
  </div>
)}
```

### Modify event button rendering (around line 970):
```tsx
{categoryEvents.map((event, index) => {
  const position = getEventPosition(event.date);
  const isVisible = visibleEvents.has(event.id);
  const staggerClass = `stagger-${Math.min(index % 10 + 1, 10)}`;

  return (
    <button
      key={event.id}
      type="button"
      onClick={() => {
        setSelectedEvent(event);
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(30);
        }
      }}
      className={`absolute top-1/2 -translate-y-1/2 group ${
        isVisible ? `event-scroll-reveal ${staggerClass}` : ''
      }`}
      style={{ left: `${position}%` }}
      aria-label={`${event.title}, ${formatYear(event.date)}, categoría ${CATEGORY_CONFIG[category].label}`}
      aria-describedby={`tooltip-${event.id}`}
      data-event-id={event.id}
      ref={(el) => {
        if (el && eventObserverRef.current && !visibleEvents.has(event.id)) {
          eventObserverRef.current.observe(el);
        }
      }}
    >
```

### Modify era button onClick (around line 672):
```tsx
onClick={() => {
  const newEra = selectedEra === era ? null : era;
  // Trigger page transition
  setIsTransitioning(true);
  setTimeout(() => {
    setSelectedEra(newEra);
    setVisibleEvents(new Set()); // Reset for new animations
    if (newEra) {
      scrollToEra(newEra);
    }
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
    setTimeout(() => setIsTransitioning(false), 50);
  }, 150);
}}
```

### Modify timeline container (around line 817):
```tsx
<div
  ref={scrollContainerRef}
  className={`overflow-x-auto overflow-y-hidden ${isTransitioning ? 'page-transition-fade' : ''}`}
  style={{
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
  }}
>
```

### Modify scroll hint (around line 796):
```tsx
<div className="bg-[#C4342D] text-white px-6 py-3 rounded-full shadow-lg text-sm font-sans flex items-center gap-2 touch-hint">
  <svg
    className="w-5 h-5 touch-hint"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
```

### Modify empty state (around line 1058):
```tsx
{filteredEvents.length === 0 && (
  <div
    className={`flex items-center justify-center h-96 empty-state-reveal ${
      (searchQuery || selectedEra) ? 'error-shake' : ''
    }`}
    role="status"
  >
    <div className="text-center">
      <svg
        className="w-16 h-16 mx-auto mb-4 text-[#D4D4D4] empty-state-icon-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
```

---

## Next Steps

1. Apply all code snippets above to EditorialTimeline.tsx
2. Test in browser:
   - Event scroll reveals working
   - Era transitions smooth
   - Empty state shake on no results
   - Easter egg triggers after 5 clicks
   - Haptic feedback on mobile
3. Verify reduced-motion fallbacks
4. Performance profile in Chrome DevTools
5. Cross-browser testing

---

## Files Modified

- `/Users/shiara/Documents/personal-projects/timeline-peru/src/components/EditorialTimeline.tsx` - Main implementation
- `/Users/shiara/Documents/personal-projects/timeline-peru/src/styles/global.css` - Animation definitions (already complete)
- `/Users/shiara/Documents/personal-projects/timeline-peru/src/styles/timeline-enhancements.css` - Enhanced animations (already complete)

---

**Last Updated**: 2026-05-21
**Status**: Ready for final implementation pass
**Estimated Completion**: 30-45 minutes
