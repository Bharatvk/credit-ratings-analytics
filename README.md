# Credit Ratings Analytics Application

Angular 20 + PrimeNG case-study project for a Manager, Software Engineering interview round.

## 1) What This Project Does

This application helps analysts:

- Discover issuers on a ratings dashboard.
- Review issuer details (rating, history, drivers, AI insight).
- Submit structured feedback through a 4-step form.

Main user flow:

`Dashboard -> Issuer Detail -> Feedback Form`

## 2) Tech Stack

- Angular 20 (standalone components, strict TypeScript)
- PrimeNG 20
- RxJS + Reactive Forms
- Angular Router + HttpClient
- SCSS
- Local mock backend (Node)

## 3) Architecture Summary

- Route-driven identity:
  - `/issuer/:id`
  - `/issuer/:id/feedback`
- `:id` route param is the source of truth.
- Lightweight shared state via `IssuerStore` (RxJS), no NgRx.
- Container/page components handle orchestration.
- Presentational components focus on UI.
- Shared UX states:
  - `LoadingState`
  - `EmptyState`
  - `ErrorState`

## 4) API Endpoints Used

- `GET /api/issuers`
- `GET /api/issuers/:id`
- `POST /api/feedback`

Proxy setup:

- `proxy.conf.json` maps `/api` -> `http://127.0.0.1:3001`

## 5) Prerequisites

- Node.js `20.19.5` (recommended)
- npm `10+`
- nvm (recommended for matching Node version)

## 6) Quick Start (Spoon-Fed)

From project root:

```bash
cd "credits-ratings-analytics"
nvm use 20.19.5
npm install
```

Start mock API in Terminal 1:

```bash
npm run start:api
```

Start Angular app in Terminal 2:

```bash
npm run start:web
```

Open in browser:

`http://127.0.0.1:4200`

## 7) Validation Commands

```bash
npx tsc -p tsconfig.app.json --noEmit
npx ngc -p tsconfig.app.json
```

## 8) Available Scripts

- `npm run start` - Angular dev server with proxy
- `npm run start:web` - same as above
- `npm run start:api` - mock backend server
- `npm run build` - Angular production build
- `npm run watch` - watch build
- `npm run test` - unit test runner (default Angular scaffold)

## 9) Project Structure (High Level)

- `src/app/features` - feature modules/pages (dashboard, detail, feedback)
- `src/app/core` - models, services, guards, interceptors, store
- `src/app/shared` - reusable shared UI components
- `mock-backend` - local API server
- `public/mock-api` - mock data files

## 10) Notes for Interviewers

- The project uses realistic API contracts and route-driven state correctness.
- Refresh/direct URL access works for issuer detail and feedback pages.
- Feedback form includes validation gating, submit states, and error handling.
- UI is responsive across desktop/tablet/mobile and includes accessibility baselines.

## 11) Troubleshooting

- If `nvm` is unavailable, install Node 20.19.5 directly and rerun `npm install`.
- If port `3001` is occupied, stop existing process or update backend/proxy ports together.
- If port `4200` is occupied, run Angular on a different port:

```bash
npm run start:web -- --port 4300
```

## 12) Publish This Repository Publicly (GitHub)

Inside this project folder:

```bash
git --git-dir=.git --work-tree=. add .
git --git-dir=.git --work-tree=. commit -m "Initial commit: Credit Ratings Analytics case study"
git --git-dir=.git --work-tree=. branch -M main
git --git-dir=.git --work-tree=. remote add origin <your-github-repo-url>
git --git-dir=.git --work-tree=. push -u origin main
```

After push, share:

`https://github.com/<username>/<repo-name>`
