# Implementation Order

Build in this sequence. Each phase establishes patterns that subsequent phases reuse.

---

## Phase 1: Project Scaffold

Set up the foundation before any section work.

- [x] Initialize Astro project with React and Tailwind integrations
- [x] Configure `astro.config.mjs` with `@astrojs/react` and `@tailwindcss/vite` (Tailwind v4 uses Vite plugin, not `@astrojs/tailwind`)
- [x] Set up Tailwind v4 color tokens via `@theme` in `src/styles/global.css` (no `tailwind.config.mjs` needed)
- [x] Create `src/styles/global.css` with CSS custom properties
- [x] Create `Layout.astro` with HTML shell, Google Fonts, global styles
- [x] Install GSAP, D3, react-scrollama, lucide-react
- [x] Create `src/data/` directory and add all 4 JSON data files
- [x] Create `src/utils/a11y.ts` with `prefersReducedMotion` and `useReducedMotion`
- [x] Create placeholder `index.astro` that imports a test component
- [x] Verify build and dev server work

## Phase 2: Global UI Components

These persist across all sections.

- [x] `ProgressBar.tsx` — sticky top bar showing scroll progress (0–100%). Use `role="progressbar"` with aria attributes.
- [x] `ChapterNav.tsx` — chapter dots or labels (6 sections). Clicking a dot scrolls to that section. Active state highlights current section.
- [x] Wire both into `index.astro`

## Phase 3: Scrollytelling Wrapper

The reusable pattern every section uses.

- [x] `ScrollySection.tsx` — implements the scrollama + sticky visual pattern from `architecture.md`
- [x] `StickyVisual.tsx` — container component for the pinned visual panel
- [x] `NarrativeStep.tsx` — styled text step with fade-in behavior
- [x] Test with dummy content: 3 steps that change a background color on the sticky panel
- [x] Verify mobile stacking works (no sticky behavior below `lg`)
- [x] Verify reduced motion behavior

## Phase 4: Section 1 — What Is Diabetes?

This section exercises all core patterns: scrollama, GSAP animation, D3 chart, live counter.

- [x] `GlucoseAnimation.tsx` — SVG molecule that assembles on scroll. GSAP-driven.
- [x] `PrevalenceChart.tsx` — D3 line chart using `prevalence.json`. Animate line drawing on step entry.
- [x] `DiagnosisCounter.tsx` — live counter starting from page entry. Use `requestAnimationFrame` or `setInterval`.
- [x] Wire all into `ScrollySection` with 8 narrative steps
- [x] Add accessible data table behind the chart
- [ ] Test on mobile

## Phase 5: Section 2 — Type I vs. Type II

- [x] `PopulationSplit.tsx` — 100 SVG human figures. Animate split on step 4 (T1) and step 6 (T2). Step 10 adds prediabetes overlay.
- [x] `TypeComparison.tsx` — side-by-side info cards for T1 vs T2
- [x] `YouthIncidence.tsx` — D3 chart showing T1D +2.02%/yr vs T2D +5.31%/yr using `youth-incidence.json`
- [x] Wire into `ScrollySection` with 10 narrative steps
- [x] Test population animation performance (100 SVG elements)

## Phase 6: Section 5 — Risks and Prevention

Building this before Sections 3–4 because it exercises SVG interaction and the glucose slider — unique patterns.

- [x] Source or create `body-diagram.svg` with individually targetable organ paths
- [x] `BodyDiagram.tsx` — import SVG, highlight organs per scroll step using GSAP (fill color transitions)
- [x] `GlucoseSlider.tsx` — styled `<input type="range">` with color zones (green/orange/red). Show symptoms at each threshold. Fully keyboard-accessible.
- [x] `AmputationStats.tsx` — bar chart or annotated stat display using `complications.json`
- [x] Wire into `ScrollySection` with 11 narrative steps
- [x] Verify organ highlight accessibility (aria-labels per organ)

## Phase 7: Section 3 — How Diabetes Develops

- [x] `DayInTheLife.tsx` — animated physiological sequence (food → blood → insulin → cells). GSAP timeline or step-driven.
- [x] `RiskFactorViz.tsx` — obesity/overweight prevalence stats display
- [x] `ScreeningGap.tsx` — bar chart: 33.4% strict vs 74.3% broad testing. "1 in 4 untested" callout. USPSTF timeline (2008, 2015, 2021).
- [x] Wire into `ScrollySection` with 10 narrative steps

## Phase 8: Section 4 — Treatments

- [x] `PlateBuilder.tsx` — interactive drag-and-drop plate. Food item SVGs with categories. Live fiber/glycemic meter. Keyboard alternative (select menu or arrow keys). This is the most complex interactive — budget extra time.
- [x] `FiberMeter.tsx` — animated glucose curve comparison: with fiber (smooth) vs without (spiky)
- [x] `TreatmentTimeline.tsx` — visual spectrum: lifestyle → medication → insulin
- [x] Wire into `ScrollySection` with 8 narrative steps

## Phase 9: Section 6 — Living with Diabetes

- [x] `DailyTimeline.tsx` — 24-hour horizontal timeline with plotted events (meals, exercise, medication, monitoring). Glucose curve responds to scenario toggles ("skip breakfast", "miss medication", "add walk").
- [x] `ClosingCTA.tsx` — summary message, optional resource links
- [x] Wire into `ScrollySection` with 6 narrative steps

## Phase 10: Polish

- [ ] Transitions between sections — smooth scroll, chapter breaks, background color shifts
- [ ] Progress bar accuracy — verify it tracks all 6 sections correctly
- [ ] Mobile QA — test every section on phone-width viewport
- [ ] Accessibility audit — keyboard navigation through all interactives, screen reader test, contrast check
- [ ] Reduced motion pass — verify all animations respect `prefers-reduced-motion`
- [ ] Performance — check for jank during scroll animations. Optimize SVG complexity if needed.
- [ ] Loading states — add skeleton/placeholder for any components that hydrate slowly
- [ ] Final content pass — proofread all narrative text, verify all statistics match source data files
