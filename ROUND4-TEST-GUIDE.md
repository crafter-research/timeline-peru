# Round 4 Testing Guide

## Visual Test Checklist

Use this guide to systematically test all Round 4 features.

---

## Pre-Test Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Timeline
Navigate to: `http://localhost:4321/`

### 3. Open DevTools
- Chrome: `Cmd/Ctrl + Option/Alt + I`
- Performance tab ready
- Console open for errors

---

## Feature Tests

### Test 1: Parallax Effects ✨

**What to test**: Era backgrounds move subtly on scroll

**Steps**:
1. Scroll timeline horizontally (left/right)
2. Watch era background colors
3. They should move slightly slower than content

**Expected behavior**:
- ✅ Backgrounds shift left/right ~5% of scroll distance
- ✅ Movement is smooth, no jank
- ✅ Different layers move at different speeds
- ✅ 60fps maintained (check DevTools)

**How to verify in DevTools**:
1. Inspect `.era-background` element
2. Scroll timeline
3. Watch `transform` CSS property change
4. Value should show `translate3d(Xpx, 0, 0)`

**Red flags**:
- ❌ Backgrounds don't move
- ❌ Jittery/laggy movement
- ❌ FPS drops below 60
- ❌ Console errors

**Pass criteria**: ✅ Smooth parallax at 60fps

---

### Test 2: Magnetic Hover 🧲

**What to test**: Event dots pull toward cursor

**Steps**:
1. Hover over any event dot
2. Move cursor around dot (small circles)
3. Watch dot follow cursor subtly
4. Move cursor away, dot returns

**Expected behavior**:
- ✅ Dot shifts ~2-3px toward cursor
- ✅ Movement is smooth and immediate
- ✅ Returns to center when cursor leaves
- ✅ Magnetic field ring appears on hover

**How to verify in DevTools**:
1. Inspect event dot button
2. Hover over dot
3. Watch `transform` CSS property
4. Should show `translate3d(Xpx, Ypx, 0)`

**Desktop only**: Works with mouse/trackpad, not touch

**Red flags**:
- ❌ Dot doesn't move
- ❌ Movement lags behind cursor
- ❌ Dot doesn't return to center
- ❌ Movement too strong (>5px)

**Pass criteria**: ✅ Subtle magnetic attraction working

---

### Test 3: Confetti Celebration 🎉

**What to test**: Particle burst on easter egg

**Steps**:
1. Click timeline title ("HISTORIA DEL PERÚ") 5 times quickly
2. Watch for confetti burst
3. Particles should fall and rotate
4. Auto-cleanup after 3 seconds

**Expected behavior**:
- ✅ ~50 particles appear from center
- ✅ Particles are different colors (red, white, gold)
- ✅ Particles are different shapes (square, circle, rectangle)
- ✅ Smooth falling animation with rotation
- ✅ Particles disappear after 3 seconds
- ✅ 60fps maintained during animation

**How to verify in DevTools**:
1. Click title 5 times
2. Inspect Elements tab
3. Find `.confetti-container` element
4. Should contain ~50 `.confetti-particle` children
5. Container auto-removes after 3.5 seconds

**Red flags**:
- ❌ No confetti appears
- ❌ FPS drops significantly (<30fps)
- ❌ Particles don't clean up
- ❌ Particles all same color/shape

**Pass criteria**: ✅ Confetti burst at 60fps with cleanup

---

### Test 4: Sound System 🔊

**What to test**: Optional audio feedback

**Steps**:
1. Find AudioToggle button (bottom-right corner)
2. Click to enable sounds
3. Test each sound type:
   - Click event dot → Success sound (rising tone)
   - Click era filter → Whoosh sound (sweep)
   - Click title 5x → Celebration sound (chord)

**Expected behavior**:
- ✅ AudioToggle shows muted by default
- ✅ Clicking toggles to enabled (animated bars)
- ✅ Each interaction plays distinct sound
- ✅ Sounds don't overlap/clip
- ✅ Volume appropriate (~30-50%)

**How to verify in DevTools**:
1. Console: Check for Web Audio API errors
2. localStorage: Check `timeline-audio-enabled` key
3. Should be `"false"` initially, `"true"` after enabling

**Sound details**:
- **Success**: 400Hz→800Hz rising, 150ms (pleasant)
- **Whoosh**: 300Hz→50Hz sweep, 200ms (transition)
- **Celebration**: C-E-G-C chord arpeggio (joyful)
- **Error**: 400Hz→200Hz falling, 150ms (attention)

**Red flags**:
- ❌ No AudioToggle button visible
- ❌ Sounds don't play when enabled
- ❌ Console errors about AudioContext
- ❌ Sounds too loud/quiet

**Pass criteria**: ✅ All sounds play correctly when enabled

---

### Test 5: Mobile Gestures 📱

**What to test**: Touch interactions on mobile

**Setup**:
- DevTools → Toggle device toolbar (Cmd/Ctrl+Shift+M)
- Select mobile device (iPhone 12, Pixel 5, etc.)
- Or test on actual mobile device

#### Test 5a: Touch Ripples

**Steps**:
1. Tap any button (era filter, event dot, etc.)
2. Watch for ripple effect from tap point

**Expected behavior**:
- ✅ Circular ripple expands from touch point
- ✅ Ripple color matches theme (red tint)
- ✅ Ripple fades out after ~600ms
- ✅ Works on all buttons

**Red flags**:
- ❌ No ripple appears
- ❌ Ripple appears in wrong location
- ❌ Ripple doesn't fade out

#### Test 5b: Swipe Gestures

**Steps**:
1. Swipe left on timeline
2. Swipe right on timeline
3. Timeline should scroll smoothly

**Expected behavior**:
- ✅ Swipe left scrolls right
- ✅ Swipe right scrolls left
- ✅ Smooth momentum scrolling
- ✅ Optional: Swipe indicator shows direction

**Red flags**:
- ❌ Swipe doesn't scroll
- ❌ Swipe feels laggy
- ❌ Conflicts with native scrolling

#### Test 5c: Pull-to-Refresh (Optional)

**Steps**:
1. Scroll to top of page
2. Pull down from top edge
3. Watch for refresh indicator

**Expected behavior**:
- ✅ Spinner appears at top
- ✅ Spinner rotates smoothly
- ✅ Releases when threshold reached
- ✅ Simulates refresh action

**Note**: May conflict with native browser pull-to-refresh

**Pass criteria**: ✅ Touch interactions feel native

---

### Test 6: Performance Optimization ⚡

**What to test**: Animations maintain 60fps

**Setup**:
1. DevTools → Performance tab
2. Click Record (red circle)

**Test sequence**:
1. Scroll timeline 10 seconds
2. Hover over 5 event dots
3. Click title 5x (confetti)
4. Change zoom 3 times
5. Click Stop recording

**Expected behavior**:
- ✅ FPS line solid green at 60fps
- ✅ No red triangles (no long tasks)
- ✅ No yellow frames (no jank)
- ✅ CPU usage <50% on modern device

**How to analyze recording**:
1. Check FPS chart at top
   - Green line = 60fps
   - Yellow/red drops = problems
2. Check Main thread
   - No blocks >50ms
   - RAF callbacks should be short (<10ms)
3. Check GPU
   - Rasterization should be minimal

**Red flags**:
- ❌ FPS drops below 50
- ❌ Long tasks >50ms
- ❌ Excessive reflows/repaints
- ❌ Memory continuously growing

**Pass criteria**: ✅ Solid 60fps throughout test

---

### Test 7: Accessibility ♿

**What to test**: Works with assistive tech

#### Test 7a: Reduced Motion

**Steps**:
1. **macOS**: System Preferences → Accessibility → Display → Reduce motion
2. **Windows**: Settings → Ease of Access → Display → Show animations
3. Reload timeline page
4. Try all interactions

**Expected behavior**:
- ✅ No parallax movement
- ✅ No magnetic hover
- ✅ No confetti animation
- ✅ Instant state changes instead of animations
- ✅ Sounds still work (not motion-based)

**How to verify**:
- DevTools → Elements → Check computed styles
- All animation durations should be `0.01ms` or `0s`

#### Test 7b: Keyboard Navigation

**Steps**:
1. Tab through interface
2. Focus should move to AudioToggle
3. Press Enter to toggle
4. Tab to other elements

**Expected behavior**:
- ✅ Focus indicator visible
- ✅ Enter toggles AudioToggle
- ✅ All interactive elements reachable
- ✅ Focus order logical

#### Test 7c: Screen Reader

**Setup**: Enable VoiceOver (macOS) or NVDA (Windows)

**Steps**:
1. Navigate to AudioToggle
2. Listen to announcement
3. Activate button
4. Listen to state change

**Expected announcement**:
- Initial: "Activar sonidos, button"
- After click: "Desactivar sonidos, button"

**Pass criteria**: ✅ All accessibility features working

---

### Test 8: Cross-Browser 🌐

**What to test**: Works in all modern browsers

#### Chrome/Edge
- [ ] Parallax working
- [ ] Magnetic hover working
- [ ] Confetti working
- [ ] Sounds working
- [ ] 60fps maintained

#### Firefox
- [ ] All features working
- [ ] No console errors
- [ ] Performance similar to Chrome

#### Safari (Desktop)
- [ ] All features working
- [ ] Backdrop blur works
- [ ] Web Audio API working

#### Safari (iOS)
- [ ] Touch ripples working
- [ ] Swipe gestures working
- [ ] Sounds work after user interaction
- [ ] No haptic (not supported)

#### Chrome (Android)
- [ ] All mobile features working
- [ ] Haptic feedback working
- [ ] Performance acceptable

**Pass criteria**: ✅ All features work in all browsers

---

## Automated Tests

### Bundle Size Test
```bash
npm run build
ls -lh dist/assets/*.js
```

**Expected**:
- Main bundle: ~250KB → ~257KB
- Increase: ~7KB gzipped
- Percentage: ~2.8% increase

**Pass**: ✅ Increase <10KB

---

### Type Check
```bash
npm run typecheck
```

**Expected**: No errors

**Pass**: ✅ Zero TypeScript errors

---

### Lint Check
```bash
npm run lint
```

**Expected**: No errors or warnings

**Pass**: ✅ Zero linter issues

---

### Lighthouse Score
```bash
# In Chrome DevTools
# Lighthouse tab → Generate report
```

**Expected scores**:
- Performance: >90 (target: 95+)
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Pass**: ✅ All scores meet targets

---

## Regression Tests

Ensure Round 4 didn't break existing features:

### Core Features Still Work
- [ ] Timeline scrolls horizontally
- [ ] Events display in correct positions
- [ ] Era filters work
- [ ] Search works
- [ ] Event drawer opens
- [ ] Zoom controls work
- [ ] Mobile view works
- [ ] Keyboard shortcuts work
- [ ] Easter egg still works (overlay shows)

### Existing Animations Still Work
- [ ] Event scroll reveals
- [ ] Page transitions
- [ ] Empty state shake
- [ ] Loading skeleton
- [ ] Drawer slide in/out
- [ ] Tooltip animations

**Pass**: ✅ No regressions

---

## Stress Tests

### High Load Test
**Setup**: Large dataset (300+ events)

**Steps**:
1. Load timeline with 300+ events
2. Scroll rapidly back and forth
3. Trigger confetti 10 times
4. Check FPS and memory

**Expected**:
- ✅ FPS stays above 50
- ✅ Memory increase <5MB
- ✅ No crashes

### Rapid Interaction Test
**Setup**: Rapid clicks/hovers

**Steps**:
1. Hover over 20 dots rapidly
2. Click era filters rapidly (10 clicks)
3. Trigger confetti 5 times rapidly
4. Check for bugs

**Expected**:
- ✅ No visual glitches
- ✅ No console errors
- ✅ Animations don't stack incorrectly

---

## Sign-Off Checklist

Before marking Round 4 complete, verify:

### Features
- [ ] Parallax working smoothly
- [ ] Magnetic hover feels good
- [ ] Confetti looks beautiful
- [ ] Sounds are pleasant (when enabled)
- [ ] Mobile gestures feel native
- [ ] AudioToggle works perfectly

### Performance
- [ ] 60fps during all animations
- [ ] No long tasks >50ms
- [ ] Bundle size increase <10KB
- [ ] Lighthouse Performance >90

### Accessibility
- [ ] Reduced motion respected
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Touch targets 44x44px

### Quality
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No linter warnings
- [ ] All browsers work

### Documentation
- [ ] ROUND4-COMPLETE.md exists
- [ ] ROUND4-INTEGRATION-GUIDE.md exists
- [ ] ROUND4-SUMMARY.md exists
- [ ] Code comments clear

---

## Test Results Template

Copy this template to record your test results:

```markdown
# Round 4 Test Results

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Environment**: Browser/OS/Device

## Feature Tests
- [ ] Parallax: PASS/FAIL - Notes: ___
- [ ] Magnetic: PASS/FAIL - Notes: ___
- [ ] Confetti: PASS/FAIL - Notes: ___
- [ ] Sound: PASS/FAIL - Notes: ___
- [ ] Mobile: PASS/FAIL - Notes: ___

## Performance Tests
- FPS during scroll: ___ fps
- FPS during confetti: ___ fps
- Bundle size: ___ KB
- Lighthouse: ___ / 100

## Accessibility Tests
- [ ] Reduced motion: PASS/FAIL
- [ ] Keyboard nav: PASS/FAIL
- [ ] Screen reader: PASS/FAIL

## Cross-Browser Tests
- [ ] Chrome: PASS/FAIL
- [ ] Firefox: PASS/FAIL
- [ ] Safari: PASS/FAIL
- [ ] Mobile Safari: PASS/FAIL
- [ ] Mobile Chrome: PASS/FAIL

## Issues Found
1. ___
2. ___
3. ___

## Overall Result
- [ ] PASS - Ready for production
- [ ] FAIL - Needs fixes (see issues)
```

---

## Quick Visual Reference

### What Each Feature Looks Like

**Parallax**: Era colors shift slightly left/right as you scroll

**Magnetic**: Hover over dot → it moves 2-3px toward cursor

**Confetti**: Click title 5x → colorful particles fall from center

**Sound**: Click AudioToggle → animated bars → sounds on interactions

**Touch Ripple**: Tap button → circle expands from touch point

**Pull Refresh**: Pull down → spinner appears → releases at threshold

---

## Debugging Tips

### Parallax Not Working
1. Check console for errors
2. Verify `.era-background-parallax` class exists
3. Check `transform` style in computed properties
4. Test with reduced motion off

### Magnetic Hover Laggy
1. Check if too many event dots
2. Verify RAF throttling working
3. Reduce magnetic strength
4. Check GPU acceleration class

### Confetti FPS Drop
1. Reduce particle count (50 → 30)
2. Check if other animations running
3. Test on different device
4. Profile with DevTools

### Sound Issues
1. Check localStorage: `timeline-audio-enabled`
2. Check AudioContext in console
3. iOS: Try after user interaction
4. Check browser sound permissions

### Mobile Gestures Not Working
1. Verify touch events registered
2. Check passive listener warnings
3. Test threshold values
4. Disable other gesture libraries

---

**Happy Testing!** 🧪

Remember: The goal is 60fps delightful interactions that feel like magic. If any feature feels janky or distracting, flag it for adjustment.

🎯 **Success Criteria**: Every interaction should feel smooth, intentional, and add joy without distraction.
