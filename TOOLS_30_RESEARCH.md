# ToolSuite Exact-30 Research Notes

## Finance and crypto calculators

The Compound Interest Calculator should expose initial investment, recurring contribution, duration, annual rate, rate variance, and compounding frequency. Investor.gov uses those inputs and explains that the tool is an estimate for exploring growth rather than a guarantee. Formula baseline: `A = P(1 + r/n)^(nt)` with recurring contributions handled per period. Source: [Investor.gov Compound Interest Calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator).

The Mortgage Amortization Calculator should clearly distinguish principal and interest from escrow items such as taxes and insurance. A fixed-rate payment uses `M = P × [r(1+r)^n / ((1+r)^n − 1)]`, with monthly rate `r` and total payments `n`. The product should support extra principal payments and explain that adjustable-rate mortgages require a different model. Source: [Bankrate Amortization Calculator](https://www.bankrate.com/mortgages/amortization-calculator/).

The Salary After Tax Calculator must be labeled as an estimate and require a jurisdiction, tax year, filing status, and income frequency. Tax brackets are progressive, and deductions, credits, payroll taxes, and state/local rules materially change results. TaxAct explicitly warns that tax laws change and recommends current regulations or professional advice. Source: [TaxAct Tax Bracket Calculator](https://www.taxact.com/tax-resources/tax-calculators/tax-bracket-calculator).

The Crypto ROI tool should show cost basis, fees, sale proceeds, realized profit/loss, and ROI percentage. It should not imply future performance, should distinguish realized from unrealized outcomes, and should include a volatility/risk disclaimer. The tool can calculate supplied prices locally without requiring a live market feed; live prices require a documented external data source and a clear stale-data state.

## SEO and webmaster tools

Google’s robots.txt guidance requires a UTF-8 plain-text file named `robots.txt` at the root of the relevant host. Directives are grouped by `User-agent`; `Allow`, `Disallow`, and fully qualified `Sitemap` lines should be generated with correct case-sensitive syntax. Source: [Google: How to write and submit a robots.txt file](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

Google’s sitemap guidance recommends absolute canonical URLs, UTF-8 encoding, root placement when appropriate, XML entity escaping, and limits of 50 MB uncompressed or 50,000 URLs per sitemap. The generator must validate absolute URLs and offer a clear warning when a sitemap needs splitting. Source: [Google Search Central: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

The UTM Link Builder should always encourage `utm_source`, `utm_medium`, and `utm_campaign`, normalize naming consistently, and preserve existing query parameters correctly. Google Analytics treats values as case-sensitive and recommends standardized naming. Source: [Google Analytics: URL builders](https://support.google.com/analytics/answer/10917952?hl=en).

## Network and configuration tools

The Subnet Calculator should use CIDR prefix notation and correctly report network address, broadcast address, first/last usable host, total addresses, and usable hosts. IPv4 CIDR behavior follows IETF RFC 4632. Source: [RFC 4632: Classless Inter-domain Routing](https://datatracker.ietf.org/doc/html/rfc4632).

The YAML Validator must show parser errors without executing YAML tags or arbitrary code. The JSON-to-CSV tool must define behavior for nested objects, arrays, missing keys, and inconsistent row shapes. The Crontab Expression Generator should produce five-field POSIX cron output by default and explain that scheduler variants differ.

## Product implementation rules

Every tool will have a concise explanation titled “What it does,” a practical “When to use it” section, validated inputs, an explicit action button, result feedback, copy/download controls where relevant, recoverable errors, and a user feedback action. Tools depending on external services must show a service status, source attribution, timestamp, and unavailable state rather than returning fake or static live data.
