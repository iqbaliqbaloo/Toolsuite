# ToolSuite End-to-End QA Audit — 2026-08-18

## Scope

The audit covered the exact 30-tool catalog, homepage navigation, category and quick-pick surfaces, search/filter controls, shared tool-card links, representative calculator/developer/generator/image routes, dark-first desktop and mobile rendering, direct-route availability, browser/runtime logs, typecheck, tests, lint, production build, sitemap parity, and stale migration artifacts.

## Confirmed defects and fixes

| Severity | Defect | Reproduction | Fix |
|---|---|---|---|
| High | Active shell imported `next/navigation` even though the shipped runtime is Vite | Load the active Vite client with the previous package state; the client graph depended on Next-only modules | Replaced the stale Next navigation hooks with browser-history navigation and `popstate` synchronization |
| High | CSS entry imported deleted `client/src/original/app/globals.css` | Start the dev server after the failed Next migration cleanup; Vite reported `Can't resolve './original/app/globals.css'` | Removed the stale import and kept the active token stylesheet in the Vite CSS entry |
| Medium | Exact-30 homepage metric claimed `30+` and `+5 coming soon` | Open the homepage statistics card | Changed the metric to `30` / `Exact catalog` |
| Medium | Tool cards used `href="#"`, weakening keyboard/deep-link behavior | Inspect or activate a featured, wide, or minimal tool card | Replaced placeholder hashes with each tool’s actual `tool.slug` while preserving SPA click handling |
| Medium | Root typecheck included archived `server/original-backend` and produced unrelated missing-dependency errors | Run the project typecheck | Excluded the archived, non-active backend from the root typecheck; installed the missing upload/rate-limit packages for preserved backend source hygiene |
| Low | Resume audit fixture omitted the required shared section labels | Run root typecheck | Passed `DEFAULT_SECTION_LABELS` to every audit template |
| Low | Password generator used iterable spread expressions that failed the project target check | Run root typecheck | Replaced spread iteration with `Array.from` in charset and SHA-1 helpers |
| Low | tRPC client transformer type did not match the inferred router contract | Run root typecheck | Preserved SuperJSON runtime behavior with a narrow client-side type cast |

## Validation evidence

The active project typecheck passed with zero errors. The Vitest suite passed. Lint passed. The production build passed. Sitemap parity remained 31 URLs: the homepage plus exactly 30 tools. No stale Next imports, deleted stylesheet imports, or hash-only tool-card links remained in the active client source. The managed server restarted successfully with no LSP or TypeScript errors.

Desktop and mobile homepage screenshots passed at 1280×720 and 375×812. Direct desktop route smoke tests passed for Age Calculator, Compound Interest Calculator, JSON to CSV Converter, Secure Password Generator, and SVG to PNG Converter. Shared breadcrumbs, H1s, inputs, output panels, Run/Generate actions, Reset actions, feedback controls, and education sections rendered on representative routes.

## Non-blocking observations

The production bundle reports a chunk-size warning for the main application bundle, with an optimization opportunity to split more tool code through manual chunks or additional route-level lazy loading. The browser console contains historical pre-fix log entries from before the dev-server restart; post-restart smoke tests produced no new application errors. The baseline-browser-mapping package reports stale compatibility data, which is a maintenance warning rather than a runtime failure.


## Interaction-level browser matrix

A Puppeteer-core matrix exercised 36 checks: the homepage, all 30 sitemap tool routes at desktop size, and five representative routes at mobile size. The final run reported 30 tool routes, no HTTP failures, no missing titles, no missing H1s, no horizontal overflow, no console errors, and no failed requests.

The matrix clicked the theme toggle and search control on the homepage, executed 28 available Run/Generate/Convert actions, activated 25 Reset controls, activated 25 Useful feedback controls, and triggered 7 result downloads. Specialized Resume and Invoice pages do not expose universal Run/Reset/feedback/download controls by design; their dedicated editor flows were route-rendered and included in the direct-route checks.

Two additional defects were found and fixed during interaction QA. The Currency Converter crashed in the browser with `ReferenceError: process is not defined`; its API helper now uses Vite-safe `import.meta.env.VITE_API_URL || '/api/v1'`. Full-screen Invoice and Resume routes lacked a route-level H1 because they bypass the shared tool header; they now include an accessible screen-reader H1 without changing the visual editor layout.
