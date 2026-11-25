# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build -> dist/
npm run preview   # serve the production build
npm run lint      # oxlint (config: .oxlintrc.json)
```

Requires Node 20.19+ (Vite 8). There is no test runner configured (Vitest/Playwright are listed only as future work in the README), so `npm run build` + `npm run lint` are the verification steps. The build and lint are expected to stay at zero errors and zero warnings.

## Architecture

Single-page React 19 + TypeScript (strict) landing page for a sneaker drop. No UI, animation, or state libraries — styling is plain CSS with design tokens, and state is `useReducer` + Context.

- **`src/config/site.ts` is the single source of truth** for brand name, product, price, sizes, checkout URL, contacts and SEO. The UI reads from it, and `vite.config.ts` also uses it to generate the `<head>` (SEO/Open Graph) in `index.html` at build time. Commercial fields are intentionally empty (`price: null` renders "Price on request"; no `checkoutUrl` keeps checkout disabled). Never invent prices, stock, reviews or specs — keep honest fallbacks.
- **Cart** (`src/cart/`): `cartStore.ts` holds the pure reducer and the defensive `localStorage` persistence (invalid data is discarded) and is independent of React; `CartProvider` wires it into Context and `useCart` consumes it. Cart lines are keyed by `productId` + `size`; quantities are clamped to a configurable max.
- **Components** are grouped by role under `src/components/` (`layout`, `sections`, `product`, `cart`, `ui`), each with a co-located `.css` file. Cross-cutting behavior lives in `src/hooks/` (`useFitText` for the hero wordmark, `useFocusTrap`, `useScrollLock`, `useHeaderState`, `useActiveSection`, `useRevealOnScroll`); helpers in `src/lib/`; global tokens (palette, `clamp()` type scale, motion) in `src/styles/tokens.css` and `base.css`.
- **Motion architecture**: pointer effects (hero tilt `usePointerParallax`, `CursorFollower`, `useMagneticButtons`) write CSS custom properties / transforms directly in rAF — never React state — and are gated by `whilePointerMotionAllowed` in `src/lib/media.ts` (fine pointer + no reduced motion, re-evaluated on media changes). Offsets use the independent `translate`/`rotate`/`scale` properties so they compose with existing `transform` animations. Scroll parallax is CSS `animation-timeline` behind `@supports`. Headings opt into line masks with `data-reveal="mask"` + `MaskLine`.
- **Config-gated features**: the countdown (`drop.startsAt`) and the bag's "Notify me" (`contact.email` with no `checkoutUrl`) render nothing until real values exist.
- **Accessibility is a core requirement**: native radios for size selection, focus trap + `inert` on background content for menu/cart, live region announcements, skip link, focus return on close. All animation must respect `prefers-reduced-motion`.
- **Performance constraints**: images are AVIF/WebP with `srcset` and fixed dimensions (CLS 0), fonts (Anton, Space Grotesk) are self-hosted in `public/fonts` with preload. Keep these intact when adding assets.
- Brand palette: pink `#FC3B7F`, cream `#FEF1CF`, royal blue `#0032A8`.

The README is written in Portuguese; code and comments are in English.
