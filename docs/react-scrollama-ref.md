# react-scrollama Reference

## Installation

```bash
npm install react-scrollama
```

## Basic Usage

```tsx
import { Scrollama, Step } from "react-scrollama";
import { useState } from "react";

function MyScrollySection() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const onStepEnter = ({ data, direction, entry }) => {
    // data: whatever you passed as the `data` prop on <Step>
    // direction: "up" or "down"
    // entry: IntersectionObserverEntry
    setCurrentStepIndex(data);
  };

  const onStepExit = ({ data, direction, entry }) => {
    // Same signature as onStepEnter
  };

  const onStepProgress = ({ data, progress }) => {
    // progress: 0 to 1, how far through the step
    // Only fires if Scrollama has `progress` prop set to true
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sticky visual */}
      <div style={{ position: "sticky", top: 0, height: "100vh", flex: 1 }}>
        <MyVisual step={currentStepIndex} />
      </div>

      {/* Scrolling text steps */}
      <div style={{ flex: 1 }}>
        <Scrollama onStepEnter={onStepEnter} offset={0.5}>
          <Step data={0}>
            <div style={{ minHeight: "80vh" }}>
              <p>First narrative step</p>
            </div>
          </Step>
          <Step data={1}>
            <div style={{ minHeight: "80vh" }}>
              <p>Second narrative step</p>
            </div>
          </Step>
        </Scrollama>
      </div>
    </div>
  );
}
```

## Scrollama Props

| Prop             | Type     | Default | Description                                                                                                 |
| ---------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `onStepEnter`    | function | —       | Fires when a step crosses the offset threshold                                                              |
| `onStepExit`     | function | —       | Fires when a step leaves the offset threshold                                                               |
| `onStepProgress` | function | —       | Fires continuously with progress (0–1). Requires `progress={true}`                                          |
| `offset`         | number   | 0.3     | Trigger point as fraction of viewport height (0 = top, 1 = bottom). **Use 0.5 for center-screen triggers.** |
| `progress`       | boolean  | false   | Enable step progress tracking                                                                               |
| `threshold`      | number   | 4       | Number of IntersectionObserver thresholds                                                                   |
| `debug`          | boolean  | false   | Show trigger offset line                                                                                    |

## Step Props

| Prop       | Type      | Description                                             |
| ---------- | --------- | ------------------------------------------------------- |
| `data`     | any       | Passed to callbacks. Typically the step index (number). |
| `children` | ReactNode | **Must be exactly ONE child DOM element.**              |

## Critical Rules

1. **Each `<Step>` must contain exactly ONE child DOM element.** Not a fragment, not multiple elements.

```tsx
// ✅ CORRECT
<Step data={0}>
  <div>Content here</div>
</Step>

// ❌ WRONG — fragment
<Step data={0}>
  <>
    <p>Line 1</p>
    <p>Line 2</p>
  </>
</Step>

// ❌ WRONG — multiple children
<Step data={0}>
  <p>Line 1</p>
  <p>Line 2</p>
</Step>
```

2. **Step children need explicit height.** Use `minHeight: "80vh"` or similar. Without height, steps stack on top of each other and Scrollama can't observe them.

3. **Scrollama uses IntersectionObserver internally.** It does not use scroll event listeners. This is performant but means steps must be real DOM elements with measurable dimensions.

4. **For Astro:** Scrollama components must be in React islands with `client:load` or `client:visible` directive. Scrollama requires the browser's IntersectionObserver API — it cannot run server-side.

## Pattern: Connecting to Visuals

```tsx
// The visual component receives the current step and renders accordingly
function StickyVisual({ currentStep }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {currentStep === 0 && <IntroAnimation />}
      {currentStep === 1 && <ChartPhase1 />}
      {currentStep === 2 && <ChartPhase2 />}
      {/* Or use transitions based on step */}
    </div>
  );
}

// Alternative: use step to drive animation state
function StickyVisual({ currentStep }) {
  useEffect(() => {
    // Trigger GSAP animation based on step
    if (currentStep === 1) {
      gsap.to(".chart-line", { opacity: 1, duration: 0.6 });
    }
    if (currentStep === 2) {
      gsap.to(".annotation", { opacity: 1, y: 0, duration: 0.4 });
    }
  }, [currentStep]);

  return <svg ref={svgRef}>...</svg>;
}
```
