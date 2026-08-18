import type { ToolSeoData } from '../constants/tool-seo';

const education = (intro: string, how: string, use: string, faqs: Array<[string, string]>): ToolSeoData => ({
  metaTitle: '',
  metaDescription: '',
  content: [
    { heading: 'What this tool does', body: intro },
    { heading: 'How the result is calculated or generated', body: how },
    { heading: 'Practical use cases and limitations', body: use },
  ],
  faqs: faqs.map(([question, answer]) => ({ question, answer })),
});

export const TOOL_EDUCATION: Record<string, ToolSeoData> = {
  'compound-interest': education(
    'Compound interest estimates how an initial balance and recurring contributions can grow when returns are reinvested. It separates your deposits from the projected growth so the result is easier to interpret.',
    'The calculation applies the supplied annual rate and compounding frequency to the starting principal and contribution schedule. The projection is mathematical and does not assume that real markets deliver a fixed return.',
    'Use it to compare saving frequency, time horizon, and contribution size. Inflation, taxes, account fees, changing rates, and investment volatility are not included unless represented by your inputs.',
    [['What is compound interest?', 'Compound interest is growth calculated on the original balance plus previously accumulated growth.'], ['Does this predict investment performance?', 'No. It is a scenario calculator, not a forecast or a guarantee of returns.'], ['Why does the time horizon matter so much?', 'A longer horizon gives reinvested growth more periods to affect the balance, although actual returns can vary.']]
  ),
  'crypto-roi': education(
    'Crypto ROI & Profit Calculator compares your supplied purchase and sale prices, token quantity, and trading fees to show cost basis, proceeds, profit or loss, and return on investment.',
    'The tool multiplies quantity by the supplied buy and sell prices, subtracts the entered fees, and compares the net result with the initial cost basis. It does not fetch a market quote.',
    'Use it for a transparent what-if scenario before reviewing an exchange order. Slippage, spreads, taxes, staking rewards, custody costs, and future price movements are outside the calculation.',
    [['Does the calculator use live crypto prices?', 'No. Enter the prices you want to compare; the tool does not predict or fetch a future market price.'], ['Are trading fees included?', 'Yes, when you enter them. Review whether your exchange charges fees on the buy, sale, or both.'], ['Is the result tax advice?', 'No. Tax treatment depends on jurisdiction, holding period, cost-basis rules, and personal circumstances.']]
  ),
  'mortgage-amortization': education(
    'Mortgage Amortization Calculator shows an estimated fixed-rate payment, principal and interest over time, total interest, and the effect of an extra monthly principal payment.',
    'The schedule applies the standard fixed-rate payment formula and reduces the balance month by month. Extra principal is treated as an additional payment that reduces the outstanding balance.',
    'Use it to compare terms and repayment strategies before speaking with a lender. Taxes, insurance, escrow, points, variable rates, lender fees, and refinancing are not included by default.',
    [['Does the payment include property tax and insurance?', 'No. The core result estimates principal and interest; escrow and lender-specific charges must be reviewed separately.'], ['What does an extra payment change?', 'It can reduce the balance sooner and may reduce total interest, but confirm any prepayment rules with the lender.'], ['Is the result an official mortgage quote?', 'No. It is an estimate for comparison and planning, not a lending offer.']]
  ),
  'salary-after-tax': education(
    'Salary After Tax Calculator estimates take-home pay from gross income, deductions, pay frequency, and an effective tax rate supplied by you.',
    'Gross pay is reduced by the entered deductions and estimated tax rate, then divided according to the selected pay frequency. It deliberately avoids pretending to encode every jurisdiction’s tax table.',
    'Use it to compare job offers or plan a budget at a high level. Filing status, credits, benefits, local taxes, payroll caps, and country-specific rules can change the actual payslip.',
    [['Is this calculator accurate for every country?', 'No. It is a simplified estimate and should not replace official tax software or professional advice.'], ['Can I include deductions?', 'Yes. Enter deductions such as benefits or retirement contributions according to the assumptions you want to compare.'], ['Why might my payslip differ?', 'Payroll systems use local rules, brackets, credits, caps, benefits, and withholding settings that may not match a simple effective-rate estimate.']]
  ),
  'freelance-rate': education(
    'Freelance Hourly Rate Calculator converts an income goal, business costs, leave, working time, and realistic billable capacity into an hourly pricing floor.',
    'The calculator accounts for non-billable time and operating costs before dividing the target revenue by expected billable hours. This makes the result more useful than dividing salary by every available clock hour.',
    'Use it to set a baseline before negotiating a project or retainer. Market positioning, scope risk, taxes, currency, payment delays, and value-based pricing may justify a different quote.',
    [['Why are billable hours lower than working hours?', 'Freelancers also spend time on sales, administration, learning, invoicing, and leave, so not every hour can be sold.'], ['Should taxes be included?', 'Include a tax reserve in costs or your income goal, then confirm the treatment with a qualified local adviser.'], ['Is an hourly rate always the best pricing model?', 'No. Fixed, milestone, retainer, and value-based pricing can be better for some scopes.']]
  ),
  'investment-return': education(
    'Investment Return Calculator compares a starting value with an ending value and optional fees to estimate profit, ROI, and annualized return over a holding period.',
    'The result compares net values and annualizes the change over the supplied dates or period. Annualization helps comparison but can make short-period results look unusually large.',
    'Use it to review a completed scenario or compare alternatives. It does not model deposits, withdrawals, dividends, taxes, volatility, or the probability of future returns unless explicitly entered.',
    [['What is ROI?', 'ROI compares profit with the amount initially invested, usually expressed as a percentage.'], ['What is annualized return?', 'It expresses a multi-period change as an equivalent yearly rate for comparison; it is not a promise of future performance.'], ['Are fees included?', 'Enter applicable fees when supported, and check whether your source values are gross or net.']]
  ),
  'percentage-calc': education(
    'Percentage Calculator handles common percentage questions such as finding a share of a value, measuring percentage change, and comparing two numbers.',
    'Each operation uses a different relationship between the supplied values. The interface labels the operation so percentage change is not confused with a percentage-point difference.',
    'Use it for discounts, growth rates, proportions, and quick business or study calculations. For regulated reporting, verify rounding and the definition used by your organization.',
    [['How do I calculate percentage change?', 'Subtract the original value from the new value, divide by the original, and multiply by 100.'], ['What is a percentage point?', 'It is the arithmetic difference between two percentages, such as 42% minus 35% equaling 7 percentage points.'], ['Why can a percentage change be undefined?', 'A percentage change needs a non-zero original value as its baseline.']]
  ),
  'sitemap-generator': education(
    'XML Sitemap Generator turns a list of absolute URLs into a clean XML sitemap that search engines can discover and process.',
    'URLs are escaped and placed into the sitemap XML structure. The generator keeps the output focused on canonical URL discovery rather than claiming that priority or frequency fields control rankings.',
    'Use it for small sites, tool collections, and launch checklists. A sitemap should contain indexable canonical URLs and should be submitted through the relevant search-console property.',
    [['Does a sitemap guarantee indexing?', 'No. It is a discovery hint; search engines still evaluate quality, access, duplication, and eligibility.'], ['Should URLs be absolute?', 'Yes. Use the complete HTTPS URL for every page in the sitemap.'], ['Should private pages be included?', 'No. Do not use a sitemap to expose URLs that should remain private.']]
  ),
  'htaccess-generator': education(
    'Htaccess Redirect Code Generator creates Apache rewrite rules for path changes, migrations, and permanent or temporary redirects.',
    'The selected source path, destination, and redirect status are escaped into a readable Apache rule. The output is code to review, not an automatic server change.',
    'Use it during a migration and test it in staging first. Avoid redirect chains, loops, broad rules that catch unrelated paths, and syntax that your host does not support.',
    [['When should I use a 301 redirect?', 'Use a permanent redirect when a page has moved and the old URL should resolve to the new canonical location.'], ['Does this edit my server automatically?', 'No. Copy the generated rule into the appropriate configuration only after testing it.'], ['Why can an htaccess rule fail?', 'Apache modules, hosting settings, path context, escaping, or rule order can affect behavior.']]
  ),
  'robots-generator': education(
    'Robots.txt Generator builds crawler directives for user-agents, allow and disallow paths, and sitemap references.',
    'The tool serializes the selected directives into plain-text robots.txt syntax and keeps the sitemap URL separate from crawl permissions.',
    'Use it to communicate crawl preferences, not to protect sensitive data. A disallow rule does not grant access control and does not guarantee that a URL will never appear in search results.',
    [['Where does robots.txt belong?', 'It belongs at the root of the host, such as https://example.com/robots.txt.'], ['Can robots.txt protect confidential files?', 'No. Use authentication and server access controls for confidential content.'], ['Should I disallow CSS or JavaScript?', 'Usually not when search crawlers need those resources to understand the rendered page.']]
  ),
  'domain-age': education(
    'Domain Authority/Age Checker uses public RDAP registration data to show a domain’s available registration date, estimated age, and registry status.',
    'The tool requests public RDAP data and derives an approximate age from the returned registration event. Registry fields and availability vary by top-level domain.',
    'Use it for a public registration-history check. It does not claim a Moz, Ahrefs, Semrush, or other third-party SEO authority score, and domain age alone does not establish trust or ranking ability.',
    [['Does domain age equal domain authority?', 'No. Age and SEO authority are different concepts; authority requires a separate provider and methodology.'], ['Why might no registration date appear?', 'Some registries omit or restrict fields, the domain may be unavailable through RDAP, or the response may be incomplete.'], ['Is RDAP data a legal ownership record?', 'No. Treat it as public registry information and verify important ownership questions through the appropriate registrar or registry.']]
  ),
  'social-share': education(
    'Website Social Share Link Generator creates copy-ready share URLs for Facebook, X, and LinkedIn from a destination URL and message or title.',
    'The tool URL-encodes the supplied page and text into each network’s share-link format. It does not publish content or access user accounts.',
    'Use it for buttons, campaign links, and QA checks. Link previews depend on the destination page’s Open Graph or equivalent metadata and each network’s crawler cache.',
    [['Does this publish a post for me?', 'No. It opens or copies a share link; the user still reviews and submits the post in the network.'], ['Why is the preview image wrong?', 'The social network may be caching older metadata or the destination page may not expose the expected image dimensions and tags.'], ['Can I track social shares?', 'Use tagged destination URLs and your analytics platform; the generated link itself does not provide analytics.']]
  ),
  'json-csv': education(
    'JSON to CSV Converter turns an array or object-based JSON response into escaped, spreadsheet-friendly CSV columns.',
    'The tool parses JSON, discovers a consistent set of object keys, serializes nested values safely, and quotes fields containing commas, quotes, or line breaks.',
    'Use it for API exports and quick analysis. Nested data may become JSON text, very large numbers can be reformatted by spreadsheet software, and CSV is not a schema or database migration format.',
    [['What JSON shape works best?', 'An array of objects with comparable keys produces the clearest CSV table.'], ['How are commas and quotes handled?', 'CSV fields are escaped and quoted according to common CSV conventions.'], ['Can CSV preserve nested objects?', 'Nested values can be represented as text, but complex relationships are better kept in JSON or a database.']]
  ),
  'regex-cheat': education(
    'Regex Cheat Sheet & Tester combines live pattern testing with common regular-expression building blocks for validation and text matching.',
    'The browser compiles the supplied expression with the selected flags and runs it against sample text, showing matches or a precise syntax error.',
    'Use it to experiment before adding a pattern to an application. Regex dialects differ, catastrophic backtracking is possible in some engines, and a test pattern is not automatically a complete validator.',
    [['What does the global flag do?', 'It allows the engine to find multiple matches instead of stopping after the first match.'], ['Why does a regex work in one language but not another?', 'Regex engines support different syntax, flags, Unicode behavior, and escaping rules.'], ['Can regex validate every email or URL?', 'It can check a chosen pattern, but complete standards and business rules are often better handled by dedicated parsers.']]
  ),
  'sql-formatter': education(
    'SQL Query Formatter turns dense SQL into a readable multi-line layout that is easier to review, explain, and debug.',
    'The formatter recognizes common SQL keywords, punctuation, parentheses, and clauses, then applies indentation and line breaks without executing the query.',
    'Use it before code review or documentation. Formatting does not verify tables, permissions, performance, injection safety, or vendor-specific syntax.',
    [['Does formatting execute my query?', 'No. The formatter treats the text as code and does not connect to a database.'], ['Does it optimize SQL?', 'No. It improves readability; query plans and indexes require database-specific analysis.'], ['Why might vendor syntax look imperfect?', 'SQL dialects differ, and a generic formatter cannot perfectly model every database extension.']]
  ),
  'yaml-validator': education(
    'YAML Validator parses configuration text and reports whether its syntax is valid without executing tags or commands.',
    'A real YAML parser reads indentation, mappings, sequences, strings, and scalar values, then returns normalized output or a location-aware parse error.',
    'Use it before committing CI, deployment, or application configuration. Syntax validity does not prove that a particular schema, platform, or secret-management policy accepts the file.',
    [['Does a valid YAML file guarantee a valid Kubernetes or CI file?', 'No. The platform still applies its own schema and required-field rules.'], ['Why is indentation important?', 'YAML uses indentation to express structure, so inconsistent spaces can change meaning or cause a parse error.'], ['Does the validator execute YAML tags?', 'No. It is used as a safe syntax check rather than an execution environment.']]
  ),
  'crontab-generator': education(
    'Crontab Expression Generator translates a plain scheduling choice into a standard five-field cron expression and a readable summary.',
    'Minute, hour, day-of-month, month, and day-of-week values are placed in cron field order. The result is shown as code and plain language for review.',
    'Use it for recurring server tasks and reminders. Cron implementations, daylight-saving behavior, environment variables, and host time zones differ, so test the actual runtime.',
    [['What are the five cron fields?', 'Minute, hour, day of month, month, and day of week, in that order.'], ['Which time zone does cron use?', 'Usually the host or configured service time zone; confirm it on the system that will run the job.'], ['Can a cron expression run a missed job later?', 'Traditional cron generally does not replay missed runs unless a separate scheduler or catch-up configuration is used.']]
  ),
  'timezone-converter': education(
    'Time Zone Converter translates a selected date and time between IANA time zones for remote teams, travel, events, and international coordination.',
    'The browser applies the selected IANA zone rules to the date and time, including offset changes where the local time-zone data supports them.',
    'Use it to propose meeting times and check deadlines. Time-zone rules can change, ambiguous times can occur around daylight-saving transitions, and the receiving calendar should remain the final source of truth.',
    [['Why use IANA names instead of only UTC offsets?', 'IANA zones represent regional rules and seasonal offset changes, while a fixed offset does not.'], ['What happens during daylight-saving transitions?', 'Some local times do not exist or occur twice; verify critical appointments in a calendar.'], ['Does this change the date as well as the time?', 'Yes. A conversion can cross midnight and move the local calendar date.']]
  ),
  'svg-png': education(
    'SVG to PNG Converter renders SVG markup locally in the browser and prepares a raster PNG for presentations, previews, and tools that do not accept SVG.',
    'The SVG is parsed into an image and drawn on a browser canvas before export. The original markup is not uploaded by this browser-first workflow.',
    'Use it for simple icons, logos, and illustrations. External fonts, linked assets, filters, script content, and very large dimensions can render differently or be unavailable for security reasons.',
    [['When should I use PNG instead of SVG?', 'PNG is useful when the destination accepts raster images only or when a fixed pixel output is required.'], ['Will the PNG stay sharp at every size?', 'No. PNG is raster; choose a large enough export size for the intended display.'], ['Can every SVG feature render identically?', 'No. Browser support, external resources, filters, and fonts can affect the result.']]
  ),
  'flexbox-generator': education(
    'CSS Flexbox Generator lets you choose common container properties visually and copy the resulting CSS for a responsive layout starting point.',
    'Controls map to properties such as flex-direction, justify-content, align-items, flex-wrap, and gap, while the preview shows their combined effect.',
    'Use it to learn and prototype alignment rules. Child sizing, intrinsic content, grid behavior, accessibility order, and responsive breakpoints still require deliberate CSS and semantic HTML.',
    [['What does justify-content control?', 'It distributes items along the main axis of the flex container.'], ['What does align-items control?', 'It aligns items along the cross axis for the current flex direction.'], ['Is Flexbox a replacement for CSS Grid?', 'No. Flexbox is typically one-dimensional; Grid is often better for two-dimensional page layouts.']]
  ),
  'utm-builder': education(
    'UTM Link Builder adds campaign parameters to a destination URL so analytics reports can distinguish traffic sources, media, campaigns, and content variants.',
    'The builder URL-encodes the supplied values and preserves an existing query string while appending the chosen UTM parameters.',
    'Use it to standardize campaign naming before publishing newsletters, ads, social posts, or partner links. Consistent lowercase conventions and an internal naming guide prevent fragmented reports.',
    [['Which UTM fields are most common?', 'utm_source, utm_medium, and utm_campaign are the usual starting fields; content and term can distinguish variants.'], ['Can UTM parameters change the destination?', 'They should not change the destination path, but they are visible in the URL and may affect caching or privacy considerations.'], ['How do I measure campaign results?', 'Configure your analytics platform to read the parameters and confirm that redirects preserve them.']]
  ),
  'subnet-calc': education(
    'Subnet Calculator interprets an IPv4 address and CIDR prefix to show the network, broadcast, usable host range, and address count.',
    'The address becomes a 32-bit value and the CIDR prefix becomes a network mask. Applying the mask identifies the network boundary; the remaining bits describe addresses within it.',
    'Use it for planning documentation, labs, and troubleshooting. It does not configure devices, account for every reserved-address policy, or replace an organization’s IPAM system.',
    [['What does /24 mean?', 'It means 24 of the 32 IPv4 bits identify the network, leaving 8 bits for addresses within that block.'], ['What is the broadcast address?', 'It is the final address in a traditional IPv4 subnet and is used to reach all hosts on that subnet.'], ['Are all addresses usable by hosts?', 'Not always. Network, broadcast, gateway, reserved, and policy-specific addresses may reduce the usable count.']]
  ),
};
