# Polish Audit Findings - Round 3

**Date:** May 21, 2026
**Agent:** Pixel (Design Engineer)

---

## Spacing Analysis

### Current Spacing Values (8px = 2 units in Tailwind)

#### Header Section
- `px-8 py-6` (32px, 24px) - Good, follows 8px grid
- `gap-6` (24px) - Good
- `gap-3` (12px) - Good
- `mt-1` (4px) - Violation: should be 8px or 0
- `mt-2` (8px) - Good
- `mt-4` (16px) - Good

#### Filter Buttons
- `gap-2` (8px) - Works but feels tight, recommend `gap-3` (12px)
- `px-4 py-2` (16px, 8px) - Good

#### Legend/Category Section
- `px-8 py-3` (32px, 12px) - Good
- `gap-6` (24px) - Good
- `gap-4` (16px) - Good
- `gap-2` (8px) - Good

#### Event Dots & Tooltips
- `px-4 py-3` (16px, 12px) - Good
- `top-8` (32px) - Good
- `mb-1` (4px) - Violation: consider 8px
- `inset-0.5` (2px) - Acceptable for gradient highlights

#### Drawer
- `px-6 py-5` (24px, 20px) - Violation: py should be 24px
- `px-6 py-6` (24px, 24px) - Good
- `mb-3` (12px) - Good
- `mb-2` (8px) - Good
- `mb-4` (16px) - Good
- `mb-6` (24px) - Good

#### Minimap
- `px-8 py-4` (32px, 16px) - Good
- `space-y-3` (12px) - Good
- `gap-3` (12px) - Good
- `gap-1` (4px) - Acceptable for minimap segments

### Issues Found

1. **mt-1 (4px) violations:** Lines 214, 433
2. **mb-1 (4px) violations:** Lines 388, 407, 433
3. **Drawer header py-5 (20px):** Line 452 - should be py-6 (24px)
4. **Filter button gap:** Could be increased from gap-2 to gap-3

---

## Typography Analysis

### Font Sizes
- `text-4xl` (36px) - Title - Good
- `text-3xl` (30px) - Drawer desktop title - Good
- `text-2xl` (24px) - Desktop event drawer - Good
- `text-xl` (20px) - Mobile drawer, empty state - Good
- `text-lg` (18px) - Drawer date - Good
- `text-base` (16px) - Year markers, drawer content - Good
- `text-sm` (14px) - Subtitle, search, filters, mobile - Good
- `text-xs` (12px) - Category labels, tooltips, minimap - Good
- `text-[10px]` - Era boundary badges - May be too small (minimum 11px)

### Issues Found

1. **Era boundary badges:** `text-[10px]` may be below readable threshold
2. **Letter spacing:** Year markers use `-0.02em` - test if too tight
3. **Line height:** Drawer content uses default 1.5 - could be 1.625 for better readability

---

## Color Contrast (Re-verification)

### Era Colors (Background → Text)
All pass WCAG AA (4.5:1), verified in Round 2.

### Additional Checks Needed
1. **Secondary text (#6B6B6B) on white:** Need to verify 4.5:1
2. **Event dots on era backgrounds:** Visual check needed
3. **Search input border (#D4D4D4):** May need darker shade

---

## Touch Target Analysis

### Desktop (Mouse)
- Event dots: 8px base, 44x44px invisible hit area - Good
- Filter buttons: Minimum 40px height - Good
- Keyboard shortcuts button: 32x32px - Below minimum, should be 44x44px

### Mobile
- Bottom sheet drag handle: Visual only, no interaction - Okay
- Mobile event cards: Full width - Good
- Close buttons: Need to verify 44x44px minimum

### Issues Found

1. **Keyboard shortcuts button:** `w-8 h-8` (32px) - should be `w-11 h-11` (44px)
2. **Close buttons in drawers:** Need to verify actual hit area is 44x44px

---

## Responsive Issues

### Breakpoints
- Only using `md:` (768px) breakpoint
- No `sm:` breakpoint for small tablets (640px)
- No `lg:` or `xl:` for large displays

### Mobile Spacing
- Mobile cards: `px-4 py-6` - Good
- Mobile drawer: `px-4 py-3` header, `px-4 py-4` content - Good

### Issues Found

1. **Missing tablet breakpoint:** 640-768px range not optimized
2. **Ultra-wide displays:** No max-width constraint on header content

---

## Performance Observations

### CSS
- Multiple similar keyframe animations (fadeIn, slideIn, etc.)
- Duplicate transition declarations
- Backdrop-filter may impact older devices

### Animations
- All use GPU-accelerated properties (transform, opacity) - Good
- RAF throttling in scroll handler - Good
- IntersectionObserver for scroll reveals - Good

### Issues Found

1. **Duplicate animations:** Multiple fade/slide variations could be consolidated
2. **Backdrop blur:** May need feature detection fallback

---

## Dark Mode Preparation

### Hardcoded Colors Found
- Background: `#F5F1E8`, `#1A1A1A`, `#6B6B6B`, `#D4D4D4`
- Accent: `#C4342D`, `#A42D26`
- White/Black: Direct usage in many places

### Recommendation
Convert to CSS custom properties:
```css
--color-bg-primary: #F5F1E8;
--color-bg-secondary: #FFFFFF;
--color-text-primary: #1A1A1A;
--color-text-secondary: #6B6B6B;
--color-border-default: #D4D4D4;
--color-accent-red: #C4342D;
--color-accent-red-hover: #A42D26;
```

---

## Priority Fixes

### P0 - Critical
1. Keyboard shortcuts button touch target (32px → 44px)
2. Era boundary badge font size (10px → 11px minimum)

### P1 - High
3. Drawer header padding (py-5 → py-6)
4. Filter button gap (gap-2 → gap-3)
5. Remove 4px spacing violations (mt-1, mb-1 → 0 or 8px)

### P2 - Medium
6. Add CSS custom properties for dark mode prep
7. Consolidate duplicate animation keyframes
8. Add sm: breakpoint for tablets

### P3 - Low
9. Optimize backdrop-filter performance
10. Add max-width to header on ultra-wide displays

---

## Measurements Complete

Ready to proceed to implementation phase.

**Next:** Implement Phase B fixes (spacing, typography, touch targets)
