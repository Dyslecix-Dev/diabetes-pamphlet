# Accessibility Requirements

These requirements apply to every section. This is an educational project for community college students — accessibility is non-negotiable.

## Reduced Motion

```tsx
// utils/a11y.ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Hook version for React components
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

### Rules

- Check `prefers-reduced-motion` before ANY GSAP animation or D3 transition
- If true: show final visual state immediately, skip all transitions
- Scrollama step triggers must still work (they update content, just without animation)
- CSS transitions: use `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }`

## Screen Readers

- All SVG visuals: add `role="img"` and descriptive `aria-label`
- D3 charts: include a visually hidden `<table>` with the same data as a text alternative
- Decorative SVGs: use `aria-hidden="true"`
- Dynamic content updates (step changes): use `aria-live="polite"` on the visual container so screen readers announce changes
- The progress bar needs `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

```tsx
// Pattern for chart accessibility
<div className="relative">
  <svg
    ref={chartRef}
    role="img"
    aria-label="Line chart showing diabetes prevalence rising from 11.2% in 2001 to 13.5% in 2023"
  >
    {/* D3 renders here */}
  </svg>
  {/* Visually hidden data table */}
  <table className="sr-only">
    <caption>Diabetes prevalence among US adults, 2001-2023</caption>
    <thead>
      <tr>
        <th>Period</th>
        <th>Total %</th>
      </tr>
    </thead>
    <tbody>
      {data.map((d) => (
        <tr key={d.period}>
          <td>{d.period}</td>
          <td>{d.total}%</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Keyboard Navigation

- All interactive elements (plate builder, glucose slider, timeline) must be fully keyboard-operable
- Tab order must be logical
- Custom interactives need visible focus indicators
- Drag-and-drop (plate builder): provide keyboard alternative (e.g., arrow keys or a select menu)
- Sliders: use native `<input type="range">` as the base, styled with CSS

## Color Contrast

Minimum requirements (WCAG AA):

- Body text: 4.5:1 ratio against background
- Large text (≥ 24px or ≥ 18.66px bold): 3:1 ratio
- Interactive element boundaries: 3:1 ratio

### Combinations to verify

| Foreground           | Background              | Check                                                    |
| -------------------- | ----------------------- | -------------------------------------------------------- |
| `#2D2D2D` text       | `#FAFAF5` bg            | ✅ Should pass easily                                    |
| `#2D2D2D` text       | `#E5D9B6` cream         | ✅ Should pass                                           |
| `#40513B` green-dark | `#FAFAF5` bg            | Verify                                                   |
| `#628141` green-mid  | `#FAFAF5` bg            | Verify                                                   |
| `#E67E22` orange     | `#FAFAF5` bg            | ⚠️ Likely fails for small text — use only for large/bold |
| `#C0392B` danger     | `#FAFAF5` bg            | Verify                                                   |
| White text           | `#40513B` green-dark bg | Verify                                                   |

Use <https://webaim.org/resources/contrastchecker/> to verify before finalizing.

## Focus Indicators

```css
/* Visible focus rings on all interactive elements */
:focus-visible {
  outline: 3px solid var(--color-orange);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove default outline only when custom is applied */
:focus:not(:focus-visible) {
  outline: none;
}
```

## Semantic HTML

- `<h1>`: Site title (one per page)
- `<h2>`: Section titles (one per section, 6 total)
- `<h3>`: Sub-headings within sections if needed
- `<section>`: Each of the 6 main sections, with `aria-labelledby` pointing to its `<h2>`
- `<nav>`: Progress bar / chapter navigation
- `<figure>` + `<figcaption>`: For charts and visualizations
