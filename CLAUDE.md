# Diabetes Scrollytelling Project

## What This Is

A Pudding-style scrollytelling website about diabetes, targeting community college students. Six sections flow as one continuous scroll with chapter breaks and a sticky progress indicator. The tone is conversational, direct, and slightly irreverent while remaining factually rigorous. Short sentences, direct address ("you," "your body"), and surprising facts as hooks.

## Architecture

This is an Astro 6 project with React islands. Each of the 6 sections uses the same scrollytelling pattern: react-scrollama for narrative step triggers and GSAP ScrollTrigger for animations within the sticky visual panel.

### Layout Pattern

- **Mobile (< lg):** Stacked vertical — text block, then visual, then text, then visual
- **Desktop (≥ lg):** Side-by-side — sticky visual on left, scrolling text steps on right

## Tech Stack

| Tool                     | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| **Astro 6**              | Static site generator, islands architecture         |
| **React 19**             | Interactive islands within Astro                    |
| **GSAP + ScrollTrigger** | Scroll-pinned animations, timeline control          |
| **D3.js 7**              | Data visualizations (charts, waffle charts, curves) |
| **react-scrollama 2**    | Step-based narrative triggers                       |
| **Tailwind CSS 4**       | Utility-first styling, responsive design            |
| **Lucide React**         | Icon system                                         |

### Key Dependencies

```json
{
  "dependencies": {
    "astro": "^6.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@astrojs/react": "^5.x",
    "@tailwindcss/vite": "^4.x",
    "gsap": "^3.14.x",
    "d3": "^7.x",
    "react-scrollama": "^2.x",
    "lucide-react": "^1.x",
    "tailwindcss": "^4.x"
  }
}
```

> **Note:** Tailwind v4 uses CSS-based configuration via `@theme` directives in `src/styles/global.css` instead of a `tailwind.config.mjs` file. It is integrated via `@tailwindcss/vite` in `astro.config.mjs` rather than `@astrojs/tailwind`.

## Design Tokens

All colors are CSS custom properties defined in `src/styles/global.css`. See `docs/design-system.md` for full token list, typography, and spacing.

| Token                | Value   | Use                          |
| -------------------- | ------- | ---------------------------- |
| `--color-green-dark` | #40513B | Headings, primary accents    |
| `--color-green-mid`  | #628141 | Interactive elements, charts |
| `--color-cream`      | #E5D9B6 | Backgrounds, cards           |
| `--color-orange`     | #E67E22 | CTAs, highlights, warnings   |
| `--color-danger`     | #C0392B | Risk/complication states     |
| `--color-text`       | #2D2D2D | Body text                    |
| `--color-bg`         | #FAFAF5 | Page background              |

## Key Libraries

- **react-scrollama:** Provides `<Scrollama>` and `<Step>` components. `onStepEnter` callback receives `{ data, direction, entry }`. Use `offset={0.5}` for center-screen triggers. Each `<Step>` must contain exactly ONE child DOM element with explicit height. See `docs/react-scrollama-ref.md` for full API.
- **GSAP + ScrollTrigger:** Register with `gsap.registerPlugin(ScrollTrigger)`. Always use `gsap.context()` for cleanup in React `useEffect`. Always return `ctx.revert()` in cleanup. Pin behavior may conflict with Astro hydration — test thoroughly. See `docs/gsap-scrolltrigger-ref.md` for patterns.
- **D3:** Used for data visualizations. Follow the pattern: select SVG ref, clear previous, render. Use color tokens from CSS custom properties.

## Data

JSON files in `src/data/` contain all statistics. Source citations are included in each file. Never hard-code statistics — always reference the data files.

## Accessibility

Critical for this educational project. Always check `prefers-reduced-motion` before animating. All charts need aria-labels and hidden data table alternatives. Interactive elements must be keyboard-accessible. See `docs/accessibility.md` for full requirements.

## Reference Docs

Detailed implementation guides are in `/docs/`. Read the relevant file before starting work on any section. Always read `architecture.md` and `design-system.md` first.

```text
docs/
├── architecture.md               ← Project structure, component patterns, mobile/desktop layout
├── design-system.md              ← Colors, typography, spacing, responsive breakpoints
├── accessibility.md              ← a11y requirements (applies to every section)
├── react-scrollama-ref.md        ← react-scrollama API reference and usage patterns
├── gsap-scrolltrigger-ref.md     ← GSAP ScrollTrigger API reference and usage patterns
├── section-guide.md              ← All 6 sections: narrative steps, data, interactive elements
└── implementation-order.md       ← Build sequence
```
