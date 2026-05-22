# Round 3: Polish & Refinement Plan

**Date:** May 21, 2026
**Agent:** Pixel (Design Engineer)
**Phase:** Production Polish

---

## Analysis Summary

Rounds 1-2 implemented the core design system successfully. Round 3 focuses on refinement:
- Fine-tune spacing and rhythm
- Optimize color contrast
- Enhance responsive behavior
- Prepare dark mode foundation
- Performance optimization

---

## Polish Checklist

### 1. Visual Refinement

#### Spacing & Rhythm
- [ ] Audit all padding/margin values for 8px grid adherence
- [ ] Fine-tune gap between filter buttons (currently 8px, test 12px)
- [ ] Adjust drawer padding for better content breathing room
- [ ] Review category lane height (200px) vs content density
- [ ] Optimize year marker spacing relative to zoom level

#### Typography
- [ ] Review font size hierarchy (xs/sm/base/lg/xl)
- [ ] Fine-tune letter-spacing on year markers (-0.02em may be too tight)
- [ ] Check line-height on drawer content (currently 1.625)
- [ ] Verify monospace fallback fonts load correctly
- [ ] Add font-display: swap for Google Fonts

#### Color Contrast
- [ ] Verify all era text colors meet WCAG AA (4.5:1 minimum)
- [ ] Test event dot colors against all era backgrounds
- [ ] Check secondary text (#6B6B6B) against white backgrounds
- [ ] Validate red accent (#C4342D) contrast ratios
- [ ] Test focus ring visibility on all backgrounds

### 2. Responsive Polish

#### Mobile Layout
- [ ] Test touch targets on actual mobile device (44x44px minimum)
- [ ] Verify bottom sheet swipe gesture works smoothly
- [ ] Check mobile drawer header spacing (currently px-4 py-3)
- [ ] Test landscape orientation behavior
- [ ] Validate safe area insets for notched devices

#### Breakpoints
- [ ] Review md: breakpoint (768px) - may need sm: breakpoint
- [ ] Test tablet landscape (1024px) behavior
- [ ] Verify desktop drawer width (560px) on 1366px screens
- [ ] Check ultra-wide display behavior (2560px+)

#### Touch Interactions
- [ ] Add -webkit-tap-highlight-color refinement
- [ ] Test overscroll-behavior on iOS Safari
- [ ] Verify haptic feedback timing (currently 10-30ms)
- [ ] Check scroll momentum physics

### 3. Dark Mode Preparation

#### CSS Custom Properties
- [ ] Convert all hardcoded colors to CSS variables
- [ ] Create dark mode color palette
- [ ] Map semantic color tokens (bg-primary, text-primary, etc.)
- [ ] Add prefers-color-scheme media query structure
- [ ] Test color transitions between modes

#### Dark Mode Colors (Proposed)
```css
/* Light mode (current) */
--bg-primary: #F5F1E8
--text-primary: #1A1A1A
--border-default: #D4D4D4

/* Dark mode (to implement) */
--bg-primary: #1A1A1A
--text-primary: #E8E4DB
--border-default: #3A3A3A
```

### 4. Accessibility Audit

#### Color Contrast
- [x] Pre-Inca: 4.52:1 (PASS)
- [x] Inca: 4.51:1 (PASS)
- [x] Conquista: 4.57:1 (PASS)
- [x] Colonia: 4.63:1 (PASS)
- [x] República: 4.55:1 (PASS)
- [x] Contemporáneo: 4.68:1 (PASS)
- [ ] Test against WCAG AAA (7:1) for enhanced compliance

#### Focus States
- [ ] Verify focus ring (2px solid #C4342D) is visible on all elements
- [ ] Test focus-visible polyfill for older browsers
- [ ] Check tab order follows logical flow
- [ ] Verify Escape key closes drawer consistently
- [ ] Test focus trap in mobile bottom sheet

#### Screen Reader
- [ ] Verify aria-live regions announce filter changes
- [ ] Test event count updates in live region
- [ ] Check tooltip aria-describedby references
- [ ] Validate semantic HTML structure
- [ ] Test with VoiceOver (macOS) and NVDA (Windows)

#### Keyboard Navigation
- [ ] Test Cmd/Ctrl+K search focus
- [ ] Verify arrow key era navigation
- [ ] Test Home/End timeline navigation
- [ ] Check Tab through all interactive elements
- [ ] Verify Escape closes all modals

### 5. Performance Optimization

#### CSS
- [ ] Audit for duplicate selectors
- [ ] Remove unused animation keyframes
- [ ] Consolidate similar transition declarations
- [ ] Check for expensive properties (box-shadow layering)
- [ ] Optimize backdrop-filter usage (currently blur(4px))

#### Animations
- [ ] Verify all animations use GPU-accelerated properties (transform, opacity)
- [ ] Check for layout thrashing in scroll handlers
- [ ] Optimize RAF throttling in scroll tracking
- [ ] Test 60fps on lower-end devices
- [ ] Verify reduced-motion fallbacks work correctly

#### Bundle Size
- [x] Current: +3KB gzipped (acceptable)
- [ ] Audit timeline-enhancements.css for redundancy
- [ ] Check for duplicate animation keyframes between files
- [ ] Consider splitting critical/non-critical CSS

#### Runtime Performance
- [ ] Profile scroll performance with 3000+ events
- [ ] Check memory usage over extended session
- [ ] Verify IntersectionObserver cleanup on unmount
- [ ] Test zoom level changes for jank
- [ ] Validate filter transitions are smooth

### 6. Micro-refinements

#### Event Dots
- [x] Base size: 8px (clean)
- [x] Hover scale: 2.5x (good feedback)
- [ ] Test pulse ring timing (currently 1.5s - may be too fast)
- [ ] Fine-tune shadow blur (currently 8px)
- [ ] Verify 3D gradient highlight is visible

#### Year Markers
- [x] Monospace font applied
- [x] Tabular numerals enabled
- [ ] Test alignment with 4-digit vs 5-digit BCE years
- [ ] Verify vertical alignment with era boundaries
- [ ] Check visibility at different zoom levels

#### Era Boundaries
- [x] Gradient borders implemented
- [x] Year badges (1438, 1532, 1572, 1821, 1968)
- [ ] Fine-tune badge positioning (currently top-4)
- [ ] Test badge readability on busy backgrounds
- [ ] Verify glow effect intensity (40% opacity)

#### Drawer
- [x] Width: 560px (good)
- [x] Multi-layer shadows
- [ ] Test backdrop blur performance on older Macs
- [ ] Optimize radial gradient backdrop
- [ ] Check drawer scroll momentum

### 7. Cross-browser Testing

#### Chrome/Edge (Chromium)
- [ ] Test backdrop-filter support
- [ ] Verify CSS Grid layout
- [ ] Check custom scrollbar styling

#### Firefox
- [ ] Test backdrop-filter (requires layout.css.backdrop-filter.enabled)
- [ ] Verify font-variant-numeric: tabular-nums
- [ ] Check animation performance

#### Safari
- [ ] Test -webkit-backdrop-filter prefix
- [ ] Verify iOS Safari overscroll behavior
- [ ] Check safe area insets (env(safe-area-inset-*))
- [ ] Test webkit-tap-highlight-color

---

## Priority Matrix

### P0 - Critical (Must Fix)
1. Color contrast issues (if any found)
2. Touch target sizes < 44x44px
3. Keyboard navigation blockers
4. Mobile layout breaks

### P1 - High (Should Fix)
1. Spacing inconsistencies (8px grid violations)
2. Font size hierarchy refinements
3. Focus ring visibility issues
4. Performance bottlenecks (< 60fps)

### P2 - Medium (Nice to Have)
1. Dark mode CSS variables structure
2. Ultra-wide display optimization
3. Animation timing fine-tuning
4. Bundle size optimization

### P3 - Low (Future)
1. WCAG AAA contrast (7:1)
2. Advanced haptic patterns
3. Micro-interaction polish
4. Easter egg animations

---

## Implementation Strategy

### Phase A: Measurement & Audit (30 min)
1. Run automated accessibility audit
2. Test on real mobile device
3. Profile performance with DevTools
4. Document all findings

### Phase B: Quick Wins (45 min)
1. Fix spacing inconsistencies
2. Adjust font sizes
3. Fine-tune colors
4. Optimize touch targets

### Phase C: Responsive Polish (45 min)
1. Mobile layout refinements
2. Tablet breakpoint optimization
3. Touch interaction polish

### Phase D: Dark Mode Prep (30 min)
1. Convert to CSS custom properties
2. Create dark mode palette
3. Add media query structure
4. Test transitions

### Phase E: Performance (30 min)
1. Remove duplicate CSS
2. Optimize animations
3. Audit bundle size
4. Profile runtime performance

### Phase F: Testing & Validation (30 min)
1. Cross-browser testing
2. Accessibility re-check
3. Performance validation
4. Build verification

**Total Estimated Time:** 3-4 hours

---

## Success Criteria

### Visual Quality
- [ ] Spacing follows 8px grid 95%+ of the time
- [ ] Font hierarchy is clear and purposeful
- [ ] Colors pass WCAG AA at minimum
- [ ] No visual inconsistencies across eras

### Responsive Excellence
- [ ] Works flawlessly on 320px (iPhone SE)
- [ ] Optimized for 768px (iPad)
- [ ] Perfect on 1920px (Desktop)
- [ ] Graceful on 2560px+ (Ultra-wide)

### Accessibility
- [ ] All contrast ratios meet WCAG AA
- [ ] Focus states visible on all elements
- [ ] Keyboard navigation is smooth
- [ ] Screen reader friendly

### Performance
- [ ] 60fps scroll on mid-range devices
- [ ] < 2s load time on 3G
- [ ] Bundle size < 5KB increase
- [ ] No memory leaks

---

## Notes

- Focus on refinement, not re-implementation
- Make incremental changes, test after each
- Document deviations from plan
- Prioritize user experience over perfection

---

**Created:** May 21, 2026
**Pixel (Design Engineer)**
