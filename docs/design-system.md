# Design System

## Color Tokens

```css
:root {
  /* Primary palette */
  --color-green-dark: #40513b; /* rgb(64, 81, 59) — headings, primary text accents */
  --color-green-mid: #628141; /* rgb(98, 129, 65) — interactive elements, charts */
  --color-cream: #e5d9b6; /* rgb(229, 217, 182) — backgrounds, cards */
  --color-orange: #e67e22; /* rgb(230, 126, 34) — CTA, highlights, warnings */

  /* Extended palette */
  --color-text: #2d2d2d; /* near-black for body text */
  --color-text-muted: #6b6b6b; /* secondary text */
  --color-bg: #fafaf5; /* off-white page background */
  --color-bg-section: #f5f0e3; /* alternate section background */
  --color-danger: #c0392b; /* risk/complication highlights in Section 5 */
  --color-danger-light: #e74c3c; /* lighter danger for hover states */
  --color-success: #27ae60; /* healthy/normal range indicators */

  /* Transparency variants */
  --color-green-dark-10: rgba(64, 81, 59, 0.1);
  --color-orange-20: rgba(230, 126, 34, 0.2);
  --color-danger-15: rgba(192, 57, 43, 0.15);
}
```

## Tailwind Config Extension

```js
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        "green-dark": "#40513B",
        "green-mid": "#628141",
        cream: "#E5D9B6",
        "orange-accent": "#E67E22",
        danger: "#C0392B",
        "danger-light": "#E74C3C",
        success: "#27AE60",
        bg: "#FAFAF5",
        "bg-section": "#F5F0E3",
        "text-primary": "#2D2D2D",
        "text-muted": "#6B6B6B",
      },
    },
  },
};
```

## Typography

Use Google Fonts. Recommended pairings (finalize during implementation):

- **Display/Headings:** "DM Serif Display" or "Fraunces" — warm, editorial feel
- **Body:** "DM Sans" or "Source Sans 3" — clean, highly readable
- **Data/Labels/Counters:** "JetBrains Mono" or "IBM Plex Mono" — for statistics, counters, chart labels

### Scale

| Element       | Size            | Weight   | Font    |
| ------------- | --------------- | -------- | ------- |
| Section title | 3rem / 48px     | Bold     | Display |
| Step heading  | 1.5rem / 24px   | Semibold | Display |
| Body text     | 1.125rem / 18px | Regular  | Body    |
| Caption/label | 0.875rem / 14px | Medium   | Body    |
| Data counter  | 2.5rem / 40px   | Bold     | Mono    |
| Chart label   | 0.75rem / 12px  | Medium   | Mono    |

## Spacing

Follow Tailwind defaults. Key guidelines:

- Each narrative step: `min-height: 80vh` for breathing room
- Section gaps: `py-24` or more between chapters
- Max content width for text: `max-w-md` (28rem) within scroll steps
- Max overall content width: `max-w-7xl` (80rem)

## Responsive Breakpoints

```css
/* Mobile-first, matching Tailwind defaults */
/* sm: 640px — still stacked */
/* md: 768px — transition zone, minor layout adjustments */
/* lg: 1024px — side-by-side sticky layout activates */
/* xl: 1280px — max content width cap */
```

## Visual Style Notes

- Earthy, warm, approachable — not clinical
- Generous whitespace between scroll steps
- Alternate section backgrounds between `--color-bg` and `--color-bg-section` for visual rhythm
- Use `--color-orange` sparingly as an accent — CTAs, key stats, highlighted words
- Use `--color-danger` only in Section 5 for complications
- Charts should use `--color-green-mid` as primary data color, `--color-orange` for highlights/annotations
