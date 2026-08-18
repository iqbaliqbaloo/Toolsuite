# ToolSuite Exact 30-Tool Specification

## Scope decision

ToolSuite will contain exactly 30 unique tools. The existing `Password Generator` will be upgraded and renamed to the requested exact name `Secure Password Generator`, rather than creating a duplicate. The existing `Currency Converter` remains because it is already a live-rate calculator in the product. The user-requested list therefore contributes 19 new unique tools after the password overlap is resolved. Three complementary tools are added to reach exactly 30: `Investment Return Calculator`, `Time Zone Converter`, and `Percentage Calculator`.

## Final unique catalog

| # | Category | Exact tool name | Source | Core output |
|---:|---|---|---|---|
| 1 | Generator | QR Code Generator | Existing | QR preview and downloadable code |
| 2 | Generator | Secure Password Generator | Existing, renamed | Cryptographically safe password output |
| 3 | Generator | Resume Builder | Existing | Live CV preview and PDF export |
| 4 | Generator | Invoice Generator | Existing | Printable invoice and PDF export |
| 5 | Generator | UUID Generator | Existing | UUID batch output and copy/export |
| 6 | Calculator | Age Calculator | Existing | Exact age and date difference |
| 7 | Calculator | BMI Calculator | Existing | BMI result and interpretation |
| 8 | Calculator | Currency Converter | Existing | Live-rate conversion |
| 9 | Calculator | Compound Interest Calculator | Requested | Future value, contributions, and growth breakdown |
| 10 | Calculator | Crypto ROI & Profit Calculator | Requested | Cost basis, proceeds, profit/loss, ROI |
| 11 | Calculator | Mortgage Amortization Calculator | Requested | Payment, amortization schedule, interest total |
| 12 | Calculator | Salary After Tax Calculator | Requested | Estimated net pay and deduction breakdown |
| 13 | Calculator | Freelance Hourly Rate Calculator | Requested | Sustainable hourly rate and workload assumptions |
| 14 | Calculator | Investment Return Calculator | Added to reach 30 | Return, profit/loss, and annualized result |
| 15 | Calculator | Percentage Calculator | Added to reach 30 | Percentage change, share, and reverse percentage |
| 16 | Developer | XML Sitemap Generator | Requested | Valid XML sitemap output |
| 17 | Developer | Htaccess Redirect Code Generator | Requested | Apache redirect rules |
| 18 | Developer | Robots.txt Generator | Requested | Robots directives and preview |
| 19 | Developer | Domain Authority/Age Checker | Requested | Public domain age/metadata result or clear unavailable state |
| 20 | Developer | Website Social Share Link Generator | Requested | Share URLs for supported networks |
| 21 | Developer | JSON to CSV Converter | Requested | CSV output with nested-field handling |
| 22 | Developer | Regex Cheat Sheet & Tester | Requested | Matches, groups, examples, and cheat sheet |
| 23 | Developer | SQL Query Formatter | Requested | Readable formatted SQL |
| 24 | Developer | YAML Validator | Requested | Parse result, errors, and normalized YAML |
| 25 | Developer | Crontab Expression Generator | Requested | Cron expression and human-readable schedule |
| 26 | Developer | Time Zone Converter | Added to reach 30 | Cross-zone date/time conversion |
| 27 | Image | SVG to PNG Converter | Requested | Browser-rendered PNG download |
| 28 | Developer | CSS Flexbox Generator | Requested | Interactive flex layout and CSS output |
| 29 | Developer | UTM Link Builder | Requested | Validated campaign URL |
| 30 | Developer | Subnet Calculator | Requested | Network, range, broadcast, and host counts |

## Implementation rule

The production catalog must assert exactly 30 unique IDs and slugs. Every catalog entry must map to a working route and implementation with validated inputs, an explanation of what the tool does, a practical use case, feedback controls, loading/empty/error/success states, and tests. No catalog entry may claim a live external capability unless its data source and failure state are implemented.
