# AssetCheck — PPSR search PoC

A proof of concept for a **third-party PPSR search service**: customers search the Australian Personal Property Securities Register (PPSR) through us, and get security interests plus vehicle history (NEVDIS: vehicle details, written-off and stolen notifications) with every VIN search.

The government register stays the source of truth. Our backend calls it through AFSA's **B2G channel** behind a swappable gateway. Until B2G access is granted, a built-in mock gateway returns fictional data in the same shape, so the whole product can be built and demoed now.

> "AssetCheck" is a placeholder name — change it in `web/src/lib/brand.ts`. A third-party service must not present itself as the government register, so the UI states its independence from AFSA wherever results appear.

| Layer | Stack |
| --- | --- |
| Web (`web/`) | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 + shadcn/ui, TanStack Query, React Hook Form + Zod, Zustand |
| API client | Orval, generated from the API's Swagger document into typed TanStack Query hooks |
| API (`api/`) | NestJS 12, TypeORM, class-validator, Swagger (OpenAPI), JWT auth |
| Database | PostgreSQL — our customers and their search records (embedded for local dev, or any PostgreSQL via `DATABASE_URL`) |
| Lint / format | Biome (one config at the repo root for both apps) |

## Architecture

```
Customer ─► Next.js ─► NestJS API ─► PpsrGateway ─┬─► MockPpsrGateway  (fixtures, default)
                          │                       └─► B2gPpsrGateway   (AFSA B2G, SOAP — to build)
                          └─► PostgreSQL: accounts, searches (result snapshot, fee, references)
```

- **`PpsrGateway`** (`api/src/ppsr/ppsr-gateway.ts`) is the only place that knows about the register. Choose the implementation with `PPSR_GATEWAY=mock|b2g`.
- **A search is only recorded (and charged) after the register answers.** The response is stored as returned, because a search result reflects the register at the time of search. Reopening a past search never re-queries (or re-charges).
- Each search carries the **PPSR search number** (from the register), our **order reference**, an optional **customer reference** (e.g. stock or deal number), the **fee**, and its **data source** (results from the mock are clearly marked as test data).

## Run it

Requires Node 24+ and pnpm 11.

```bash
pnpm install
```

Then, in three terminals:

```bash
pnpm db:start
```

```bash
pnpm dev:api
```

```bash
pnpm dev:web
```

- Web: http://localhost:3000 — public landing page; log in with **demo@ppsr.test / Password123!** (the app is at `/dashboard`)
- API: http://localhost:4000/api · Swagger UI: http://localhost:4000/api/docs

`pnpm db:start` runs a real PostgreSQL 18 server from npm (no Docker or system install), with data in `.pgdata/`. Delete that folder to start from scratch; the API recreates the schema and seeds a demo customer with a few past searches.

### Test data (mock gateway)

| Try | Expect |
| --- | --- |
| VIN `6T1BF3FK40X012345` | 1 security interest (consumer, grantor withheld), vehicle clear |
| VIN `MR0FZ22G301234567` | 2 security interests, vehicle clear |
| VIN `KMHCT41DAEU123456` | No interests (the old one was removed), **written off** |
| VIN `WVWZZZ1KZ6W654321` | No interests, **reported stolen** |
| ACN `604512378` (or any ABN ending in it) | 3 registrations against Northside Civil Contracting |
| Registration number `202307190311045` | The excavator registration |

## Configuration (`api/.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET` | Signing key for customer sessions (placeholder in `.env.example`) |
| `PPSR_GATEWAY` | `mock` (default) or `b2g` |
| `PPSR_B2G_ENDPOINT` | AFSA B2G endpoint, once issued |
| `SEARCH_FEE_CENTS` | Price charged per search, incl. GST (placeholder: 400) |

## Connecting to the real PPSR (next steps)

1. **Request B2G Discovery access** from AFSA: https://www.ppsr.gov.au/request-b2g-discovery-access. Discovery is AFSA's test environment with fictional data.
2. **Implement `B2gPpsrGateway`** (`api/src/ppsr/b2g/b2g-ppsr.gateway.ts`). It is stubbed with the build steps listed. B2G is SOAP over TLS, defined by WSDL. Generate clients from the current WSDL version, then map the search requests and responses. That includes decoding NEVDIS written-off codes, which arrive unformatted. Also implement the mandatory Ping and Change B2G Password operations.
3. **Confirm commercial terms with AFSA** (enquiries@ppsr.gov.au) before launch: production B2G account, per-search government fees, and any conditions on providing results to third parties.
4. **Official certificates:** decide whether customers receive the PPSR-issued search certificate (PDF), and add retrieval to the gateway if so.

## Project layout

```
api/src/ppsr/             PpsrGateway contract, mock (fixtures) and B2G stub, status endpoint
api/src/searches/         search orders: run via gateway, snapshot, fees, history, dashboard
api/src/auth/             customer accounts, JWT login, global auth guard
api/src/seed/             demo customer + sample searches (mock only)
api/openapi.json          written on every dev start; Orval's input
web/src/api/generated/    Orval output — do not edit
web/src/api/http.ts       axios instance + Orval mutator (auth header, 401 handling)
web/src/app/(marketing)/  public landing page: home, how it works, about, pricing
web/src/app/(auth)/       log in, create account
web/src/app/(portal)/     dashboard, new search, history, result (page.tsx → client screen.tsx)
web/src/components/       shell, search forms, result/certificate view, history table
web/src/lib/brand.ts      product name, landing pricing (placeholder figures), independence notice
docs/USER_GUIDE.md        end-user guide (Hinglish)
scripts/db.mjs            embedded PostgreSQL launcher
```

After changing an API controller or DTO, regenerate the web client:

```bash
pnpm api:generate
```

## Checks

```bash
pnpm lint
```

```bash
pnpm --filter web build
```

```bash
pnpm --filter api build
```

## Not production-ready by design

- The schema is synchronised from entities (`DB_SYNCHRONIZE=true`); use TypeORM migrations before deploying.
- Sessions use a token in `sessionStorage`; production should move to httpOnly cookies with refresh tokens.
- Fees are recorded but not collected: payments, invoicing and credit limits are out of scope.
- No rate limiting or abuse controls on searching yet; these are needed before paid, public traffic.
