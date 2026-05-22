# Editorial Timeline - Quick Reference Card

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    EDITORIAL TIMELINE DESIGN SYSTEM                      ║
║                         Quick Reference Card                             ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────┐
│ 🎨 ERA COLORS (6 Historical Periods)                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ Pre-Inca       #F5E6D3  ▓▓▓▓  border: #D4A574  text: #8B7355           │
│ Inca           #FFE8C5  ▓▓▓▓  border: #E6B76B  text: #A67C52           │
│ Conquista      #FFD5CC  ▓▓▓▓  border: #E68A7A  text: #A85A4A           │
│ Colonia        #E3E3ED  ▓▓▓▓  border: #9999B8  text: #6B6B8B           │
│ República      #C9E4F0  ▓▓▓▓  border: #6BB8DC  text: #4A8BA8           │
│ Contemporáneo  #E8E2D5  ▓▓▓▓  border: #A8987A  text: #7A6B55           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 📊 CATEGORY COLORS (4 Event Types)                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ Política    ⚖️  #3B82F6  ████  Blue                                     │
│ Cultura     🎭  #8B5CF6  ████  Purple                                   │
│ Economía    📊  #10B981  ████  Green                                    │
│ Conflictos  ⚔️  #C4342D  ████  Red (Peru flag)                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🔤 TYPOGRAPHY                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ Headings    → Playfair Display (serif), bold, uppercase                 │
│ Body        → Source Sans 3 (sans), regular/medium                      │
│ Years/Data  → SF Mono (monospace), tabular-nums, semibold              │
│                                                                          │
│ Scale:                                                                   │
│   36px  H1 - Main title                                                 │
│   24px  H2 - Section headers                                            │
│   18px  Large body                                                      │
│   16px  Body text (default)                                             │
│   14px  Small text                                                      │
│   12px  Labels                                                          │
│   10px  Micro labels                                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 📏 SPACING (base unit: 4px)                                             │
├─────────────────────────────────────────────────────────────────────────┤
│ Timeline lane height      200px                                         │
│ Drawer width              560px                                         │
│ Minimap height             64px                                         │
│ Category label width      112px                                         │
│ Event dot base              8px                                         │
│ Event dot hover            20px                                         │
│ Touch target minimum       44px                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ ⚡ ANIMATIONS                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ Duration Fast    150ms  → Hover states                                  │
│ Duration Base    200ms  → Default transitions                           │
│ Duration Slow    300ms  → Complex animations                            │
│                                                                          │
│ Timing:                                                                  │
│   ease-out     cubic-bezier(0, 0, 0.2, 1)                              │
│   bounce       cubic-bezier(0.34, 1.56, 0.64, 1)                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🎯 EVENT DOT STRUCTURE (5 layers)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│         ┌─────────────────────┐                                         │
│         │  1. Shadow Glow     │  blur-md, opacity 50% on hover         │
│         │     (background)    │                                         │
│         └─────────────────────┘                                         │
│                  │                                                       │
│              ┌───▼───┐                                                  │
│              │ 2. ●  │          Primary dot (8px)                       │
│              │ Dot   │          Category color                          │
│              └───┬───┘          Inner highlight gradient                │
│                  │                                                       │
│              ┌───▼───┐                                                  │
│              │ 3. ○  │          Pulse ring (animated)                   │
│              │ Pulse │          Infinite animation on hover             │
│              └───┬───┘                                                  │
│                  │                                                       │
│                  ┊              Connection line (0.5px)                 │
│                  │                                                       │
│              ┌───▼───┐                                                  │
│              │ Info  │          Tooltip with year + title              │
│              │ Box   │          Appears on hover/focus                  │
│              └───────┘                                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🌈 ERA BOUNDARY (New Feature)                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Era 1        │        Era 2                                          │
│   #F5E6D3      │        #FFE8C5                                         │
│                │                                                         │
│                │  ┌─────────┐                                           │
│                ┃  │  1438   │  ← Year badge                             │
│   Gradient  ━━━┃  └─────────┘                                           │
│   Border       ┃                                                        │
│   (1px + glow) │                                                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ ♿ ACCESSIBILITY CHECKLIST                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ ✅ Color contrast WCAG AA (4.5:1 min)                                   │
│ ✅ Touch targets 44x44px minimum                                        │
│ ✅ Focus indicators visible (2px solid)                                 │
│ ✅ Keyboard navigation full support                                     │
│ ✅ Screen reader compatible                                             │
│ ✅ Reduced motion fallbacks                                             │
│ ✅ Semantic HTML (button, a, label)                                     │
│ ✅ Skip link to main content                                            │
│ ✅ ARIA labels on interactive elements                                  │
│ ✅ Live region for search feedback                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🚀 PERFORMANCE                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│ ✅ 60fps scroll (300+ events)                                           │
│ ✅ GPU-accelerated (transform/opacity only)                             │
│ ✅ Bundle size: +3KB gzipped                                            │
│ ✅ No layout shift (CLS < 0.1)                                          │
│ ✅ RAF throttling on scroll                                             │
│ ✅ Debounced search (300ms)                                             │
│ ⚠️  Avoid transition-all                                                │
│ ⚠️  Batch DOM reads/writes                                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 📱 RESPONSIVE BREAKPOINTS                                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Mobile    < 768px   Vertical timeline, bottom sheet                     │
│ Tablet      768px   Horizontal timeline, side drawer                    │
│ Desktop    1280px   Full spacing, optimal layout                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🔧 IMPLEMENTATION PRIORITY                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 1 (Critical - 2 hours)                                            │
│   1. Apply ERA_CONFIG with border colors                                │
│   2. Fix transition-all violations                                      │
│   3. Add era boundary markers                                           │
│   4. Increase event dot size (8px base)                                 │
│                                                                          │
│ Phase 2 (Visual - 1 hour)                                               │
│   5. Enhanced skeleton loading                                          │
│   6. Tabular-nums for years                                             │
│   7. Update spacing values                                              │
│                                                                          │
│ Phase 3 (Polish - ongoing)                                              │
│   8. Multi-layer event dots                                             │
│   9. Enhanced tooltips                                                  │
│  10. Monospace year typography                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 📚 FILE GUIDE                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ Start Here:                                                              │
│   → DESIGN_SESSION_SUMMARY.md  (Overview)                               │
│   → DESIGN_REVIEW.md            (Full analysis)                         │
│                                                                          │
│ Implementation:                                                          │
│   → IMPLEMENTATION_GUIDE.md     (Step-by-step)                          │
│   → timeline-enhancements.css   (New CSS file)                          │
│                                                                          │
│ Reference:                                                               │
│   → DESIGN_SYSTEM.md            (Design tokens)                         │
│   → DESIGN_CHANGELOG.md         (What changed)                          │
│   → QUICK_REFERENCE.md          (This file)                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 💡 QUICK TIPS                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ • Use ERA_CONFIG for all era-related styling                            │
│ • Apply tabular-nums to all numeric displays                            │
│ • Always include prefers-reduced-motion fallback                        │
│ • Test with 44x44px minimum touch targets                               │
│ • Use explicit transitions (not transition-all)                         │
│ • Maintain 12:1 contrast for primary text                               │
│ • GPU-accelerate with transform/opacity only                            │
└─────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  TECHNICAL DIFFERENTIATOR: Monospace years with tabular numerals        ║
║  Unique archival aesthetic + functional alignment benefit               ║
╚══════════════════════════════════════════════════════════════════════════╝

Version: 1.0.0 | Last Updated: May 21, 2026
Pixel (Design Engineer) | Crafter Station
```
