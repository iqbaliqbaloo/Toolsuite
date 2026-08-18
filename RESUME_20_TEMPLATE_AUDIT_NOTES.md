# Resume/CV 20-Template Audit Notes

## Inventory

The shared core defines exactly 20 templates: Classic, Modern, Minimal, Creative, Executive, Tech, Elegant, Compact, Bold, Academic, Timeline, Sidebar Pro, Gradient, Two Column, Centered, Slate, Cosmic, Sharp, Nova, and Boxed. The render harness mounted every template with sparse data, populated remote-job data, and ATS mode without render-time exceptions.

## Verified shared risks

The renderer contains fixed A4 assumptions (`minHeight: 1122px`) and uses a single-page export mode by default. Long resumes can therefore be visually cropped or forced into an unreadable one-page PDF. The export implementation captures the rendered DOM with html2canvas and places the capture into a full A4 page; this is a rasterized image PDF rather than selectable native text and may reduce accessibility/searchability.

The shared ContactLine and many templates render email, phone, location, LinkedIn, GitHub, and portfolio values as plain text joined by separators. They are not consistently emitted as clickable links, which is a usability weakness for remote recruiting. URL validation normalizes `https://` for scoring only; the saved/rendered value is not normalized for output.

Many templates use multi-column grids or sidebars. These create visual differentiation but carry ATS and narrow-width risks because reading order and column scanning differ across systems. The shared ATS mode only changes some visual colors/branches; it does not guarantee a single-column semantic structure or validate extracted text order.

The Resume Builder loads Google Fonts dynamically. Offline/local use can fall back to system fonts, changing line wrapping and causing template-specific page overflow differences between preview and export. LocalStorage persistence exists, but there is no demonstrated cross-device sync or backup; browser clearing or private browsing can lose resumes.

The backend source currently reports missing `express-rate-limit` and `multer` dependencies plus TypeScript warnings. The frontend production build succeeds, and the all-template render harness passes for sparse/populated/ATS data.

## Template-level initial classification

Classic, Modern, Minimal, Executive, Tech, Academic, Sharp, and Boxed are the safest starting points for local/traditional or ATS-sensitive roles because they are primarily single-column or restrained. Creative, Bold, Elegant, Timeline, Sidebar Pro, Gradient, Two Column, Centered, Cosmic, and Nova are more visually expressive and better suited to design, product, marketing, or portfolio-forward remote roles, but carry higher ATS/order/contrast risk. Compact is space-efficient but more likely to become dense. Slate has strong structure but can become visually heavy. The classification is a risk-based recommendation, not a claim that every template has a unique runtime bug.

## Template-specific audit focus

- Classic: strong baseline; plain-text contact line and one-page crop remain concerns.
- Modern: clean and remote-friendly; accent/header contrast and dense contact line need checking.
- Minimal: low visual noise and ATS-safe; can under-signal seniority and create sparse-looking pages.
- Creative: expressive color/shape language; higher ATS and print-contrast risk.
- Executive: traditional hierarchy; may become dense when many sections are populated.
- Tech: good for engineering/remote roles; monospace or dark styling can reduce ATS/readability if not in ATS mode.
- Elegant: serif/editorial styling; attractive for brand/creative roles but less conservative for ATS and technical roles.
- Compact: space-saving; highest density risk and small-text/readability risk.
- Bold: strong visual impact; accent blocks and hierarchy may compete with ATS extraction.
- Academic: appropriate for academic/local institutional roles; can feel overlong for remote product applications.
- Timeline: visual chronology; timeline graphics/columns can be harder for ATS and less robust with long dates.
- Sidebar Pro: split layout; strongest ATS reading-order and narrow-width risk.
- Gradient: high visual energy; gradients and dark surfaces need print/contrast verification.
- Two Column: efficient scanning; two-column order and mobile/ATS risks.
- Centered: portfolio/editorial feel; weaker recruiter scan density and remote-product ATS conservatism.
- Slate: restrained dark professional style; print conversion and color flattening need checking.
- Cosmic: highly expressive; strongest risk of nontraditional hierarchy and print/ATS mismatch.
- Sharp: crisp technical feel; aggressive dividers/compact spacing may feel dense.
- Nova: modern branded look; accent contrast and long-content overflow need checking.
- Boxed: modular visual blocks; many borders can create visual noise and ATS segmentation risk.

## Confirmed automated evidence

`render-resume-templates.tsx` rendered all 20 templates in sparse, populated, and ATS modes without exceptions. The frontend production build and existing Vitest suite pass. This does not replace PDF pixel-diff, browser export, screen-reader, or ATS parser testing.
