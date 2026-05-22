# Animation Testing Guide

## Quick Test Checklist

### 1. Easter Egg Test (30 seconds)
1. Open timeline in browser
2. Click "HISTORIA DEL PERÚ" title 5 times rapidly
3. **Expected**: Overlay appears with 🇵🇪 flag
4. **Mobile**: Feel 5-pulse vibration pattern
5. **Expected**: Auto-dismisses after 5 seconds

**Pass Criteria**:
- [ ] Overlay appears with correct styling
- [ ] Has elastic bounce animation
- [ ] Auto-dismisses after 5s
- [ ] Manual close works

### 2. Scroll Reveal Test (1 minute)
1. Select "Pre-Inca" era filter
2. Scroll horizontally through timeline slowly
3. **Expected**: Events fade in as they enter viewport

**Pass Criteria**:
- [ ] Events fade in with scale animation
- [ ] Staggered timing visible
- [ ] Animation smooth, no jank

### 3. Page Transition Test (30 seconds)
1. Click different era buttons
2. **Expected**: Smooth cross-fade transition

**Pass Criteria**:
- [ ] Timeline fades briefly
- [ ] 300ms duration
- [ ] Events reset and re-animate

### 4. Empty State Test (30 seconds)
1. Type gibberish in search box
2. **Expected**: Horizontal shake animation
3. **Expected**: Bouncing search icon

**Pass Criteria**:
- [ ] Container shakes horizontally
- [ ] Search icon bounces continuously

### 5. Touch Hint Test (15 seconds)
1. Refresh page
2. Look for scroll hint
3. **Expected**: Bouncing chevrons

**Pass Criteria**:
- [ ] Chevron bounces vertically
- [ ] Disappears after first scroll

**Status**: Ready for testing
**Estimated Time**: 15 minutes
