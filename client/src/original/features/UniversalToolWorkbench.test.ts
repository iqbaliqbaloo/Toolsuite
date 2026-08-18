import { describe, expect, it } from 'vitest';
import { calculate } from './UniversalToolWorkbench';

describe('UniversalToolWorkbench calculations', () => {
  it('calculates compound growth with contributions', () => {
    const result = calculate('compound-interest', { principal: '1000', monthly: '100', rate: '12', years: '1', frequency: '12' });
    expect(result.body).toContain('Estimated balance:');
    expect(result.body).toContain('Total contributions:');
  });

  it('calculates fixed mortgage payment and interest', () => {
    const result = calculate('mortgage-amortization', { principal: '100000', rate: '6', years: '30', extra: '0' });
    expect(result.body).toContain('Principal + interest payment: $599.55');
    expect(result.body).toContain('Estimated scheduled interest:');
  });

  it('formats a valid UTM URL', () => {
    const result = calculate('utm-builder', { url: 'https://example.com/page?lang=en', source: 'Google', medium: 'CPC', campaign: 'Spring Sale', content: 'Hero' });
    expect(result.body).toContain('utm_source=Google');
    expect(result.body).toContain('lang=en');
  });

  it('converts JSON rows to escaped CSV', () => {
    const result = calculate('json-csv', { json: '[{"name":"Ada","role":"Engineer"}]' });
    expect(result.download?.content).toContain('"name"');
    expect(result.body).toContain('Ada');
  });

  it('calculates IPv4 subnet boundaries', () => {
    const result = calculate('subnet-calc', { cidr: '192.168.10.0/24' });
    expect(result.body).toContain('Network: 192.168.10.0');
    expect(result.body).toContain('Broadcast: 192.168.10.255');
    expect(result.body).toContain('Usable hosts: 254');
  });
});
