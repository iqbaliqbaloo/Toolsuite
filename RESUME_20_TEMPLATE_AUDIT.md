# ToolSuite Resume/CV Builder: 20-Template Audit

## Executive conclusion

The Resume/CV Builder contains **exactly 20 templates**, and all 20 rendered successfully in automated checks with sparse data, populated remote-job data, and ATS mode. This means there is no template-level React render exception in the tested data paths. The main risks are not simple crashes; they are **shared export, ATS, URL, offline-font, pagination, and density problems** that affect several templates at once.

The highest-severity confirmed issue was pagination: the builder previously hardcoded one-page mode, which could crop or compress long resumes even when the content exceeded A4 height. That shared bug has now been corrected so the preview/export flow switches to multiple pages when measured content is taller than one A4 sheet. The production frontend build, existing Vitest suite, and all-template render harness pass after the fix.

## Verified shared deficiencies and bugs

| Severity | Area | Finding | Impact | Status |
|---|---|---|---|---|
| High | Pagination/export | `onePage` was hardcoded to `true`, while the renderer measures document height and contains multi-page export logic. Long resumes could be cropped or presented as “Fits 1 page” incorrectly. | Missing experience, projects, skills, or education in the final PDF. | **Fixed** by switching to dynamic one-page/multi-page behavior based on measured height. |
| High | PDF accessibility | Export captures the resume through `html2canvas` and inserts a PNG into jsPDF. The result is image-based rather than native selectable text. | ATS extraction, copy/paste, screen-reader access, and text search can be weaker than a native-text PDF. | Open follow-up. |
| Medium | Remote links | Contact and project URLs are commonly joined into plain text strings. They are not consistently rendered as clickable anchors. | Recruiters must manually copy URLs; remote portfolios and GitHub links are less usable. | Open follow-up. |
| Medium | URL normalization | `isRealLink()` normalizes a missing protocol for scoring, but the saved/rendered value is not consistently normalized for output. | A value such as `linkedin.com/in/name` may score as valid but may not behave as a clickable link. | Open follow-up. |
| Medium | ATS guarantee | ATS mode changes visual styling in many components but does not guarantee one-column semantic order, native text export, or compatibility with a specific ATS parser. | Two-column/sidebar/graphic templates can still be risky for automated parsing. | Open follow-up. |
| Medium | Offline/local fonts | Google Fonts are loaded dynamically. Offline use or blocked font requests can change line wrapping between preview and export. | Page breaks, density, and visual balance can change in local/offline use. | Open follow-up. |
| Medium | Local persistence | Resume data is stored in browser `localStorage`. Browser clearing, private browsing, quota limits, or device changes can remove access. | No cross-device recovery or reliable backup. | Open follow-up. |
| Medium | Backend quality gate | The preserved original backend still reports missing `express-rate-limit` and `multer` dependencies, plus TypeScript warnings. | Backend upload/rate-limit paths are not production-ready even though the frontend build succeeds. | Open follow-up. |
| Low | Bundle size | The Resume Builder chunk is approximately 792 kB before gzip and includes heavy export libraries. | Slow first load on mobile and slower route transitions. | Open follow-up. |

## Test evidence

The audit harness mounted all 20 templates with three data modes: sparse/empty sections, a populated resume with remote-job fields, and ATS mode. Every template returned successful markup in every mode. The output lengths varied substantially, which is expected because the templates use different visual systems and section blocks.

An internal browser gallery was also added temporarily at `/__audit/resume-templates` and captured with the long remote-job fixture, showing all 20 templates in one visual audit pass. The gallery confirms that all templates mount and that the main differences are density, columns, contrast, and visual hierarchy rather than render crashes. The audit still does not claim pixel-perfect PDF output: browser-generated PDF capture, screen-reader traversal, and real ATS parser testing remain separate production-hardening tasks.

## Template-by-template assessment

| Template | Primary strengths | Main deficiency or risk | Local/traditional suitability | Remote/digital suitability | Recommendation |
|---|---|---|---|---|---|
| Classic | Conventional hierarchy and restrained layout. | Contact data is plain text; can look generic when content is sparse. | **High** | **Medium** | Best default for conservative applications; add native links and stronger empty-state guidance. |
| Modern | Clean hierarchy with a contemporary header. | Contact line can become dense; color contrast depends on selected theme. | **High** | **High** | Strong general-purpose choice; test long URLs and long job titles. |
| Minimal | Low visual noise and good scanability. | Sparse resumes can look unfinished; weak visual emphasis for senior achievements. | **High** | **Medium** | Use with concise, achievement-heavy content; show a density warning when too empty. |
| Creative | Strong visual identity and differentiated styling. | More decorative hierarchy and color dependence can reduce ATS safety and print consistency. | **Low–Medium** | **High** for design/brand roles | Position as portfolio-forward; keep ATS mode conservative and test grayscale export. |
| Executive | Familiar professional structure and strong senior tone. | Dense content can create long blocks; limited visual differentiation for remote/product roles. | **High** | **Medium–High** | Good for management and operations; add clearer achievement callouts. |
| Tech | Appropriate for engineering and technical profiles. | Monospace/dark treatment can become small or visually heavy; ATS mode is essential. | **Medium–High** | **High** | Good for technical remote roles; validate font fallback and project URL output. |
| Elegant | Editorial typography and polished presentation. | Serif styling can feel less conservative for technical ATS workflows and may wrap differently offline. | **Medium** | **High** for creative/product roles | Use for design, writing, and brand applications; avoid for strict ATS submissions. |
| Compact | Efficient use of page space. | Highest density and small-text risk; long skills/projects can become difficult to scan. | **Medium** | **Medium–High** | Keep to one page with curated sections; enforce minimum readable sizes. |
| Bold | Strong visual emphasis and clear section presence. | Accent hierarchy can compete with content and may flatten poorly in print. | **Medium** | **High** | Good for marketing/product leadership; provide a print-safe preview warning. |
| Academic | Structured and information-rich. | Can become overlong for ordinary job applications and less focused for remote roles. | **High** for academic/local institutions | **Medium** | Keep references, courses, and publications optional and clearly collapsible. |
| Timeline | Visually communicates chronology. | Absolute-positioned/timeline elements increase ATS and overflow risk around long dates or long roles. | **Medium** | **High** for portfolio-forward roles | Use only with short role histories; add a one-column ATS alternative. |
| Sidebar Pro | Strong visual separation between profile and content. | Sidebar reading order and narrow-column content are risky for ATS and long content. | **Low–Medium** | **High** for visual/remote roles | Keep as a premium visual template, not the default ATS template. |
| Gradient | Energetic and modern visual signature. | Gradients and dark surfaces require contrast and print testing; less conservative for local hiring. | **Low–Medium** | **High** for startups/creative roles | Add explicit print-safe/ATS guidance and preserve a flat-color fallback. |
| Two Column | Fast visual scanning and compact composition. | Column order can be misread by ATS; long text can create uneven column balance. | **Medium** | **High** | Offer a semantic single-column export option. |
| Centered | Portfolio/editorial feel with strong visual personality. | Lower information density and weaker recruiter scan pattern for conventional applications. | **Low–Medium** | **High** for design/creative roles | Best for portfolio links and short experience; avoid for dense technical histories. |
| Slate | Restrained, serious, and professional. | Dark/slate visual treatment can become heavy in print and may reduce perceived contrast. | **Medium–High** | **High** | Good for senior technical/product roles; include a white-paper export mode. |
| Cosmic | Distinctive and memorable. | Highest visual/ATS/print risk because the identity can dominate hierarchy and contrast. | **Low** | **High** for creative/startup roles | Keep experimental; do not recommend for automated ATS submissions. |
| Sharp | Crisp, technical, and structured. | Tight dividers and compact spacing can feel dense with long content. | **Medium–High** | **High** | Strong for engineering/product; test long bullets and section overflow. |
| Nova | Modern branded balance between structure and expression. | Accent contrast and long-content wrapping need additional export testing. | **Medium–High** | **High** | Good default for remote product roles after print-safe validation. |
| Boxed | Modular sections create clear grouping. | Many borders can create visual noise and segmented ATS extraction. | **Medium** | **Medium–High** | Use for concise resumes; reduce border density in ATS mode. |

## Local/offline behavior

The builder’s local-first persistence is useful for privacy and quick recovery within the same browser profile, but it is not equivalent to cloud storage. The largest local risk is font drift: a resume created while Google Fonts are available may reflow when opened offline or exported after the font request fails. The second risk is storage loss from browser data clearing or quota exhaustion. A production version should offer explicit JSON backup/import, a visible “last saved locally” timestamp, and a font fallback preview before export.

## Remote-job behavior

Remote applications benefit from prominent LinkedIn, GitHub, portfolio, project, and location/time-zone information. The data model supports these fields, including “Remote” employment type, but the rendered output does not consistently convert URLs into native links. Remote-job templates should also support timezone, distributed-team impact, async collaboration, tools/platforms, and measurable outcomes. These are currently content choices rather than template-aware guidance, so the builder does not actively distinguish remote-ready resumes from conventional resumes.

## Error and bug summary

The most important fixed bug was incorrect forced one-page behavior for long resumes; the browser gallery and production build now use dynamic pagination based on measured document height. The remaining important issues are export-as-image accessibility, plain-text URL output, incomplete backend dependency/type validation, offline font drift, localStorage-only recovery, and large Resume Builder bundle size. No render-time exception was observed across the 20 templates in the automated sparse/populated/ATS harness.

## Recommended remediation order

First, add native-text or hybrid PDF export and a browser-generated PDF regression test with long content. Second, normalize and render URLs as safe clickable links while keeping the visible text readable in print. Third, add an explicit ATS-safe single-column export mode independent of the decorative template. Fourth, add JSON backup/export and local-storage quota/error messaging. Finally, split the Resume Builder and its export libraries into smaller lazy-loaded chunks.
