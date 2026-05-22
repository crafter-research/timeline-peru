# Editorial Timeline - Design Review Session
**Date:** May 21, 2026
**Component:** `/src/components/EditorialTimeline.tsx`
**Reviewer:** Pixel (Design Engineer)

---

## Executive Summary

The Editorial Timeline component demonstrates strong foundational design with good accessibility practices. This review identifies incremental improvements across visual hierarchy, color scheme, typography, and microinteractions to elevate the component to production-grade quality.

**Current State:** Functional archival aesthetic with basic accessibility
**Target State:** Refined editorial design with enhanced visual hierarchy and smooth transitions

---

## Web Interface Guidelines Compliance

### Violations Found

1. **Line 728** - Implicit `transition-all` in hover-lift class
   **Fix:** Replace with explicit `transition: transform 200ms ease-out, box-shadow 200ms ease-out`

2. **Line 594** - Search input focus transition uses `transition-all`
   **Fix:** Change to `transition: border-color 300ms ease-out, box-shadow 300ms ease-out`

3. **Line 1131** - Event dots are 4px (too small for accessibility)
   **Fix:** Increase to 8px minimum (w-2 h-2)

4. **global.css:108** - `.filter-transition` uses `transition: all`
   **Fix:** List explicit properties

### Accessibility Strengths

- Skip link properly implemented (line 528-533)
- Live region for search/filter feedback (line 536-548)
- ARIA labels on all interactive elements
- Focus trap in drawer (line 469-519)
- Keyboard shortcuts well-documented

---

## Design Improvements by Category

### 1. COLOR SCHEME - Enhanced Era Distinction

**Problem:** Era colors are too similar, blending together in the timeline view. Insufficient visual separation between historical periods.

**Current ERA_CONFIG:**
```typescript
preinca:       { color: "#FFF9E6" }  // Too light, low contrast
inca:          { color: "#FFF4E6" }  // Nearly identical to preinca
conquista:     { color: "#FFE8E6" }  // Blends with inca
colonia:       { color: "#F0F0F5" }  // Weak distinction
republica:     { color: "#E8F4F8" }  // Lacks saturation
contemporaneo: { color: "#F5F1E8" }  // Barely distinguishable
```

**Improved Palette (maintains archival aesthetic):**
```typescript
const ERA_CONFIG = {
  preinca: {
    label: "Pre-Inca",
    range: "15000 a.C. - 1438",
    color: "#F5E6D3",      // Warmer beige with more saturation
    borderColor: "#D4A574", // Clear boundary marker
    textColor: "#8B7355",  // Enhanced readability
    endYear: 1438
  },
  inca: {
    label: "Inca",
    range: "1438 - 1532",
    color: "#FFE8C5",      // Distinct golden tone
    borderColor: "#E6B76B",
    textColor: "#A67C52",
    endYear: 1532
  },
  conquista: {
    label: "Conquista",
    range: "1532 - 1572",
    color: "#FFD5CC",      // Coral-tinted for conflict
    borderColor: "#E68A7A",
    textColor: "#A85A4A",
    endYear: 1572
  },
  colonia: {
    label: "Colonia",
    range: "1572 - 1821",
    color: "#E3E3ED",      // Cool lavender for colonial period
    borderColor: "#9999B8",
    textColor: "#6B6B8B",
    endYear: 1821
  },
  republica: {
    label: "Republica",
    range: "1821 - 1968",
    color: "#C9E4F0",      // Stronger blue for republic
    borderColor: "#6BB8DC",
    textColor: "#4A8BA8",
    endYear: 1968
  },
  contemporaneo: {
    label: "Contemporaneo",
    range: "1968 - presente",
    color: "#E8E2D5",      // Neutral modern tone
    borderColor: "#A8987A",
    textColor: "#7A6B55",
    endYear: 2030
  },
} as const;
```

**Implementation:**
- Add border indicators between era segments (line 1024-1032)
- Use borderColor for era transition markers
- Apply textColor for era labels in minimap

---

### 2. VISUAL HIERARCHY - Typography & Sizing

**Year Markers (lines 1050-1058)**
- **Current:** `text-sm font-bold` - lacks size contrast
- **Improved:**
  ```tsx
  className="text-base font-bold tracking-tight tabular-nums"
  style={{ fontVariantNumeric: 'tabular-nums' }}
  ```
- **Rationale:** Tabular nums ensure year alignment, larger size improves scanability

**Event Dots (line 1130)**
- **Current:** `w-4 h-4` (16px) - acceptable but could be larger
- **Improved:** `w-2 h-2` with scale transform `group-hover:scale-[2.5]`
- **Rationale:** 8px base ensures visibility, 20px on hover maintains WCAG touch targets

**Category Labels (line 1081-1083)**
- **Current:** `text-xs` - competes with timeline content
- **Improved:**
  ```tsx
  className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest"
  ```
- **Rationale:** Smaller, quieter labels reduce visual noise

---

### 3. SPACING REFINEMENTS

**Timeline Lanes**
- **Current:** `height: "180px"` (line 1074)
- **Recommended:** `height: "200px"`
- **Rationale:** 20px additional breathing room reduces cramped feeling

**Drawer Width**
- **Current:** `w-[500px]` (line 1376)
- **Recommended:** `w-[560px]`
- **Rationale:** Better accommodation for images + text, maintains 16:9 aspect ratio comfort

**Minimap Height**
- **Current:** `h-14` (56px) - adequate
- **Recommended:** `h-16` (64px)
- **Rationale:** Improves touch target size on mobile, better visual weight

---

### 4. ERA TRANSITIONS - Visual Boundaries

**Add visible era boundary markers** (insert after line 1033):
```tsx
{/* Era boundary markers */}
{eraSegments.map((segment, index) => {
  if (index === eraSegments.length - 1) return null;
  const nextSegment = eraSegments[index + 1];
  const boundaryPosition = segment.endPos;

  return (
    <div
      key={`boundary-${segment.era}`}
      className="absolute top-0 bottom-0 w-1 pointer-events-none z-10 era-boundary"
      style={{
        left: `${boundaryPosition}%`,
        background: `linear-gradient(to bottom,
          ${ERA_CONFIG[segment.era].borderColor} 0%,
          ${ERA_CONFIG[nextSegment.era].borderColor} 100%)`,
        boxShadow: `0 0 8px ${ERA_CONFIG[segment.era].borderColor}40`,
      }}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-white/90 border backdrop-blur-sm"
           style={{ borderColor: ERA_CONFIG[segment.era].borderColor }}>
        {segment.era === 'preinca' && '1438'}
        {segment.era === 'inca' && '1532'}
        {segment.era === 'conquista' && '1572'}
        {segment.era === 'colonia' && '1821'}
        {segment.era === 'republica' && '1968'}
      </div>
    </div>
  );
})}
```

---

### 5. ENHANCED EVENT DOT INTERACTIONS

**Current implementation (line 1128-1145):** Good foundation with pulse effect
**Improvements:**

```tsx
{/* Event dot with multi-layer depth */}
<div className="relative flex flex-col items-center cursor-pointer">
  {/* Base shadow layer */}
  <div
    className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 group-focus-visible:opacity-50 transition-opacity duration-300"
    style={{
      backgroundColor: config.color,
      transform: "scale(2)",
    }}
  />

  {/* Primary dot */}
  <div
    className="w-2 h-2 rounded-full transition-all duration-300 ease-out group-hover:scale-[2.5] group-focus-visible:scale-[2.5] group-hover:shadow-xl group-focus-visible:shadow-xl relative z-10"
    style={{
      backgroundColor: config.color,
      boxShadow: `0 2px 8px ${config.color}60, inset 0 1px 2px rgba(255,255,255,0.4)`,
    }}
  >
    {/* Inner highlight for depth */}
    <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
  </div>

  {/* Pulse ring */}
  <div
    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
    style={{
      backgroundColor: config.color,
      animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
    }}
  />

  {/* Connection line to tooltip */}
  <div
    className="absolute top-full h-2 w-0.5 opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40 transition-opacity duration-300"
    style={{ backgroundColor: config.color }}
  />
</div>
```

---

### 6. TYPOGRAPHY - Monospace Integration

**Add technical differentiator via monospace for years:**

```tsx
// In formatYear function (line 48-56), wrap output:
function formatYear(date: Date): string {
  const year = date.getFullYear();
  const formatted = year < 0
    ? `${Math.abs(year)} a.C.`
    : year < 1500
      ? `${year} d.C.`
      : year.toString();

  return formatted;
}

// Usage in JSX with tabular nums:
<span className="font-mono tabular-nums text-[#C4342D]">
  {formatYear(event.date)}
</span>
```

**Add to global.css:**
```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Monospace override for year displays */
.year-display {
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```

---

### 7. ENHANCED SKELETON LOADING

**Current (line 81-101):** Basic pulse animation
**Improvement - Add shimmer effect:**

```tsx
function TimelineSkeleton() {
  return (
    <div className="relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      {/* Header skeleton */}
      <div className="border-b border-[#D4D4D4] px-8 py-6 sticky top-0 bg-[#F5F1E8] z-40">
        <div className="h-10 bg-gradient-to-r from-[#D4D4D4] to-[#C4C4C4] rounded w-80 mb-3" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gradient-to-r from-[#D4D4D4] to-[#C4C4C4] rounded-full"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Timeline skeleton with stagger */}
      <div className="px-8 py-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-gradient-to-r from-[#D4D4D4] to-[#C4C4C4] rounded mb-4"
            style={{
              animationDelay: `${i * 150}ms`,
              opacity: 1 - (i * 0.15)
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

**Add to global.css:**
```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
```

---

### 8. RESPONSIVE IMPROVEMENTS

**Mobile Event Cards (line 1336)**
- Add subtle elevation on press
- Improve spacing

```tsx
<div className="border border-[#D4D4D4] bg-white p-5 rounded-xl hover:border-[#C4342D] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md">
  {/* content */}
</div>
```

**Mobile Drawer (line 1457)**
- Add pull-to-dismiss indicator animation

```tsx
{/* Drag handle with animation hint */}
<div className="w-12 h-1 bg-[#D4D4D4] rounded-full mx-auto mb-3 animate-pulse-subtle" />
```

---

## Implementation Priority

### Phase 1 - Critical (Do First)
1. ✅ Fix `transition-all` violations (lines 594, 728)
2. ✅ Increase event dot size to 8px minimum
3. ⏳ Implement enhanced ERA_CONFIG with border colors
4. ⏳ Add tabular-nums to year displays

### Phase 2 - Visual Hierarchy (This Week)
1. ⏳ Add era boundary markers
2. ⏳ Enhance event dot interactions (multi-layer depth)
3. ⏳ Improve skeleton loading (shimmer effect)
4. ⏳ Refine spacing (lane height, drawer width)

### Phase 3 - Polish (Next Sprint)
1. ⏳ Integrate monospace typography for years
2. ⏳ Mobile responsive refinements
3. ⏳ Enhanced tooltip animations
4. ⏳ Minimap interaction improvements

---

## Testing Checklist

- [ ] **Accessibility:** Test with screen reader (VoiceOver/NVDA)
- [ ] **Keyboard Navigation:** All shortcuts work correctly
- [ ] **Touch Targets:** Minimum 44x44px on mobile
- [ ] **Color Contrast:** All text meets WCAG AA (4.5:1 minimum)
- [ ] **Reduced Motion:** Verify `prefers-reduced-motion` respected
- [ ] **Responsive:** Test on 375px, 768px, 1024px, 1440px viewports
- [ ] **Performance:** Timeline with 300+ events maintains 60fps scroll
- [ ] **Browser Compat:** Test Safari, Firefox, Chrome, Edge

---

## Design Patterns Learned

1. **Era Differentiation:** Use color + border + text color trinity for strong visual distinction
2. **Archival Aesthetic:** Muted saturation with clear contrast boundaries
3. **Event Markers:** Multi-layer approach (shadow + dot + pulse) creates depth
4. **Year Typography:** Monospace + tabular-nums ensures alignment and scannability
5. **Microinteractions:** Transform + opacity + shadow = perception of quality

---

## Files Modified

- `/src/components/EditorialTimeline.tsx` - Primary component
- `/src/styles/global.css` - Animation keyframes, utility classes

---

## Screenshots

*Capture before/after screenshots here once changes are implemented*

### Before
- Current era colors blend together
- Event dots feel small
- Era transitions lack visual weight

### After
- Clear era boundaries with gradient borders
- Prominent event dots with depth
- Smooth era transitions with labeled boundaries

---

**Next Session:** Focus on animation refinements and interaction polish
**Review Date:** May 22, 2026
