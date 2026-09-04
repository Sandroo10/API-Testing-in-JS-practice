# API Automation with Cucumber.js

A CV-ready, black-box API automation framework for the public [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html). You will build the tests yourself, one small scenario at a time. The finished project will demonstrate BDD, CRUD, authentication, negative testing, JSON-schema validation, data-driven testing, reusable HTTP code, hooks, environment configuration, tags, reporting, and CI readiness.

## Why this stack

- **Cucumber.js** is the scenario runner. Its Gherkin `Given / When / Then` style makes business intent readable to non-technical people.
- **Axios** sends HTTP requests to a public API as a separate black-box system. **SuperTest** is excellent when you can import an Express app/server from the same repository; that is not this project, so Axios is more natural.
- **Chai `expect`** gives readable assertions such as `expect(response.status).to.equal(200)`.
- **AJV + ajv-formats** validate JSON response shapes, a lightweight contract-style check.
- **dotenv** keeps the base URL and future credentials out of source code.
- **ESLint + Prettier** keep code consistent and catch common mistakes.

Vitest is deliberately not the main runner: Cucumber already owns scenario execution, and adding Vitest for API scenarios would create two competing runners. Later, Vitest can be added for small, isolated unit tests of utilities.

## API behavior to test

The live `GET /booking` endpoint was checked while this project was created and returned an array of `{ bookingid }` objects. Restful Booker documents token creation and booking CRUD. Use the API's documented contract in your assertions. Do not force “ideal REST” status codes if its actual behavior differs; record an observed semantic oddity in the test/README instead.

## Project map

| Path                                 | Purpose                                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                       | Dependencies and commands.                                                                                                   |
| `cucumber.cjs`                       | Tells Cucumber where features and support code live.                                                                         |
| `.env.example`                       | Safe template for local configuration.                                                                                       |
| `src/config/env.js`                  | Loads `BASE_URL`; defaults to the public demo API and checks URL validity.                                                   |
| `src/clients/apiClient.js`           | Reusable generic Axios `get/post/put/patch/delete` wrappers. It returns non-2xx responses so negative tests can assert them. |
| `src/helpers/responseValidator.js`   | AJV schema validator returning `valid` and readable errors.                                                                  |
| `src/helpers/testData.js`            | Timestamp-suffixed name helper for resources you create.                                                                     |
| `src/schemas/booking.schema.json`    | Starter schema for a single booking response.                                                                                |
| `features/auth`, `features/bookings` | Your human-readable Gherkin specifications.                                                                                  |
| `features/step_definitions`          | Your JavaScript translations of Gherkin steps. Deliberately empty.                                                           |
| `features/support/world.js`          | Per-scenario shared state: response, token, created IDs, request body, context.                                              |
| `features/support/hooks.js`          | Safe setup/reset/cleanup location. It never guesses shared booking IDs.                                                      |
| `reports/`                           | Generated JSON output; ignored by Git.                                                                                       |

## Install and run

1. Open a terminal in this folder.
2. Copy `.env.example` to `.env`; keep its `BASE_URL` unless you intentionally use another environment.
3. Run `npm install`.
4. Run `npm test`. It should load the scaffold; no scenarios are implemented yet.
5. Use `npm run lint`, `npm run format:check`, or `npm run format` as you work.

Useful commands:

```text
npm test                    # all scenarios
npm run test:smoke          # @smoke only
npm run test:regression     # @regression only (add this tag to your complete suite)
npm run test:negative       # failure paths only
npm run test:report         # writes reports/cucumber-report.json
```

The JSON report is stable and minimal; later you can feed it to Allure or another maintained HTML reporter. Never commit `.env`; never put real credentials in it. If Restful Booker has published demo credentials, read them from its documentation and use them locally only.

### Terminal HTTP logging

Pino logs the final HTTP interaction for each scenario after it finishes. The terminal shows the scenario name, request method, endpoint, request headers/body, and response status/headers/body. Sensitive values such as passwords, tokens, cookies, and authorization headers are automatically replaced with `[REDACTED]`. Response bodies are formatted and capped at 30 lines, so request details remain visible.

For example, run `npm run test:smoke`. The current learning scenarios make one request each, so the output represents the full interaction. When you later build multi-request workflows (for example POST then GET), the final response is logged; we can extend the logger to keep a complete per-scenario interaction timeline when you reach those tests.

## Test roadmap — you implement these

For every request, think **POISED**: purpose, operation/method, inputs (route/query/body/headers), expected output, status, and data checks. Assert status, relevant headers/content type, and body—not status alone.

| #   | Scenario / tags                                            | Method and endpoint; send                                  | Assert                                                | Learning objective               |
| --- | ---------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| 1   | Successful token `@smoke @auth`                            | `POST /auth`; valid documented demo credentials            | success status and non-empty token                    | Auth request/body validation     |
| 2   | Invalid token `@negative @auth`                            | `POST /auth`; invalid credentials                          | no usable token; documented error behavior            | Safe negative assertions         |
| 3   | List booking IDs `@smoke @get`                             | `GET /booking`                                             | 200; JSON; array; entries have numeric `bookingid`    | Simplest smoke GET               |
| 4   | Read valid booking `@get @schema`                          | `GET /booking/{known-or-created-id}`                       | status, fields/types, AJV schema                      | Route parameter + contract shape |
| 5   | Read unknown booking `@negative @get`                      | `GET /booking/{unlikely-id}`                               | actual documented not-found behavior                  | Error body/status handling       |
| 6   | Name filter `@get @query`                                  | `GET /booking?firstname=...&lastname=...`                  | success and returned IDs can be investigated          | Query parameters                 |
| 7   | Date filter `@get @query`                                  | `GET /booking?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD`      | success and array-like result                         | Date query inputs                |
| 8   | Create booking `@smoke @post`                              | `POST /booking`; static valid body                         | created wrapper, generated ID, echoed data            | Request body and POST validation |
| 9   | Create then read `@post @persistence`                      | POST, save ID, then GET it                                 | persisted fields equal intended data                  | State and persistence check      |
| 10  | Data-driven creation `@post @data-driven`                  | Scenario Outline; at least 3 normal/boundary data sets     | each result accepted or rejected as documented        | Examples tables and boundaries   |
| 11  | Full update `@put @auth`                                   | `PUT /booking/{created-id}`; token + full replacement body | success then GET equals replacement                   | Auth headers + PUT               |
| 12  | Partial update `@patch @auth`                              | `PATCH /booking/{created-id}`; token + one/few fields      | changed fields changed; untouched fields remain       | PATCH integrity                  |
| 13  | Unauthorized update integrity `@negative @auth @integrity` | PUT/PATCH created ID without/invalid token                 | rejection, then GET proves original was not corrupted | Failure safety                   |
| 14  | Delete then read `@delete @auth`                           | DELETE created ID with token                               | documented delete response; follow-up GET not found   | Cleanup and lifecycle            |
| 15  | Unauthorized delete `@negative @delete @auth`              | DELETE created ID without valid token                      | rejection; follow-up GET proves it remains            | Authorization + integrity        |

Use static expected values where contracts need stable assertions. For resource identity on a shared public API, a timestamp suffix in a created first/last name is appropriate. That is **unique runtime test data**, not random contract expectation data: never make expected response rules random, especially in Pact-style contracts.

## How we will build this together

You write one scenario at a time. First write only the Gherkin; then we discuss each step and you write its step definitions; finally we refactor repeated code into helpers. I will explain every new keyword, JavaScript feature, and testing concept before you write it, then review/debug/advice—not take over the implementation.

Order: smoke GET → auth → POST → persistence → PUT/PATCH → negative/integrity checks → schema → tags/reporting → CI.

Keep scenarios isolated. Prefer creating your own records and storing their IDs in the World. Cleanup only an ID the current scenario created; a public shared API must never be cleaned by a guessed ID. If network instability occurs, diagnose it first—do not hide it with broad retries.

## Definition of Done for CV

- [ ] 12–15 passing, meaningful scenarios
- [ ] Reusable API client and useful helpers
- [ ] World and safe hooks used intentionally
- [ ] Auth, CRUD, query, negative, persistence and integrity coverage
- [ ] AJV schema validation
- [ ] Tags plus JSON/HTML-style reporting
- [ ] Clear README and clean lint/format checks
- [ ] No hardcoded secrets; deterministic data where possible
- [ ] GitHub Actions workflow added later

## Future upgrades (do not implement now)

- GitHub Actions CI
- Pact contract testing against a controllable provider
- Dockerized test environment
- Allure or another HTML reporting layer consuming Cucumber JSON
- Narrow retry strategy for proven network instability only
- Vitest utility-unit tests

## First learning task

Write **only Gherkin** for scenario 3: “GET all booking IDs returns a successful array-like collection,” tagged `@smoke @get`, in `features/bookings/bookings.feature`. Do not write step-definition JavaScript yet. Bring that Gherkin back and we will review it line by line.
