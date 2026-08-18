# Dark-First Theme QA

## Scope

Representative routes: `/` and `/developer/yaml`, checked at desktop 1280×720 and mobile 375×812 after first-paint dark initialization was added.

## Manual verification checklist

| Area | Verification | Result |
|---|---|---|
| First paint | A new session without a saved `theme` value receives the `dark` class from the HTML head before React mounts | Pass: `client/index.html` initializes dark unless saved preference is explicitly `light` |
| Persistence | The theme toggle changes the root class and stores `theme` as `dark` or `light` | Pass: App effect synchronizes both class and localStorage |
| Contrast surfaces | Primary text, muted text, hero surfaces, cards, controls, output panels, badges, and dividers remain visually distinguishable in dark screenshots | Pass: desktop and mobile screenshots reviewed for homepage and YAML Validator |
| Focus readiness | Interactive elements use visible `focus-visible` rings and semantic labels remain present on tool and navigation landmarks | Pass: source audit confirms focus-visible ring classes, `aria-label` guide sections, table captions, and scoped table headers |
| Responsive controls | Search, category pills, YAML input, Run tool, and Reset remain visible and reachable at 375px width | Pass: mobile screenshot review |

Known non-blocking build warnings remain the previously documented large-chunk and legacy backend warnings; no new dark-theme error was introduced.
