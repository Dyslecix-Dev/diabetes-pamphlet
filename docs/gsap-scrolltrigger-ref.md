# GSAP ScrollTrigger Reference

## Installation

```bash
npm install gsap
```

ScrollTrigger is included in the gsap package but must be registered.

## Setup in React

```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

## Critical Rule: Always Use gsap.context() in React

```tsx
function AnimatedComponent() {
  const containerRef = useRef(null);

  useEffect(() => {
    // gsap.context() scopes all animations to the container
    // and provides automatic cleanup
    const ctx = gsap.context(() => {
      // All gsap calls inside here are scoped to containerRef
      gsap.to(".my-element", {
        x: 100,
        scrollTrigger: { trigger: ".my-element", start: "top center" },
      });
    }, containerRef); // <-- scope

    return () => ctx.revert(); // <-- ALWAYS cleanup. Kills all animations + ScrollTriggers
  }, []);

  return <div ref={containerRef}>...</div>;
}
```

**Why this matters:** Without `ctx.revert()`, ScrollTrigger instances persist after component unmount, causing memory leaks and ghost animations. This is the #1 source of bugs with GSAP in React.

## Basic ScrollTrigger

```tsx
gsap.to(".element", {
  x: 100,
  opacity: 1,
  scrollTrigger: {
    trigger: ".trigger-element", // Element that triggers the animation
    start: "top center", // "trigger-position viewport-position"
    end: "bottom center", // When to end
    scrub: true, // Tie animation to scroll position
    markers: true, // DEBUG ONLY — shows start/end lines
  },
});
```

### start/end Format

`"trigger-position viewport-position"` where:

- Trigger positions: `top`, `center`, `bottom`, or pixels/percentages
- Viewport positions: `top`, `center`, `bottom`, or pixels/percentages

```text
start: "top center"     → trigger's top hits viewport center
start: "top 80%"        → trigger's top hits 80% down from viewport top
start: "top top"        → trigger's top hits viewport top
end: "+=2000"           → 2000px of scroll distance from start
end: "bottom top"       → trigger's bottom hits viewport top
```

## Scrub Modes

```tsx
scrub: true; // Direct 1:1 mapping to scroll position (can feel jerky)
scrub: 0.5; // 0.5 second smoothing (recommended)
scrub: 1; // 1 second smoothing
scrub: false; // Animation plays independently when triggered (default)
```

## Pinning

Pin an element in place while scrolling through a trigger range:

```tsx
gsap.to(".content", {
  opacity: 1,
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "+=1500",
    pin: ".pinned-container", // Element to pin
    pinSpacing: true, // Add spacing to prevent content overlap (default: true)
    scrub: 1,
  },
});
```

**Astro warning:** Pin behavior can conflict with Astro's island hydration. If pinned elements jump or flicker, ensure the component uses `client:load` (not `client:visible`) so it hydrates before scroll position is calculated.

**Mobile:** Consider disabling `pin` on mobile and using simpler fade-in triggers instead:

```tsx
const isMobile = window.innerWidth < 1024;

gsap.to(".element", {
  opacity: 1,
  scrollTrigger: {
    trigger: ".element",
    start: "top 80%",
    pin: isMobile ? false : ".container",
    scrub: isMobile ? false : 1,
    toggleActions: isMobile ? "play none none reverse" : undefined,
  },
});
```

## Timeline + ScrollTrigger

For multi-step animations tied to scroll:

```tsx
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: "+=3000", // 3000px of scroll to play full timeline
    scrub: 1,
    pin: true,
  },
});

// Steps play sequentially as user scrolls
tl.to(".step1", { opacity: 1, y: 0, duration: 1 })
  .to(".step1-detail", { opacity: 1, duration: 0.5 })
  .to(".step2", { opacity: 1, y: 0, duration: 1 })
  .to(".step2-detail", { opacity: 1, duration: 0.5 });

// Labels for jumping to points
tl.addLabel("step2", 1.5);
```

## toggleActions (Non-Scrub Animations)

When `scrub` is false, use `toggleActions` to control play/pause/reverse behavior:

```tsx
scrollTrigger: {
  trigger: ".element",
  start: "top 80%",
  // Format: "onEnter onLeave onEnterBack onLeaveBack"
  toggleActions: "play none none reverse",
  // Options: play, pause, resume, reset, restart, complete, reverse, none
}
```

Common patterns:

- `"play none none reverse"` — play on enter, reverse when scrolling back up
- `"play none none none"` — play once, never reverse
- `"restart none none reverse"` — restart each time entering

## Batch Animations (Staggered Reveals)

```tsx
ScrollTrigger.batch(".card", {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
    });
  },
  start: "top 85%",
});
```

## Debugging

```tsx
// Add markers to see trigger points
scrollTrigger: {
  markers: true,  // Shows colored lines for start/end
}

// Log all ScrollTriggers
ScrollTrigger.getAll().forEach(st => console.log(st.vars));

// Refresh after DOM changes (layout shifts, images loading)
ScrollTrigger.refresh();
```

## Integration with react-scrollama

In this project, react-scrollama handles step-based narrative triggers (which text step is active), while GSAP ScrollTrigger handles the visual animations within the sticky panel. They coexist without conflict because:

- Scrollama uses IntersectionObserver on the text steps
- GSAP ScrollTrigger uses scroll position on the visual container
- They operate on different DOM elements

Pattern: Scrollama sets `currentStep` state → visual component receives it as prop → `useEffect` triggers GSAP animation based on step change.
