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

- **AppComponent** — Root shell with animated background (25 rotating colored spheres via CSS keyframes) and `<router-outlet>`
- **StartScreenComponent** — Landing page with Material card and start button, navigates to `/game`. Uses OnPush change detection.
- **GameScreenComponent** — Game orchestrator. Holds all game state locally (no global state management). Contains the flashcard question bank (~58 questions on Angular, .NET, auth, RxJS). Manages score, card shuffling (Fisher-Yates), answer tracking, and results display.
- **FlashcardComponent** — Reusable card display with Angular animations (fade-in scale → zoom-out transitions). Communicates via `@Input` (question data, feedback state) and `@Output` (`transitionComplete` event emitting `{ isCorrect, userAnswer }`).

### Routes (`app.routes.ts`)

- `/` → StartScreenComponent
- `/game` → GameScreenComponent
- `/**` → redirect to `/`

### Services

- **FlashcardService** — Injectable score tracker (`updateScore`, `getScore`). Currently defined but game state is managed locally in GameScreenComponent.

### Styling

- Angular Material 19 (azure-blue prebuilt theme) with custom Material Design 3 theme in `theme.css`
- Primary color: `#654bb7` (purple), background: `#6c1a54`
- Font: Inter (body), Roboto (Material), Material Icons
- All component styles use SCSS

### SSR

Express-based SSR via `src/server.ts` using `@angular/ssr/node`. Prerendering is disabled in angular.json (`"prerender": false`) to avoid route extraction issues.
