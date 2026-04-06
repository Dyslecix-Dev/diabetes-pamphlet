# Architecture

## Project Structure

```text
diabetes-scrollytelling/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── CLAUDE.md
├── docs/
├── public/
│   ├── fonts/
│   └── assets/
│       ├── body-diagram.svg           ← SVG with selectable organ paths
│       └── food-icons/                ← SVG food illustrations
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro           ← HTML shell, fonts, global styles
│   ├── components/
│   │   ├── ProgressBar.tsx            ← Sticky top progress indicator
│   │   ├── ChapterNav.tsx             ← Chapter dots/labels
│   │   ├── ScrollySection.tsx         ← Reusable scrollama wrapper
│   │   ├── StickyVisual.tsx           ← Sticky visual container
│   │   ├── NarrativeStep.tsx          ← Individual text step
│   │   ├── section-one/
│   │   │   ├── GlucoseAnimation.tsx   ← Opening molecule animation
│   │   │   ├── DiagnosisCounter.tsx   ← Live counter
│   │   │   └── PrevalenceChart.tsx    ← D3 line chart (2001–2023)
│   │   ├── section-two/
│   │   │   ├── PopulationSplit.tsx    ← 100-person figure visualization
│   │   │   ├── TypeComparison.tsx     ← Side-by-side type info
│   │   │   └── YouthIncidence.tsx     ← D3 chart (SEARCH study data)
│   │   ├── section-three/
│   │   │   ├── DayInTheLife.tsx       ← Physiological animation sequence
│   │   │   ├── RiskFactorViz.tsx      ← Obesity/sugar trend charts
│   │   │   └── ScreeningGap.tsx       ← Testing rate visualization
│   │   ├── section-four/
│   │   │   ├── PlateBuilder.tsx       ← Interactive meal plate
│   │   │   ├── FiberMeter.tsx         ← Digestion/absorption animation
│   │   │   └── TreatmentTimeline.tsx  ← Treatment progression
│   │   ├── section-five/
│   │   │   ├── BodyDiagram.tsx        ← Scroll-triggered organ highlights
│   │   │   ├── GlucoseSlider.tsx      ← Interactive glucose range
│   │   │   └── AmputationStats.tsx    ← Complication statistics
│   │   └── section-six/
│   │       ├── DailyTimeline.tsx      ← 24-hour interactive timeline
│   │       └── ClosingCTA.tsx         ← Final summary/resources
│   ├── data/
│   │   ├── prevalence.json            ← Section 1: CDC prevalence 2001–2023
│   │   ├── youth-incidence.json       ← Section 2: SEARCH study data
│   │   ├── screening-rates.json       ← Section 3: testing/screening data
│   │   └── complications.json         ← Section 5: amputation incidence
│   ├── utils/
│   │   ├── scrollManager.ts           ← GSAP ScrollTrigger setup helpers
│   │   ├── chartHelpers.ts            ← D3 reusable chart patterns
│   │   └── a11y.ts                    ← Reduced motion, screen reader utils
│   ├── styles/
│   │   └── global.css                 ← CSS custom properties, base styles
│   └── pages/
│       └── index.astro                ← Main page, assembles all sections
```

---

## Core Patterns

### Scrollytelling Pattern (Every Section Uses This)

```tsx
// ScrollySection.tsx — reusable wrapper
import { Scrollama, Step } from "react-scrollama";
import { useState } from "react";

export default function ScrollySection({ id, steps, StickyComponent }) {
  const [currentStep, setCurrentStep] = useState(0);

  const onStepEnter = ({ data }) => setCurrentStep(data);

  return (
    <section id={id} className="relative">
      {/* Desktop: side-by-side. Mobile: stacked */}
      <div className="lg:flex">
        {/* Sticky visual — pinned on desktop */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:flex lg:items-center">
          <StickyComponent currentStep={currentStep} />
        </div>

        {/* Narrative steps */}
        <div className="lg:w-1/2">
          <Scrollama onStepEnter={onStepEnter} offset={0.5}>
            {steps.map((step, i) => (
              <Step data={i} key={i}>
                <div className="min-h-[80vh] flex items-center p-8">
                  <div className="max-w-md mx-auto">{step.content}</div>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
      </div>
    </section>
  );
}
```

### GSAP ScrollTrigger in React

```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(triggerRef, animationFn) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      animationFn(gsap, ScrollTrigger);
    }, triggerRef);

    return () => ctx.revert(); // ALWAYS cleanup
  }, []);
}
```

### D3 Chart in React

```tsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function useD3Chart(renderFn, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // clear previous
    renderFn(svg);
  }, deps);

  return ref;
}
```

---

## Mobile vs Desktop Layout

```text
Mobile (< 1024px):
┌──────────────┐
│  Narrative    │
│  Step Text    │
├──────────────┤
│  Visual       │
│  (inline)     │
├──────────────┤
│  Narrative    │
│  Step Text    │
├──────────────┤
│  Visual       │
│  (updated)    │
└──────────────┘

Desktop (≥ 1024px):
┌───────────┬──────────────┐
│           │  Narrative   │
│  Sticky   │  Step 1      │
│  Visual   ├──────────────┤
│           │  Step 2      │
│  (pinned, ├──────────────┤
│   updates │  Step 3      │
│   per     ├──────────────┤
│   step)   │  Step 4      │
│           │              │
└───────────┴──────────────┘
```

On mobile, the sticky visual becomes a regular inline element that appears between text steps. react-scrollama still fires `onStepEnter` — the visual just isn't pinned. For GSAP ScrollTrigger pins, disable `pin: true` below `lg` breakpoint.
