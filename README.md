# ToolSuite

ToolSuite is a modern, browser-first productivity platform with **30 focused tools** for everyday work, finance estimates, developer workflows, webmaster tasks, generators, and visual utilities. The project combines a warm, accessible interface with a dark-first default theme, responsive layouts, route-aware SEO, transparent calculations, downloadable outputs, and contextual educational content.

> ToolSuite is designed to make common tasks easier to start and easier to understand. It does not claim that estimates replace professional financial, tax, legal, medical, security, or infrastructure advice.

## Highlights

| Capability | Description |
|---|---|
| Exact catalog | 30 unique tools with stable IDs, names, categories, and public routes |
| Dark-first UI | New visitors start in dark mode before React renders; light mode remains available through the theme toggle |
| SEO foundation | Route-aware metadata, canonical URLs, Open Graph, Twitter URL metadata, JSON-LD, robots.txt, and an exact-30 sitemap |
| Information gain | Tool-specific explanations, examples, methodology, limitations, FAQs, related tools, and comparison tables |
| Privacy-oriented workflows | Browser-local tools clearly identify when no upload is required; provider-dependent tools disclose their data source or estimate scope |
| ATS-first resumes | Resume Builder supports 20 templates, demo data, ATS-oriented output, multi-page handling, and PDF export |
| Validation | Vitest coverage, linting, production builds, responsive previews, exact-catalog assertions, and content-coverage tests |

## Tool catalog

### Generator tools

| Tool | Route | Primary use |
|---|---|---|
| QR Code Generator | `/generator/qr` | Create downloadable QR codes for links, contacts, events, and campaigns |
| Secure Password Generator | `/generator/password` | Generate strong passwords locally with character controls |
| Resume Builder | `/generator/resume` | Build ATS-first resumes with templates, preview, demo data, and PDF export |
| Invoice Generator | `/generator/invoice` | Create invoices with line items, totals, tax, and PDF-ready output |
| UUID Generator | `/generator/uuid` | Generate UUIDs in bulk for APIs, databases, and tests |

### Finance and calculator tools

| Tool | Route | Primary use |
|---|---|---|
| Age Calculator | `/calculator/age` | Calculate exact date differences and age milestones |
| BMI Calculator | `/calculator/bmi` | Estimate BMI with transparent inputs and assumptions |
| Currency Converter | `/calculator/currency` | Convert currencies using live rates when available |
| Compound Interest Calculator | `/calculator/compound-interest` | Model recurring contributions, compounding, and long-term growth |
| Crypto ROI & Profit Calculator | `/calculator/crypto-roi` | Estimate cost basis, fees, profit/loss, and ROI |
| Mortgage Amortization Calculator | `/calculator/mortgage` | Estimate payments, interest, principal, and extra-payment effects |
| Salary After Tax Calculator | `/calculator/salary-after-tax` | Estimate take-home pay from supplied assumptions |
| Freelance Hourly Rate Calculator | `/calculator/freelance-rate` | Translate goals, costs, and billable capacity into a target rate |
| Investment Return Calculator | `/calculator/investment-return` | Compare start/end values, fees, ROI, and annualized return |
| Percentage Calculator | `/calculator/percentage` | Calculate shares, changes, and differences between values |

### Developer and webmaster tools

| Tool | Route | Primary use |
|---|---|---|
| XML Sitemap Generator | `/developer/sitemap` | Convert absolute URLs into XML sitemap output |
| Htaccess Redirect Code Generator | `/developer/htaccess` | Create Apache redirect rules for migrations and canonical changes |
| Robots.txt Generator | `/developer/robots` | Build crawler directives and sitemap references |
| Domain Authority/Age Checker | `/developer/domain-age` | Check public RDAP registration age and status; no authority score is fabricated |
| Website Social Share Link Generator | `/developer/social-share` | Generate share links for Facebook, X, and LinkedIn |
| JSON to CSV Converter | `/developer/json-csv` | Convert objects or arrays of objects into escaped CSV |
| Regex Cheat Sheet & Tester | `/developer/regex` | Test regular expressions against sample text |
| SQL Query Formatter | `/developer/sql` | Format dense SQL for review and debugging |
| YAML Validator | `/developer/yaml` | Parse YAML safely and report syntax errors without executing tags |
| Crontab Expression Generator | `/developer/crontab` | Create five-field cron expressions with plain-language summaries |
| Time Zone Converter | `/developer/timezone` | Convert date/time values between IANA time zones |
| CSS Flexbox Generator | `/developer/flexbox` | Configure flex layout properties and copy generated CSS |
| UTM Link Builder | `/developer/utm` | Build campaign URLs with consistent tracking parameters |
| Subnet Calculator | `/developer/subnet` | Calculate IPv4 network ranges, hosts, broadcast, and CIDR details |

### Visual tools

| Tool | Route | Primary use |
|---|---|---|
| SVG to PNG Converter | `/image/svg-to-png` | Render SVG markup locally and prepare PNG output |

## Getting started

### Requirements

Use Node.js 22 or a compatible current Node.js release, pnpm, and a MySQL-compatible database when running the full-stack server features. The repository is configured as an ES module project.

### Installation

```bash
pnpm install
```

Create the required environment configuration through your deployment or workspace secret manager. Do not commit `.env` files or credentials. The application template expects built-in Manus environment values for authentication, database access, storage, and optional integrations.

### Development

```bash
pnpm dev
```

The development server starts the managed full-stack application. The server port is provided by the runtime; application code should not hardcode a deployment port.

### Validation commands

```bash
pnpm test --run
pnpm lint
pnpm build
pnpm check
```

`pnpm test --run` executes the Vitest suite. `pnpm lint` runs the repository’s scoped ESLint configuration. `pnpm build` creates the Vite frontend bundle and the server bundle. `pnpm check` runs TypeScript checking; the legacy copied backend under `server/original-backend` may retain separately documented dependency and strictness warnings.

## Project structure

```text
client/
  index.html                         HTML shell and pre-paint theme initialization
  src/
    main.tsx                         React entry point
    original/App.tsx                 Route shell, theme, navigation, and SEO sync
    original/constants/tools.ts      Frozen exact-30 catalog
    original/components/             Home, navigation, and shared UI
    original/features/               Tool workbenches and shared tool-page renderer
    original/seo/                    Metadata, guides, FAQs, tables, and schema helpers
    index.css                        Global design tokens, dark/light themes, and motion rules
server/
  _core/                             Managed runtime integrations
  routers.ts                         Typed tRPC procedures
  db.ts                              Database helpers
  tools.test.ts                      Server-side utility tests
drizzle/                             Database schema and migrations
shared/                              Shared constants and types
SEO_IMPLEMENTATION.md                Product-wide SEO implementation notes
TOOL_EDUCATION_CONTENT.md             Tool education content model and limitations
DARK_THEME_QA.md                     Dark-first responsive QA notes
TOOLS_30_SPEC.md                     Frozen catalog specification
TOOLS_30_RESEARCH.md                 Research and implementation notes
```

## SEO and deployment

The canonical production origin is currently configured as [`https://toolsuite-bice.vercel.app`](https://toolsuite-bice.vercel.app). The following files and runtime metadata use that origin:

| SEO surface | Location or behavior |
|---|---|
| Static fallback title and description | `client/index.html` |
| Route-aware title and description | `client/src/original/seo/seo.ts` |
| Canonical links and Open Graph/Twitter URLs | Applied when the route changes |
| JSON-LD | Organization, WebSite, BreadcrumbList, SoftwareApplication, and authored FAQPage data |
| Robots directives | `client/public/robots.txt` |
| Sitemap | `client/public/sitemap.xml`, covering the home page plus 30 tool routes |

After deploying the current `main` branch, verify that the live deployment contains the latest exact-30 catalog. Then submit `https://toolsuite-bice.vercel.app/sitemap.xml` to Google Search Console after the domain is verified. A sitemap supports discovery; it does not guarantee indexing or rankings.

## Theme and accessibility

ToolSuite starts in dark mode on a first visit by applying the dark class in the HTML head before the React application mounts. If a visitor has previously selected light or dark mode, that saved preference is restored. The theme toggle updates the root class, local storage, and browser theme-color metadata.

The interface uses semantic headings, labeled controls, visible focus-visible states, responsive layouts, reduced-motion support, readable contrast tokens, and semantic table captions and headers where comparison tables are used. The project’s QA notes document the representative desktop and mobile checks.

## Accuracy and provider limitations

ToolSuite distinguishes deterministic browser calculations from estimates and external lookups. Finance tools use the assumptions shown on each page and are not jurisdiction-specific financial or tax advice. Currency conversion depends on the availability and timestamp of the configured rate source. Salary and mortgage outputs are estimates rather than official statements.

The Domain Authority/Age Checker is intentionally limited to public RDAP registration age and status. It does not claim or fabricate a third-party SEO authority metric. Tools that require a future external provider should identify that dependency rather than present invented data.

The copied legacy backend remains documented as a separate follow-up area because some original upload, PDF, OCR, AI, and image-processing adapters require additional production dependencies or provider configuration. The active frontend shell and exact-30 utility workbench are validated independently.

## Contribution guidelines

Keep the catalog in `client/src/original/constants/tools.ts` as the source of truth. New public tools must have a unique ID and slug, a category, user-facing explanation, validated inputs, empty/loading/error/result states, feedback handling, relevant educational content, and tests. Do not add fabricated reviews, ratings, testimonials, authorship claims, usage metrics, or provider results.

When adding a tool, update the catalog, route handling, educational registry, SEO coverage tests, sitemap parity, and relevant documentation. Preserve existing tool logic when making presentation or content improvements. Use the shared components and design tokens instead of introducing isolated patterns.

## License

This project is distributed under the MIT License as declared in `package.json`.
