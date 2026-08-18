export interface ToolSeoSection {
  heading: string;
  body: string;
}

export interface ToolSeoData {
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  content: ToolSeoSection[];
}

const TOOL_SEO: Record<string, ToolSeoData> = {
  'qr-gen': {
    metaTitle: 'Free QR Code Generator — Create Custom QR Codes Instantly | ToolSuite',
    metaDescription:
      'Generate free QR codes for URLs, WiFi, email, phone, vCard, and 9 other types. Customize colors, add a logo, and download PNG or SVG. No signup required.',
    faqs: [
      {
        question: 'How do I create a QR code for a website?',
        answer:
          'Select the URL type, paste your website link, optionally customize the colors, and click Download. Your QR code is ready in under 10 seconds.',
      },
      {
        question: 'Can I add my logo to a QR code?',
        answer:
          'Yes. Upload a PNG or SVG logo and it will be embedded in the center of the QR code. The error-correction level is automatically raised to keep the code scannable.',
      },
      {
        question: 'What QR code types are supported?',
        answer:
          'URL, plain text, email, phone number, SMS, Wi-Fi credentials, vCard contact, calendar event, and geo-location — 9 types in total.',
      },
      {
        question: 'Will the QR code work forever?',
        answer:
          'Static QR codes encode the data directly and work indefinitely without any server. As long as the destination URL is live, scans will succeed.',
      },
      {
        question: 'What file formats can I download?',
        answer:
          'PNG for screen use and social sharing, and SVG for print — SVG scales to any size without pixelation, ideal for business cards and banners.',
      },
    ],
    content: [
      {
        heading: 'What Is a QR Code?',
        body: 'A QR (Quick Response) code is a two-dimensional barcode that stores data readable by any smartphone camera. Unlike traditional linear barcodes, QR codes hold hundreds of times more information and can be scanned at any angle. They were invented in 1994 by Denso Wave and have become the universal standard for bridging printed materials with digital content — from restaurant menus to product packaging to event tickets.',
      },
      {
        heading: '9 QR Code Types Supported',
        body: 'Our QR Code Generator handles nine content types: website URLs, plain text messages, email addresses with pre-filled subject and body, phone numbers, SMS with a preset message, Wi-Fi network credentials (SSID, password, and security type), vCard contact cards, calendar events with start and end times, and GPS geo-location coordinates. Each type outputs a QR code optimized for fast scanning of that specific data format.',
      },
      {
        heading: 'How to Create Your QR Code',
        body: 'Choose a type from the panel, enter your content, and the live preview updates in real time. Adjust the foreground and background colors to match your brand identity. Upload a logo image to embed it in the center — the tool automatically increases error correction so the code stays readable. When satisfied, click Download to save a high-resolution PNG for digital use or an SVG for print-ready output at any size.',
      },
      {
        heading: 'Common Use Cases',
        body: 'Marketers print QR codes on business cards, flyers, and packaging to drive traffic to landing pages. Restaurants use them on table cards for contactless menus. IT teams share Wi-Fi QR codes so guests connect without typing passwords. Event organizers encode calendar entries on conference badges. Developers embed QR codes in mobile apps for device pairing and two-factor authentication. Whatever the use case, your QR code is generated entirely in the browser — no data is sent to any server.',
      },
    ],
  },

  'password-gen': {
    metaTitle: 'Free Password Generator — Secure Random Passwords & Passphrases | ToolSuite',
    metaDescription:
      'Generate strong, random passwords or memorable passphrases instantly. Time-to-crack indicator and Have I Been Pwned breach check built in. No signup required.',
    faqs: [
      {
        question: 'How long should my password be?',
        answer:
          'At least 16 characters for high-value accounts. Our time-to-crack indicator shows the estimated brute-force time so you can choose the right length for your needs.',
      },
      {
        question: 'What is the difference between a password and a passphrase?',
        answer:
          'A password is a dense random string like "kT#9mXqR". A passphrase is several random words joined together, like "correct-horse-battery-staple". Passphrases are longer, easier to remember, and equally secure when using 4+ words.',
      },
      {
        question: 'What is the HIBP breach check?',
        answer:
          "Have I Been Pwned (HIBP) is a database of passwords exposed in known data breaches. The check sends only the first 5 characters of a SHA-1 hash of your password — your actual password never leaves your browser.",
      },
      {
        question: 'Is it safe to use an online password generator?',
        answer:
          'Yes. ToolSuite generates passwords entirely in your browser using the Web Crypto API. No passwords are transmitted to any server or logged anywhere.',
      },
      {
        question: 'Can I exclude ambiguous characters?',
        answer:
          'Yes. Toggle the "Exclude ambiguous" option to remove characters like 0, O, l, and 1 that look similar in some fonts — useful when you need to read the password aloud or type it manually.',
      },
    ],
    content: [
      {
        heading: 'Why Strong Passwords Matter',
        body: 'Over 80% of data breaches involve stolen or brute-forced passwords. A common 8-character password like "password1" can be cracked in under a second using modern GPUs. A randomly generated 16-character password mixing uppercase letters, lowercase letters, numbers, and symbols would take thousands of years to crack with the same hardware — making it effectively unbreakable for any real-world attacker.',
      },
      {
        heading: 'Random Passwords vs Passphrases',
        body: 'Random passwords are dense, high-entropy strings best used with a password manager — short to type but nearly impossible to remember unaided. Passphrases join 4 or more random words with separators, producing a long, memorable credential. Both are configurable: set the character set, length, separator style, and word count to match the specific requirements of any website or account policy.',
      },
      {
        heading: 'Time-to-Crack Indicator',
        body: 'Every generated password displays an estimated time to crack, calculated using realistic brute-force speeds based on current consumer GPU performance. Adjust the length slider or toggle character sets and watch the estimate shift from milliseconds to centuries. This gives you instant, visual feedback on the trade-off between memorability and security before you commit to a password.',
      },
      {
        heading: 'Have I Been Pwned Breach Check',
        body: 'The integrated HIBP (Have I Been Pwned) check tells you whether a password has appeared in any publicly known data breach. The check is performed using a k-anonymity model: only the first 5 characters of the SHA-1 hash are sent to the API. The full password never leaves your browser, and the API returns a list of matching hash suffixes — so the check is both private and accurate. Avoid any password flagged as breached, even if it looks strong.',
      },
    ],
  },

  'resume-builder': {
    metaTitle: 'Free Resume Builder — ATS-Optimized CV Maker with Live Preview | ToolSuite',
    metaDescription:
      'Build a professional ATS-friendly resume online for free. Live A4 preview, 3 templates, real-time ATS score, job keyword matching, and one-click PDF export. No account needed.',
    faqs: [
      {
        question: 'Is the Resume Builder completely free?',
        answer:
          'Yes. All features — templates, ATS scoring, job match analysis, and PDF export — are free with no account required. Your data never leaves your browser.',
      },
      {
        question: 'What does ATS-optimized mean?',
        answer:
          'ATS (Applicant Tracking System) software scans resumes before a recruiter sees them. Our ATS score checks for essential sections, keyword density, formatting, and phrasing that ATS systems flag favorably.',
      },
      {
        question: 'How do I export my resume as a PDF?',
        answer:
          "Click the Download PDF button in the top toolbar. The export captures the live A4 preview exactly as shown, preserving fonts, spacing, and colors. No server upload is required — it generates entirely in your browser.",
      },
      {
        question: 'Can I save my resume and edit it later?',
        answer:
          'Yes. Your resume data is automatically saved to your browser\'s local storage. Revisit the same browser to continue editing. You can also create multiple CV versions and switch between them.',
      },
      {
        question: 'What templates are available?',
        answer:
          'Three recruiter-approved templates: Classic (traditional single-column), Modern (two-column with sidebar), and Minimal (clean whitespace-heavy layout). All pass ATS parsing and suit any industry.',
      },
    ],
    content: [
      {
        heading: 'Professional Resume Builder — No Account Required',
        body: 'ToolSuite Resume Builder is a free, browser-based CV editor that produces a professional resume in minutes. The three-panel workspace keeps you productive: a section navigator on the left lists every CV section, a field editor in the center lets you type and format, and a live A4 preview on the right updates instantly as you type. Every entry you make is reflected in the preview in real time, so you always know exactly how the final document looks before you export.',
      },
      {
        heading: 'Real-Time ATS Score',
        body: "Applicant Tracking Systems scan and filter resumes before a human recruiter ever sees them. Studies show that over 75% of applications are rejected by ATS before reaching a person. Our built-in ATS score analyzes your resume as you fill it in and gives you a live score out of 100. It checks for missing sections, weak action verbs, insufficient keyword density, and formatting problems. Specific guidance tells you exactly what to fix next, so improving your score is always actionable.",
      },
      {
        heading: 'Job Match & Keyword Analysis',
        body: "Tailoring your resume for each application dramatically increases callback rates. Paste the full job description into the Job Match tab and our analyzer instantly highlights which keywords from the posting your resume already contains and which are missing. You can then add the missing terms naturally into your experience bullets or skills section, giving each application the best possible match score for that specific role — without starting from scratch every time.",
      },
      {
        heading: 'Templates, Colors, and PDF Export',
        body: 'Choose from three clean, professionally designed templates and five accent color options. Classic suits traditional industries like finance, law, and academia. Modern works well for tech and design. Minimal fits any role where whitespace and readability are priorities. All templates export to a pixel-perfect A4 PDF using your browser\'s built-in rendering — no server upload, no watermark, no file size limit. Your resume data remains entirely on your device.',
      },
    ],
  },

  'invoice-gen': {
    metaTitle: 'Free Invoice Generator — Professional Invoice Maker in 150+ Currencies | ToolSuite',
    metaDescription:
      'Create professional invoices online in seconds. Supports 150+ currencies, logo upload, tax and discount fields, instant PDF download, and direct email delivery. No account required.',
    faqs: [
      {
        question: 'Can I add my company logo to the invoice?',
        answer:
          'Yes. Upload your logo in PNG, JPG, or SVG format and it will appear in the top-left corner of the invoice header.',
      },
      {
        question: 'Does the Invoice Generator support tax?',
        answer:
          'Yes. You can add a tax rate as a percentage or a fixed amount. Tax is calculated automatically on the subtotal and shown as a separate line before the grand total.',
      },
      {
        question: 'How do I send the invoice by email?',
        answer:
          'After filling in all fields, click the Email button, enter the recipient\'s address, and a pre-formatted email with the invoice PDF attached will be sent directly from the tool.',
      },
      {
        question: 'Can I save invoice templates for repeated use?',
        answer:
          'Your business details — name, address, logo, default currency, and payment terms — are saved in your browser so you never have to re-enter them for new invoices.',
      },
      {
        question: 'Is the invoice data stored on your servers?',
        answer:
          'No. All invoice data is processed and stored locally in your browser. Nothing is uploaded to ToolSuite servers. You maintain full privacy over your billing information.',
      },
    ],
    content: [
      {
        heading: 'Create Professional Invoices in Seconds',
        body: 'ToolSuite Invoice Generator lets you produce a complete, client-ready invoice without creating an account or paying a subscription fee. Add your business name, address, logo, and contact details once and they are remembered for future invoices. Fill in client details, line items, quantities, and rates, and the running total updates live. When done, download a professional PDF or send it directly to your client by email — all from a single screen.',
      },
      {
        heading: '150+ Currencies Supported',
        body: 'Whether you bill in USD, EUR, GBP, JPY, AED, INR, AUD, or any of 150+ other world currencies, the generator handles correct currency symbols, decimal formatting, and thousands separators automatically. Switch currencies in a single click — all line item totals, taxes, and the grand total recalculate instantly. For freelancers and agencies working with international clients, this removes the manual effort of formatting multi-currency invoices correctly.',
      },
      {
        heading: 'Tax, Discounts, and Payment Terms',
        body: 'Each invoice supports multiple line items with individual descriptions, quantities, and unit rates. Apply a global tax rate as a percentage or a fixed value, and add an overall discount if needed. The subtotal, tax amount, discount amount, and grand total are shown as clearly labelled line items. Set payment terms (Net 7, Net 30, or a custom date), and add a free-text notes section for bank details, late payment policies, or personalised messages.',
      },
      {
        heading: 'Instant PDF Download and Email Delivery',
        body: 'Download the finished invoice as a print-quality PDF with one click, generated entirely in your browser with no server upload. Or use the built-in email feature to send the invoice directly to your client — the tool generates a professional email with the PDF attached. Your invoice number increments automatically with each new document, keeping your records organized without any spreadsheet tracking.',
      },
    ],
  },

  'uuid-gen': {
    metaTitle: 'Free UUID Generator — Bulk Generate v1, v4 & v5 UUIDs Online | ToolSuite',
    metaDescription:
      'Generate UUID v1, v4, and v5 online. Bulk generate up to 10,000 UUIDs at once. One-click copy and text file download. Decode existing UUIDs instantly. No signup.',
    faqs: [
      {
        question: 'What UUID version should I use?',
        answer:
          'Use v4 for general-purpose unique IDs — it is random, widely supported, and has no privacy risk. Use v1 if you need time-sortable IDs. Use v5 if you need reproducible IDs from a fixed namespace and name combination.',
      },
      {
        question: 'Are the generated UUIDs truly unique?',
        answer:
          "UUID v4 uses cryptographically secure randomness. The probability of two identical v4 UUIDs being generated is roughly 1 in 5.3 × 10^36 — effectively zero for any practical application.",
      },
      {
        question: 'How many UUIDs can I generate at once?',
        answer:
          'Up to 10,000 UUIDs in a single bulk generation. Results are listed one per line and can be copied to clipboard or downloaded as a plain text file for easy import into SQL, CSV, or JSON files.',
      },
      {
        question: 'Can I decode a UUID to read its content?',
        answer:
          'Yes. Paste any UUID into the decoder tab to see its version, variant, timestamp (for v1 UUIDs), and a plain-English summary of the information encoded in its structure.',
      },
      {
        question: 'Are the UUIDs generated on your server?',
        answer:
          'No. All UUIDs are generated client-side in your browser using the Web Crypto API. No data is sent to any server.',
      },
    ],
    content: [
      {
        heading: 'What Is a UUID?',
        body: "A UUID (Universally Unique Identifier) is a standardized 128-bit number, represented as 32 hexadecimal digits grouped in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Defined in RFC 4122, UUIDs are designed to be unique across all computers and all time without requiring a central issuing authority. They are the most widely used format for unique identifiers in databases, distributed systems, APIs, and cloud infrastructure.",
      },
      {
        heading: 'UUID Versions Explained',
        body: 'Version 1 encodes the current timestamp and the generating machine\'s MAC address, making each UUID time-sortable and traceable to a specific host. Version 4 is entirely random, making it the default choice for most applications where privacy and simplicity matter more than sortability. Version 5 is deterministic — given the same namespace (e.g. DNS or URL) and the same name string, it always produces the same UUID using a SHA-1 hash, which is valuable for content addressing and stable resource identifiers.',
      },
      {
        heading: 'Bulk Generation — Up to 10,000 at Once',
        body: 'Developers seeding databases, generating test data, or populating configuration files often need large volumes of unique identifiers quickly. The bulk mode generates up to 10,000 UUIDs in a single operation, listed one per line. Copy all to clipboard with one click, or download as a .txt file ready to import directly into SQL INSERT statements, JSON arrays, or any data pipeline tool without further processing.',
      },
      {
        heading: 'UUID Decoder',
        body: "Paste any UUID into the decoder tab to extract the information it contains. For v1 UUIDs, this includes the exact timestamp encoded in the identifier and the node ID derived from the MAC address. For v4 UUIDs, the decoder confirms the version and variant bits. For v5 UUIDs, it verifies the namespace and hash construction. This is useful when debugging distributed systems, auditing third-party API responses, or verifying that identifiers were generated correctly.",
      },
    ],
  },

  'age-calc': {
    metaTitle: 'Age Calculator — Exact Age in Years, Months, Days & Hours | ToolSuite',
    metaDescription:
      'Calculate your exact age in years, months, days, hours, and minutes. Birthday countdown timer, leap year handling, and fun age comparison facts. Free and instant.',
    faqs: [
      {
        question: 'How does the Age Calculator handle leap years?',
        answer:
          "Leap years are handled automatically. If your birthday is February 29th, the calculator uses February 28th on non-leap years — the standard convention used in most legal and medical contexts.",
      },
      {
        question: 'Can I calculate the age between two specific dates?',
        answer:
          'Yes. While the default mode calculates age from your birth date to today, you can also set a custom end date to measure the time between any two dates.',
      },
      {
        question: 'How accurate is the calculation?',
        answer:
          'The calculator uses your device\'s local time for the current moment and accounts for the exact number of days in each month, leap years, and time zones to give a precise result.',
      },
      {
        question: 'What is the birthday countdown?',
        answer:
          'The birthday countdown shows the exact number of days, hours, and minutes remaining until your next birthday, updated in real time.',
      },
      {
        question: 'Does this work for any date in history?',
        answer:
          'Yes. You can calculate the age of any date in history, useful for historical research, genealogy, or document verification.',
      },
    ],
    content: [
      {
        heading: 'Calculate Your Exact Age',
        body: "Most people know their age in whole years, but our Age Calculator goes further. Enter your date of birth and instantly see your precise age broken down into years, months, days, hours, and minutes — updated to the current second. Whether you need your exact age for a legal document, a health assessment, or simple curiosity, the calculator gives you the most accurate result possible based on your device's local clock.",
      },
      {
        heading: 'Leap Year and Calendar Handling',
        body: 'Accurate age calculation is surprisingly complex. Each month has a different number of days, and leap years add an extra day every four years (with century-year exceptions). Our calculator handles all of this automatically. February 29th birthdays use February 28th on non-leap years, which is the legally and medically accepted convention in most countries. You can also enter any custom end date to calculate the elapsed time between two arbitrary dates.',
      },
      {
        heading: 'Birthday Countdown',
        body: 'The birthday countdown shows exactly how many days, hours, and minutes remain until your next birthday, ticking down in real time. Planning a surprise celebration, a milestone party, or just watching the clock — the countdown resets automatically every year on your birthday. For birthdays already passed this year, the countdown automatically calculates until the next occurrence.',
      },
      {
        heading: 'Fun Age Comparisons',
        body: "Once your age is calculated, the tool displays lighthearted comparisons to put the numbers in perspective: approximately how many times your heart has beaten, how many meals you've eaten, how far the Earth has traveled around the sun during your lifetime, and how your age compares to famous historical events. These figures are calculated using well-known averages and are intended to make the passage of time feel tangible and interesting.",
      },
    ],
  },

  'bmi-calc': {
    metaTitle: 'BMI Calculator — Body Mass Index with Healthy Weight Range | ToolSuite',
    metaDescription:
      'Calculate your BMI in metric or imperial units. See your weight category, healthy weight range, and body fat estimate. Free BMI calculator — no signup needed.',
    faqs: [
      {
        question: 'What is a healthy BMI range?',
        answer:
          'The World Health Organization defines a healthy BMI as 18.5 to 24.9. Below 18.5 is underweight, 25.0–29.9 is overweight, and 30.0 or above is obese.',
      },
      {
        question: 'Does the calculator support imperial measurements?',
        answer:
          'Yes. Switch between metric (kg and cm) and imperial (lbs and ft/in) with one click. All calculations adjust automatically.',
      },
      {
        question: 'Is BMI accurate for everyone?',
        answer:
          "BMI is a population-level screening tool, not a clinical diagnosis. It can misclassify muscular athletes as overweight and older adults with low muscle mass as normal weight. Use it as a general indicator and consult a healthcare professional for a complete assessment.",
      },
      {
        question: 'What healthy weight range does the calculator show?',
        answer:
          'After entering your height, the tool automatically displays the full weight range — minimum to maximum — that corresponds to a healthy BMI of 18.5 to 24.9 for your specific height.',
      },
      {
        question: 'Does the BMI Calculator store my data?',
        answer:
          'No. All calculations happen in your browser. No personal health data is sent to any server or stored anywhere outside your device.',
      },
    ],
    content: [
      {
        heading: 'What Is BMI?',
        body: "Body Mass Index (BMI) is a numeric value calculated from your weight divided by the square of your height (kg/m²). Developed in the 1830s by Belgian statistician Adolphe Quetelet, it has become the most widely used population-level weight screening metric in medicine, nutrition, and public health research worldwide. It does not directly measure body fat, but it correlates with more direct fat measurements and is accepted as a practical proxy for weight-related health risk screening.",
      },
      {
        heading: 'BMI Categories',
        body: "The World Health Organization classifies BMI into four categories: Underweight (below 18.5), Normal weight (18.5 to 24.9), Overweight (25.0 to 29.9), and Obese (30.0 and above). Our calculator color-codes your result and shows your distance from the nearest category boundary — so you know not just your current classification but exactly how much weight change would move you to the next category. This makes the number actionable rather than just informational.",
      },
      {
        heading: 'Healthy Weight Range for Your Height',
        body: "Rather than showing a single target number, our calculator displays the complete healthy weight range — minimum to maximum — that corresponds to a BMI of 18.5 to 24.9 for your specific height. This range is more useful than a single point because it acknowledges that many different weights are equally healthy. Knowing your full range helps you set realistic goals and understand that maintaining weight within a band is the aim, not hitting an exact number.",
      },
      {
        heading: 'BMI Limitations',
        body: "BMI is a screening tool, not a clinical diagnosis, and has well-documented limitations. Athletes and heavily muscled individuals often have BMIs in the overweight or obese range despite having low body fat percentages. Conversely, older adults and sedentary individuals can have normal-range BMIs while carrying excess body fat due to muscle loss. For a comprehensive assessment of body composition and metabolic health, consult a healthcare professional who can use additional measurements such as waist circumference, body fat percentage, and blood markers.",
      },
    ],
  },

  'currency-conv': {
    metaTitle: 'Currency Converter — Live Exchange Rates for 150+ Currencies | ToolSuite',
    metaDescription:
      'Convert currencies with live exchange rates updated multiple times daily. Supports 150+ world currencies and major cryptocurrencies. 7-day trend chart. Free, no signup.',
    faqs: [
      {
        question: 'How often are the exchange rates updated?',
        answer:
          'Exchange rates are updated multiple times per day using live data feeds, keeping conversions accurate for daily transactions and financial planning.',
      },
      {
        question: 'Does the converter support cryptocurrency?',
        answer:
          'Yes. Bitcoin (BTC), Ethereum (ETH), and other major cryptocurrencies are included alongside fiat currencies, so you can convert crypto holdings to any world currency in real time.',
      },
      {
        question: 'Can I convert multiple currencies at the same time?',
        answer:
          'Yes. Enter an amount and a source currency and see conversions to multiple target currencies simultaneously — useful for price comparisons across different regional markets.',
      },
      {
        question: 'What does the 7-day trend chart show?',
        answer:
          'The trend chart shows how a selected currency pair has moved over the past 7 days. Hover over any point to see the exact rate at that time, helping you understand recent volatility.',
      },
      {
        question: 'Is this suitable for financial or business use?',
        answer:
          'The rates are sourced from reliable market data and are accurate for general planning and comparison purposes. For regulated financial transactions, always confirm rates with your bank or payment provider at the time of transaction.',
      },
    ],
    content: [
      {
        heading: 'Real-Time Currency Conversion',
        body: "ToolSuite Currency Converter pulls live exchange rates updated multiple times per day to give you accurate conversions across 150+ world currencies. Enter any amount in any currency and the converted value appears instantly — no page refresh, no delay. Whether you're checking prices while shopping online, planning a travel budget, comparing international salaries, or verifying a payment before sending, the clean single-screen interface makes conversions fast and straightforward.",
      },
      {
        heading: 'Convert to 150+ Currencies at Once',
        body: 'Unlike basic converters that show one currency pair at a time, our tool lets you view conversions to multiple currencies simultaneously from a single entered amount. This is especially useful when comparing regional prices across multiple markets, understanding your purchasing power in different countries, or confirming exchange rates before initiating an international wire transfer. The full list includes all major world currencies plus a curated selection of emerging market currencies.',
      },
      {
        heading: '7-Day Trend Chart',
        body: "Understanding whether an exchange rate is high or low requires historical context. The built-in 7-day trend chart shows how the rate between your chosen currency pair has moved over the past week. Hover over any point on the chart to see the exact rate at that moment. If you have flexibility in when you convert — for a large purchase or transfer — the trend chart helps you make a more informed decision about timing.",
      },
      {
        heading: 'Cryptocurrency Support',
        body: "Bitcoin (BTC), Ethereum (ETH), and other major cryptocurrencies are included alongside traditional fiat currencies. This lets you convert crypto holdings to USD, EUR, GBP, or any other world currency in real time. For crypto users who invoice internationally, hold multi-currency portfolios, or need to understand fiat-equivalent values for tax reporting, having fiat and crypto conversions in a single tool removes the need to switch between multiple apps or browser tabs.",
      },
    ],
  },
}

export default TOOL_SEO
