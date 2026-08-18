export interface ToolTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export const TOOL_TABLES: Record<string, ToolTable> = {
  'mortgage-amortization': {
    caption: 'Mortgage estimate inputs and what they represent',
    headers: ['Input or output', 'What it means', 'Review before relying on it'],
    rows: [
      ['Loan amount', 'Principal borrowed before interest', 'Confirm fees and financed costs with the lender'],
      ['Annual interest', 'Nominal fixed rate used in the estimate', 'Variable or lender-specific rates may differ'],
      ['Term', 'Number of years used to spread repayment', 'Compare total interest, not only monthly payment'],
      ['Extra principal', 'Additional amount applied to the balance', 'Check prepayment rules and cash-flow impact'],
    ],
  },
  'salary-after-tax': {
    caption: 'Salary estimate assumptions',
    headers: ['Value', 'Included in the estimate', 'Why actual pay may differ'],
    rows: [
      ['Gross income', 'Starting pay before deductions', 'Pay frequency and bonus treatment vary'],
      ['Deductions', 'User-supplied benefits or contributions', 'Payroll plans and eligibility differ'],
      ['Effective tax rate', 'Simplified combined estimate', 'Brackets, credits, caps, and local taxes vary'],
      ['Net pay', 'Estimated remaining income', 'Not an official payslip or tax filing result'],
    ],
  },
  'crontab-generator': {
    caption: 'The five cron fields',
    headers: ['Field', 'Typical range', 'Question it answers'],
    rows: [
      ['Minute', '0–59', 'At which minute?'],
      ['Hour', '0–23', 'At which hour?'],
      ['Day of month', '1–31', 'On which calendar day?'],
      ['Month', '1–12', 'During which month?'],
      ['Day of week', '0–7', 'On which weekday?'],
    ],
  },
  'subnet-calc': {
    caption: 'Common IPv4 CIDR reference',
    headers: ['CIDR', 'Total addresses', 'Typical usable-host context'],
    rows: [
      ['/30', '4', 'Small point-to-point style block; policy may reserve addresses'],
      ['/29', '8', 'Small infrastructure segment'],
      ['/24', '256', 'Common private LAN-sized block'],
      ['/16', '65,536', 'Large private network; usually subdivided'],
    ],
  },
  'json-csv': {
    caption: 'JSON shapes and CSV outcomes',
    headers: ['Input shape', 'CSV behavior', 'Best use'],
    rows: [
      ['Array of objects', 'Columns come from object keys', 'API exports and tabular analysis'],
      ['Nested object', 'Nested value becomes text', 'Quick inspection, not relational modeling'],
      ['Missing key', 'Blank cell for that row', 'Sparse datasets with optional fields'],
      ['Comma or quote in value', 'Field is escaped and quoted', 'Safe spreadsheet import'],
    ],
  },
};

export function getToolTable(toolId: string) {
  return TOOL_TABLES[toolId];
}
