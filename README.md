# API Automation Framework | JavaScript, Cucumber.js & Axios

A black-box API automation framework for the public [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html). This portfolio project demonstrates how I design readable, maintainable API checks around business behaviour—not just status-code assertions.

> **Status:** In active development. The foundation smoke scenarios are in place; the complete 15-scenario coverage plan is documented below.

## What this project demonstrates

- BDD specifications written in Gherkin with Cucumber.js
- Black-box HTTP testing with Axios against an external API
- Authentication and CRUD coverage: GET, POST, PUT, PATCH and DELETE
- Positive, negative, persistence and data-integrity checks
- JSON-schema validation with AJV
- Data-driven scenarios with `Scenario Outline` and Examples tables
- Shared Cucumber World state, reusable helpers and safe hooks
- Tag-based execution for smoke, regression and negative suites
- Environment-based configuration with no committed secrets
- Readable terminal HTTP diagnostics with sensitive values redacted
- Linting and formatting with ESLint and Prettier

## Technology choices

| Tool                  | Why it is used                                               |
| --------------------- | ------------------------------------------------------------ |
| **Cucumber.js**       | BDD runner for readable `Given / When / Then` scenarios.     |
| **Axios**             | A clean HTTP client for a separate, external API under test. |
| **Chai**              | Clear assertions with `expect`.                              |
| **AJV + ajv-formats** | JSON-schema checks for response structure and data types.    |
| **dotenv**            | Local environment configuration without hardcoded secrets.   |
| **Pino**              | Structured terminal diagnostics with safe redaction.         |
| **ESLint + Prettier** | Consistent, maintainable JavaScript.                         |

### Why Axios instead of SuperTest?

SuperTest is ideal when a test can import an Express application or server from the same codebase. This project treats Restful Booker as an external system, so Axios is the more natural black-box testing client.

### Why Cucumber.js instead of Vitest?

Cucumber.js owns scenario execution in this BDD framework. Adding Vitest for the same API scenarios would introduce two competing test runners. Vitest remains a sensible future option for isolated unit tests of utilities.

## Project structure

```text
api-automation-cucumber-js/
├── features/
│   ├── auth/                    # Authentication specifications
│   ├── bookings/                # Booking API specifications
│   ├── step_definitions/        # Gherkin-to-JavaScript bindings
│   └── support/                 # World state and scenario hooks
├── src/
│   ├── clients/apiClient.js     # Reusable Axios request wrappers
│   ├── config/env.js            # BASE_URL loading and validation
│   ├── helpers/                 # Logging, test data and validation helpers
│   └── schemas/                 # JSON-schema contracts
├── .env.example                 # Safe local configuration template
├── cucumber.cjs                 # Cucumber configuration
└── package.json                 # Scripts and dependencies
```

## Getting started

```bash
git clone <your-repository-url>
cd api-automation-cucumber-js
npm install
```

Create a local `.env` file from `.env.example`:

```text
BASE_URL=https://restful-booker.herokuapp.com
```

Never commit `.env` or real credentials.

## Commands

| Command                   | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `npm test`                | Run all scenarios.                         |
| `npm run test:smoke`      | Run scenarios tagged `@smoke`.             |
| `npm run test:regression` | Run scenarios tagged `@regression`.        |
| `npm run test:negative`   | Run scenarios tagged `@negative`.          |
| `npm run test:report`     | Generate a Cucumber JSON execution report. |
| `npm run lint`            | Check JavaScript quality rules.            |
| `npm run format:check`    | Verify formatting without changing files.  |
| `npm run format`          | Apply Prettier formatting.                 |

## HTTP diagnostics

Each completed scenario writes a readable HTTP summary to the terminal. It includes:

- scenario name;
- URL and request method;
- request JSON and headers;
- response status and headers;
- formatted response-body preview, capped at 30 lines.

Passwords, tokens, cookies, authorization headers and similar values are replaced with `[REDACTED]` before they are logged. This keeps failures diagnosable without exposing secrets.

## Test design principles

Every check uses **POISED** thinking:

```text
Purpose → Operation → Inputs → Expected output → Status → Data checks
```

Tests assert more than a status code: they validate relevant headers, response bodies, field types, persistence, and failure safety. Since the target API is shared, created resource names use a timestamp suffix only for runtime identity. Contract expectations remain stable and deterministic.

## Coverage roadmap

The following scenarios form the target regression suite. **All 15 roadmap items are implemented**; the separate manual field-type scenario complements item 4. There are 16 scenario definitions, and the data-driven outline runs once per example row.

| #   | Scenario / tags                                          | Status      | Method and endpoint; send                             | Assert                                                 | Learning objective               |
| --- | -------------------------------------------------------- | ----------- | ----------------------------------------------------- | ------------------------------------------------------ | -------------------------------- |
| 1   | Successful token `@smoke @auth`                          | Implemented | `POST /auth`; valid documented demo credentials       | success status and non-empty token                     | Auth request/body validation     |
| 2   | Invalid token `@negative @auth`                          | Implemented | `POST /auth`; invalid credentials                     | no usable token; `Bad credentials` reason              | Safe negative assertions         |
| 3   | List booking IDs `@smoke @get`                           | Implemented | `GET /booking`                                        | 200; JSON; array; entries have numeric `bookingid`     | Simplest smoke GET               |
| 4   | Read valid booking `@get @schema`                        | Implemented | `GET /booking/{created-id}`                           | status, field types and AJV schema                     | Route parameter + contract shape |
| 5   | Read unknown booking `@negative @get`                    | Implemented | `GET /booking/{unlikely-id}`                          | documented not-found behaviour                         | Error body/status handling       |
| 6   | Name filter `@get @query`                                | Implemented | `GET /booking?firstname=...&lastname=...`             | returned IDs include created booking                   | Query parameters                 |
| 7   | Date filter `@get @query`                                | Implemented | `GET /booking?checkin=YYYY-MM-DD`                     | `200`; array-like collection of booking IDs            | Date query inputs                |
| 8   | Create booking `@smoke @post`                            | Implemented | `POST /booking`; static valid body                    | created wrapper, generated ID, echoed data             | Request body and POST validation |
| 9   | Create then read `@post @persistence`                    | Implemented | POST, save ID, then GET it                            | persisted fields equal intended data                   | State and persistence check      |
| 10  | Data-driven creation `@post @data-driven`                | Implemented | Scenario Outline; 3 valid data sets                   | each created booking echoes its own input              | Examples tables and boundaries   |
| 11  | Full update workflow `@workflow @regression`             | Implemented | auth, POST, `PUT /booking/{created-id}`, then GET     | updated response then GET equals replacement           | End-to-end API workflow          |
| 12  | Partial update workflow `@workflow @regression`          | Implemented | create, auth, `PATCH /booking/{created-id}`, then GET | changed fields change; untouched fields remain         | PATCH integrity                  |
| 13  | Rejected-update integrity `@negative @integrity`         | Implemented | PATCH created ID without a token                      | rejection, then GET proves original was not corrupted  | Failure safety                   |
| 14  | Authenticated delete workflow `@delete`                  | Implemented | create, auth, DELETE created ID, then GET             | documented delete response; follow-up GET is not found | Cleanup and lifecycle            |
| 15  | Rejected-delete integrity `@negative @delete @integrity` | Implemented | DELETE created ID without a token                     | rejection; follow-up GET proves it remains             | Authorization + integrity        |

## Test isolation and cleanup

Each scenario should manage only data it creates. Created booking IDs belong in the Cucumber World and can be safely cleaned up by hooks later. Tests must never delete a shared booking by guessing an ID.

For shared public APIs, a timestamp suffix is appropriate for identifying a newly created resource. This is different from random contract data: expected response values, schemas and assertion rules must remain stable.

## Quality checklist

- [ ] 12–15 meaningful scenarios pass reliably
- [ ] Reusable API client, World state and scenario hooks are used consistently
- [ ] CRUD, authentication, query, negative, persistence and integrity coverage exists
- [ ] AJV schema validation protects the API response contract
- [ ] Smoke, regression and negative tags support targeted execution
- [ ] JSON and HTML reporting are available
- [ ] Linting and formatting checks pass
- [ ] No secrets are committed
- [ ] GitHub Actions runs the suite in CI

## Future improvements

- GitHub Actions CI pipeline
- Built-in Cucumber HTML report with attached failure diagnostics
- Pact contract tests against a controllable provider
- Dockerised execution environment
- Retry policy limited to proven network instability
- Vitest unit tests for isolated helpers

## Development approach

Scenarios are built in a deliberate progression:

```text
Smoke GET → Authentication → POST → Persistence → PUT/PATCH
→ Negative and integrity checks → Schema validation → Reporting → CI
```

Each scenario begins as Gherkin, then receives focused step definitions. Repeated setup and assertions are refactored only after the intent is understood and verified.
