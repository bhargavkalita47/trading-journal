# TradeLedger Pro India

A browser-based intraday trading journal and paper-trading simulator built with React and TypeScript.

Track long and short positions, capital allocation, estimated trading charges and an equity curve.

## Features

- Create, edit and close simulated trades.
- Size positions by amount or percentage of available capital.
- Track total, available and committed capital.
- Record simulated fund additions.
- Calculate gross and net profit/loss using the project's charge model.
- View a dashboard, equity curve and trade table.
- Retain records in the current browser using localStorage.

## Run locally

Use a Node.js version supported by the Vite version in package-lock.json.

```sh
git clone https://github.com/bhargavkalita47/trading-journal.git
cd trading-journal
npm ci
npm run dev
```

Open http://localhost:3000. The current journal workflow runs in the browser and does not require a Gemini API key. The repository retains AI Studio scaffolding that should be reviewed before adding AI features.

## Build and type-check

```sh
npm run lint
npm run build
npm run preview
```

The lint command runs TypeScript's type checker. These commands were not executed as part of this documentation review; no passing test or deployment result is claimed.

## Source layout

| Path | Responsibility |
| --- | --- |
| src/App.tsx | Journal state, persistence and application layout |
| src/lib/ledger.ts | Capital, position sizing and profit/loss calculations |
| src/lib/utils.ts | Charge calculations and helpers |
| src/components/Dashboard.tsx | Capital summary |
| src/components/TradeTable.tsx | Trade entry and editing |
| src/components/Analytics.tsx | Equity visualization |

**Stack:** React, TypeScript, Vite, Tailwind CSS and Recharts.

## Current scope

This is a local simulation and journal. There is no broker connection, live execution, authentication, backend database or cross-device sync. Data can be lost when browser storage is cleared; Reset removes the local journal.

India-specific charge formulas are implementation assumptions, not verified current broker pricing or tax guidance. Capital accounting needs dedicated tests before consequential use.

## Next improvements

- Unit tests for position sizing, charges and capital accounting.
- Data import/export and validation of saved records.
- Review unused starter dependencies and API-key scaffolding.
- Publish a demo and add screenshots of the main workflow.
