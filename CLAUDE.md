# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- **Dev server:** `npm start` (ng serve, default port 4200)
- **Build:** `npm run build` (ng build, output to dist/trangular-flash-game)
- **Watch mode:** `npm run watch`
- **Run tests:** `npm test` (Karma + Jasmine)
- **SSR server:** `npm run serve:ssr` (Express on port 4000)

## Architecture

Angular 19 standalone component flash card game with SSR support. No NgModules — all components are standalone.

### Component Structure

- **AppComponent** — Root shell with animated background (25 rotating colored spheres via CSS keyframes, outside fade layer) and `<router-outlet>`. Has page-level fade-in (2s) / fade-out (400ms) Angular animation (`@pageFade`). Includes a fixed "Portfolio" back-link button (top-left) that triggers fade-out then navigates to the portfolio site.
- **StartScreenComponent** — Landing page with Material card and start button, navigates to `/game`. Uses OnPush change detection. Card is gated on `decks.length` to prevent empty-state flash before data loads.
- **GameScreenComponent** — Game orchestrator. Holds all game state locally (no global state management). Loads questions from DeckService (5 decks, ~56 questions total). Manages score, card shuffling (Fisher-Yates), answer tracking, and results display.
- **ThemeToggleComponent** — FAB panel with dark mode toggle and accent hue slider (0-360). Persists preferences to localStorage.
- **FlashcardComponent** — Reusable card display with Angular animations (fade-in scale → zoom-out transitions). Shuffles answer positions on each render to prevent memorization. Communicates via `@Input` (question data, feedback state) and `@Output` (`transitionComplete` event emitting `{ isCorrect, userAnswer }`).

### Routes (`app.routes.ts`)

- `/` → StartScreenComponent
- `/game` → GameScreenComponent
- `/**` → redirect to `/`

### Services

- **DeckService** — Stateless async data fetcher. Loads deck index (`_index.json`) and individual deck JSON files from `public/flash-questions/` via `fetch()`. SSR-safe with `isPlatformBrowser` guard.
- **ThemeService** — Signal-based theme state manager. Dynamic M3 palette generation from hue value, dark mode toggle, localStorage persistence.

### Styling

- Angular Material 19 (azure-blue prebuilt theme) with custom Material Design 3 theme in `theme.css`
- Primary color: `#654bb7` (purple), background: `#6c1a54`
- Font: Inter (body), Roboto (Material), Material Icons
- All component styles use SCSS

### SSR

Express-based SSR via `src/server.ts` using `@angular/ssr/node`. Prerendering is disabled in angular.json (`"prerender": false`) to avoid route extraction issues.

### Project Admin Docs

`project_admin/` is a **separate git repository** (gitignored from the main repo). It lives on an orphaned branch `trangularflashgame` in the `PetraJThomas/project-admins` remote. Contains `spec.md`, `implementation.md`, `completed.md`, and `learnings.md`. Commit and push there independently when updating project docs.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
