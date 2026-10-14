import React from 'react';
import { __ } from '@wordpress/i18n';
import { Icon } from './icons';

const CURRENCY_CODE_MAP = {
  USD: '$',
  CAD: '$',
  AUD: '$',
  NZD: '$',
  SGD: '$',
  HKD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  BDT: '৳',
  NGN: '₦',
  PHP: '₱',
  KRW: '₩',
  RUB: '₽',
  TRY: '₺',
  THB: '฿',
  BRL: 'R$',
};

// Compact display: 12000 → "12k", 1500000 → "1.5M".
const abbreviateAmount = (n) => {
  const trim = (x) => parseFloat(x.toFixed(1)).toString();
  const abs = Math.abs(n);
  if (abs >= 1e9) return trim(n / 1e9) + 'B';
  if (abs >= 1e6) return trim(n / 1e6) + 'M';
  if (abs >= 1e3) return trim(n / 1e3) + 'k';
  return parseFloat(n.toFixed(2)).toLocaleString('en-US');
};

// Parse the FIRST numeric token and honour a k/m suffix — mirrors the app so a
// value like "67+12K" reads as 67 and "100k" as 100000.
const parseSalary = (val) => {
  if (val === null || val === undefined) return null;
  const s = String(val).toLowerCase().trim();
  if (!s) return null;
  const m = s.match(/(\d[\d,]*\.?\d*)/);
  if (!m) return null;
  let num = parseFloat(m[1].replace(/,/g, ''));
  if (isNaN(num)) return null;
  const after = s.slice(m.index + m[1].length).replace(/^\s+/, '');
  if (after.charAt(0) === 'k') num *= 1000;
  else if (after.charAt(0) === 'm') num *= 1000000;
  return num;
};

// Display value the way the app does: first number, k/m applied, compacted,
// with a detected currency prefix/suffix.
const formatSalaryCompact = (val) => {
  if (val === null || val === undefined) return '—';
  const s = String(val).trim();
  if (!s) return '—';
  const m = s.match(/(\d[\d,]*\.?\d*)/);
  if (!m) return s; // no parseable number — show raw value
  let num = parseFloat(m[1].replace(/,/g, ''));
  if (isNaN(num)) return s;
  const after = s
    .slice(m.index + m[1].length)
    .replace(/^\s+/, '')
    .toLowerCase();
  if (after.charAt(0) === 'k') num *= 1000;
  else if (after.charAt(0) === 'm') num *= 1000000;

  let prefix = '';
  let suffix = '';
  const symMatch = s.match(/[$€£¥₹৳₦₱₩₪₫₽₺฿]/);
  if (symMatch) {
    prefix = symMatch[0];
  } else {
    const codeMatch = s.toUpperCase().match(/\b([A-Z]{3})\b/);
    if (codeMatch) {
      if (CURRENCY_CODE_MAP[codeMatch[1]])
        prefix = CURRENCY_CODE_MAP[codeMatch[1]];
      else suffix = ' ' + codeMatch[1];
    }
  }
  return prefix + abbreviateAmount(num) + suffix;
};

/**
 * Right column — Salary card with current / expected and a delta indicator.
 * Parsing/formatting matches the app's `formatSalaryCompact` + `salaryDelta`.
 */
const SalaryCard = ({ candidateDetails }) => {
  const candidate = candidateDetails?.candidate || {};
  const user = candidate?.user || {};
  const current = user?.current_salary;
  const expected = candidate?.expected_salary;

  const currentDisplay = formatSalaryCompact(current);
  const expectedDisplay = formatSalaryCompact(expected);

  // Delta — k/m-aware; arrow + colour follow the sign, bar fills by ratio.
  let delta = null;
  const cur = parseSalary(current);
  const exp = parseSalary(expected);
  if (cur !== null && exp !== null && cur > 0 && exp > 0) {
    const pct = Math.round(((exp - cur) / cur) * 100);
    const minV = Math.min(cur, exp);
    const maxV = Math.max(cur, exp);
    delta = {
      pct: Math.abs(pct),
      positive: pct >= 0,
      fill: maxV > 0 ? Math.round((minV / maxV) * 100) : 0,
    };
  }

  return (
    <section className="ejc-card card-pad">
      <h2 className="card-h" style={{ marginBottom: '16px' }}>
        {__('Salary', 'easyjobs')}
      </h2>
      <div className="sal-grid">
        <div className="sal-cell">
          <span className="sal-lbl">{__('Current', 'easyjobs')}</span>
          <span className="sal-val">{currentDisplay}</span>
        </div>
        <div className="sal-cell right">
          <span className="sal-lbl">{__('Expected', 'easyjobs')}</span>
          <span className="sal-val">{expectedDisplay}</span>
        </div>
      </div>
      {delta != null ? (
        <div className="sal-delta">
          <span className="sal-bar">
            <i style={{ width: `${delta.fill}%` }}></i>
          </span>
          <span className={`up ${delta.positive ? '' : 'down'}`}>
            <Icon name={delta.positive ? 'up' : 'down'} />
            {delta.positive ? '+' : '-'}
            {delta.pct}%
          </span>{' '}
          {__('expected', 'easyjobs')}
        </div>
      ) : null}
    </section>
  );
};

export default SalaryCard;
