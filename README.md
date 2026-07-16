# Cheapest? (mfe-cheapest)

A PWA for comparing unit prices — enter each product's price and quantity, and see which one is the best value.

## Features

- Compare prices across units with automatic conversion (g/kg, ml/L, pieces) — items are grouped by weight, volume, and count
- Best-value item gets a badge; others show how many % more expensive they are
- Product name is optional — auto-named when left blank
- i18n (Thai / English) with a one-tap toggle, auto-detected from the browser language
- Monochrome black & white theme with dark/light mode, following the system preference
- Mobile & tablet first: 44px touch targets, safe-area insets, no-zoom inputs
- Installable PWA with offline support (service worker, network-first cache)
- Items persist in `localStorage` — no backend

## Tech

React 19 + TypeScript + Rsbuild. No runtime dependencies beyond React — state, i18n, theming, and storage are all built-ins.

## Development

```bash
bun install        # install dependencies
bun run dev        # dev server at http://localhost:3000
bun run test       # run tests (rstest)
bun run check      # lint & format (biome)
bun run build      # production build to dist/
bun run preview    # preview the production build
```

## Release & deploy

Releases are manual via GitHub Actions (**Actions → Release & Deploy → Run workflow**). Pick a bump level (patch/minor/major) and the workflow will:

1. Run tests
2. Bump the version, commit, and tag
3. Create a GitHub release with generated notes
4. Build and deploy to GitHub Pages

One-time setup: **Settings → Pages → Source: GitHub Actions**.

Assets use relative paths (`assetPrefix: './'`), so the build works both at the domain root and under the `/mfe-cheapest/` subpath on GitHub Pages.
