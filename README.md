# Playwright BDD Test Automation Framework

[![Playwright Tests](https://github.com/ozgurertop1/Playwright_framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/ozgurertop1/Playwright_framework/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure-live%20report-orange)](https://ozgurertop1.github.io/Playwright_framework/)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33)

A production-style end-to-end test framework built with **Playwright**, **TypeScript** and **Cucumber (BDD)**.
It tests a real e-commerce demo site ([automationexercise.com](https://automationexercise.com)) through both its **UI** and its **REST API**.

The key idea: **UI tests never waste time on setup through the UI.** Test accounts are created and deleted through the API, so each UI scenario only exercises the behaviour it is actually testing. The result is faster, more stable and fully isolated tests.

📊 **[Latest Allure report →](https://ozgurertop1.github.io/Playwright_framework/)** (published by CI on every push to `main`)

---

## Highlights

| | |
|---|---|
| **API-driven test setup** | A `testUser` fixture creates a fresh account via the API before a scenario and deletes it afterwards. No shared accounts, no leftover data, safe to run in parallel. |
| **UI ⇄ API consistency checks** | Search results shown in the browser are compared with what the search API returns. |
| **BDD with Gherkin** | Readable feature files for the whole team, compiled into native Playwright tests with [playwright-bdd](https://github.com/vitalets/playwright-bdd) (parallelism, fixtures, traces all still work). |
| **Standalone API test suite** | Contract checks, negative cases and a full account lifecycle (create → verify → read → delete). |
| **Page Object Model** | `BasePage` + reusable `Header` component + a lazy `PageManager`, all injected through fixtures. |
| **Resilient by design** | Transient 429/5xx responses are retried with back-off (API calls and navigation only, never real assertion failures). Ads/trackers are blocked. Failures caused by the target server are automatically tagged as `infrastructure` in the report. |
| **Multi-environment** | `local`, `staging`, `production`, `custom` presets, all overridable with env vars. |
| **CI/CD** | GitHub Actions on every push/PR plus a daily scheduled run. The Allure report is published to GitHub Pages. |

## Tech stack

Playwright · TypeScript (strict) · Cucumber / Gherkin via playwright-bdd · Allure · GitHub Actions

## Project structure

```
├── api/                    # Typed REST API clients
│   ├── BaseApiClient.ts    #   request helpers, JSON parsing, transient-error retry
│   ├── UserApi.ts
│   ├── ProductApi.ts
│   └── types.ts
├── config/environments.ts  # Environment presets (ENV=local|staging|production|custom)
├── features/               # Gherkin scenarios (auth, cart, products, smoke)
├── fixtures/
│   ├── apiFixtures.ts      # API client fixtures (shared by API + UI tests)
│   └── index.ts            # BDD fixtures: pageManager, testUser, ad blocking, failure triage
├── pages/                  # Page Objects
│   ├── components/Header.ts
│   ├── BasePage.ts
│   └── ...Page.ts / PageManager.ts
├── step-definitions/       # Step implementations, grouped by feature
├── test-data/              # Static test data (JSON)
├── tests/api/              # Pure API tests
├── utils/                  # Data factory, retry helper, wait helpers
└── playwright.config.ts    # Projects: api, chromium, firefox
```

## How API-driven setup works

```gherkin
Scenario: User adds multiple products to the cart
  Given a logged-in user whose account was created via the API
  ...
```

```ts
// fixtures/index.ts
testUser: async ({ userApi }, use) => {
  const user = buildUser();                     // unique email per test
  const created = await userApi.createAccount(user);
  expect(created.body.responseCode).toBe(201);  // fail fast if setup breaks

  await use(user);                              // the scenario runs here

  await userApi.deleteAccount(user.email, user.password); // always cleaned up
},
```

Registering through the UI form would take ~10 extra seconds per scenario and make every cart/login test depend on the signup page. Here, one API call does it in well under a second.

## Getting started

**Requirements:** Node.js 18+ (Java 11+ only if you want to generate the Allure report locally)

```bash
npm ci
npx playwright install chromium firefox
npm test
```

### Scripts

| Command | What it runs |
|---|---|
| `npm test` | API tests + all BDD scenarios on Chromium |
| `npm run test:api` | API tests only |
| `npm run test:e2e` | BDD scenarios on Chromium |
| `npm run test:smoke` | Scenarios tagged `@smoke` |
| `npm run test:cross-browser` | BDD scenarios on Chromium + Firefox |
| `npm run test:headed` / `test:debug` / `test:ui` | Visual / step-by-step debugging |
| `npm run test:staging` | Same suite against the `staging` preset (works on Windows, macOS and Linux) |
| `npm run report:html` | Open the Playwright HTML report |
| `npm run report:allure` | Generate and open the Allure report |
| `npm run typecheck` | `tsc --noEmit` |

### Configuration

Copy `.env.example` → `.env`, or pass variables inline:

| Variable | Purpose |
|---|---|
| `ENV` | `local` (default), `staging`, `production`, `custom` |
| `BASE_URL` | Override the UI base URL |
| `API_BASE_URL` | Override the API base URL (defaults to `${BASE_URL}/api`) |
| `TIMEOUT`, `RETRIES` | Used by the `custom` preset |

## Test coverage

| Area | Type | Scenarios |
|---|---|---|
| Smoke | UI | Homepage renders navigation, slider and products |
| Login | UI + API setup | Successful login, logout, wrong password, unknown accounts (data-driven) |
| Cart | UI + API setup | Add multiple products, remove a product |
| Search | UI ⇄ API | UI results equal API results for several terms |
| Products API | API | Catalogue shape, unique ids, search filtering, brands consistency, 400/405 handling |
| User API | API | Full lifecycle, duplicate email, unknown user, missing parameters |

## Adding a test

1. Write the scenario in `features/<area>/<name>.feature`.
2. Implement any new steps in `step-definitions/<area>/` using `Given/When/Then` from `step-definitions/bdd.ts`.
3. Add or extend a page object in `pages/` and expose it via `PageManager`.
4. Run `npm run test:e2e`. `bddgen` regenerates the specs automatically.

## A note on the target site

automationexercise.com is a free public practice site and occasionally returns `503 queue full` or Cloudflare `52x` errors under load. The framework retries those transient responses, keeps parallelism modest, and tags any remaining server-side failure as `infrastructure`, so real defects remain easy to spot.

---

**Author:** Özgür Ertop, QA Automation Engineer (Playwright, Selenium/Java, Appium, API testing)
