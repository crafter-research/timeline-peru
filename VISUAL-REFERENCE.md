# Visual Style Reference - Timeline Peru

Based on: History of Aotearoa Timeline Design

---

## 1. Core Aesthetic

**Style Name:** Editorial Archival Timeline

**Design Philosophy:** A museum-quality visualization that bridges historical documentation with modern editorial design, treating historical events as curated exhibits rather than mere data points.

**Key Influences:**
- Academic journal layouts
- Museum exhibit design
- 19th-century cartographic illustrations
- Newspaper infographics
- Scientific figure annotations

---

## 2. Color Palette

| Color | Hex Code | Usage Context |
|-------|----------|---------------|
| **Warm White** | `#F5F3EF` | Background, paper texture |
| **Charcoal Black** | `#1A1A1A` | Primary text, headlines |
| **Soft Gray** | `#6B6B6B` | Secondary text, annotations |
| **Light Gray** | `#D4D4D4` | Timeline lines, borders |
| **Vermillion Red** | `#C4342D` | Era highlights, key markers, accent |
| **Sepia Tones** | `#8B7355` to `#D4C4A8` | Historical images, vintage treatment |

**Total Colors:** 6 core colors + sepia image palette

**Color Usage Rules:**
- Red ONLY for era divisions and important markers (sparingly)
- Gray for structural elements (lines, annotations)
- Black for primary content
- Warm white creates "aged paper" feel

---

## 3. Typography System

### Headlines
- **Family:** Serif (similar to Times New Roman, Georgia, or Playfair Display)
- **Weight:** Bold (700)
- **Style:** All caps for main title, sentence case for subtitles
- **Scale:** Large, commanding presence

### Body Text
- **Family:** Serif (same as headlines)
- **Weight:** Regular (400)
- **Size:** Small, dense paragraphs
- **Line Height:** Tight (1.3-1.4)
- **Column Width:** Narrow (150-200px max)

### Annotations & Labels
- **Family:** Sans-serif or monospace
- **Weight:** Regular
- **Style:** Italicized for figure labels ("Fig 1", "Fig 2")
- **Size:** Very small (10-12px equivalent)

### Event Titles
- **Family:** Serif
- **Weight:** Bold
- **Style:** Sentence case with decorative underlines
- **Special:** Some titles use small caps

### Hierarchy Structure:
1. Main Title (largest, bold, serif)
2. Era Labels (medium, red highlight)
3. Event Titles (small, bold, underlined)
4. Body Text (smallest, regular)
5. Annotations (tiny, italic, gray)

---

## 4. Key Design Elements

### Timeline Structure
- **Orientation:** Horizontal flow, left to right
- **Line Style:** Thin gray line with small tick marks
- **Markers:** Small circles at event points, larger red circle for pivotal moments
- **Date Labels:** Below timeline, aligned with markers

### Image Panels
- **Shape:** Tall vertical rectangles (portrait orientation)
- **Treatment:** Sepia/grayscale historical images
- **Border:** None or very subtle
- **Annotations:** "Fig X" labels in top-left corner
- **Placement:** Staggered heights above timeline
- **Connection:** Thin vertical lines connecting to timeline

### Connecting Lines
- **Style:** Hairline (1px)
- **Color:** Light gray (#D4D4D4)
- **Annotations:** Duration labels ("127 Years Between Encounters")

### Text Blocks
- **Layout:** Narrow columns below timeline
- **Alignment:** Left-aligned
- **Spacing:** Generous space between event descriptions

### Era Divisions
- **Style:** Red underline or highlight
- **Labels:** "Pre War", "Post War" style indicators
- **Position:** Top-right corner or above timeline

### Grid System
- **Structure:** Multi-column layout
- **Image Zone:** Upper 60% of canvas
- **Timeline Zone:** Middle strip
- **Description Zone:** Lower 30%

---

## 5. Visual Concept

### Conceptual Bridge
The design creates a dialogue between **archival authenticity** and **modern information design**. Historical images are presented as museum artifacts (with figure numbers), while the timeline provides a clean, contemporary navigation system.

### Element Relationships
- Images serve as **visual anchors** for each era
- The timeline acts as a **wayfinding system**
- Text blocks provide **detailed context** without cluttering the visual hierarchy
- Red accents create **emphasis without overwhelming**

### Ideal Use Cases
- Educational historical timelines
- Museum digital exhibits
- Academic presentations
- Cultural heritage documentation
- Editorial longform features

---

## 6. Implementation Guidelines for Timeline Peru

### Recommended Changes

1. **Replace Vis.js Timeline** with custom CSS/React implementation
2. **Add vertical image panels** for key events
3. **Use serif typography** (e.g., Playfair Display, EB Garamond)
4. **Implement era dividers** with red accent
5. **Add figure annotations** ("Fig 1", "Fig 2") to images
6. **Create narrow description columns** below timeline

### Component Structure
```
Header (title + era legend)
  |
Image Gallery Zone (staggered vertical panels with connections)
  |
Timeline Line (horizontal with markers)
  |
Event Descriptions Zone (narrow columns)
```

### Typography Recommendations
- **Headline:** `font-family: 'Playfair Display', Georgia, serif`
- **Body:** `font-family: 'Source Serif Pro', Georgia, serif`
- **Annotations:** `font-family: 'Source Sans Pro', system-ui, sans-serif`

### Color CSS Variables
```css
:root {
  --bg-paper: #F5F3EF;
  --text-primary: #1A1A1A;
  --text-secondary: #6B6B6B;
  --line-gray: #D4D4D4;
  --accent-red: #C4342D;
  --sepia-dark: #8B7355;
  --sepia-light: #D4C4A8;
}
```
