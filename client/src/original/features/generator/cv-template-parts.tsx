// @ts-nocheck
import React from 'react';
// cv-template-parts.tsx — Shared rendering primitives used by all resume templates.

function hexAlpha(hex, alpha) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SEP = ' · '; // Fix 8: centralized separator constant
function SkillItems({ items, primary, accent, sizes, fontFamily, skillStyle, atsMode }) {
  if (!items || items.length === 0) return null;
  const color = atsMode ? '#374151' : (primary || '#374151');
  return (
    <span style={{
      fontSize: `${sizes.body}px`,
      color,
      fontFamily,
      lineHeight: 1.6,
      flexWrap: 'wrap',
      display: 'inline',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }}>
      {items.join(SEP)}
    </span>
  );
}

function SectionHeading({ label, primary, fontFamily, sizes, atsMode }) {
  const color = atsMode ? '#111827' : primary;
  const rule = atsMode ? '#cbd5e1' : hexAlpha(color, 0.28);
  return (
    <div style={{ marginBottom: '10px', paddingBottom: '6px', borderBottom: `1px solid ${rule}`, breakAfter: 'avoid' }}>
      <h2 style={{
        fontSize: `${sizes.secHead}px`, fontWeight: '800', textTransform: 'uppercase',
        letterSpacing: '0.12em', lineHeight: '1.25', color, margin: 0, fontFamily,
        wordBreak: 'break-word', overflowWrap: 'break-word',
      }}>{label}</h2>
    </div>
  );
}

function PreviewBullets({ bullets, fontFamily, sizes, color = '#111827' }) {
  if (!bullets?.length) return null;
  return (
    <div style={{ marginTop: '4px' }}>
      {bullets.filter(Boolean).map((b, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '3px' }}>
          <span style={{ flexShrink: 0, marginTop: '0.45em', width: '4px', height: '4px', borderRadius: '50%', background: color, opacity: 0.7, display: 'inline-block' }} />
          <span style={{ fontSize: `${sizes.body}px`, color, lineHeight: '1.5', fontFamily, wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: 'left', flex: 1 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function ContactLine({ h, fontFamily, sizes, atsMode }) {
  const items = [
    { value: h.email, href: h.email ? `mailto:${h.email}` : '' },
    { value: h.phone, href: h.phone ? `tel:${h.phone.replace(/[^+\d]/g, '')}` : '' },
    { value: h.location, href: '' },
    { value: h.linkedin, href: h.linkedin ? (/^https?:\/\//i.test(h.linkedin) ? h.linkedin : `https://${h.linkedin}`) : '' },
    { value: h.github, href: h.github ? (/^https?:\/\//i.test(h.github) ? h.github : `https://${h.github}`) : '' },
    { value: h.portfolio, href: h.portfolio ? (/^https?:\/\//i.test(h.portfolio) ? h.portfolio : `https://${h.portfolio}`) : '' },
  ].filter(item => item.value);
  if (!items.length) return null;
  const textColor = atsMode ? '#111827' : '#374151';
  const sepColor = atsMode ? '#6b7280' : '#9ca3af';
  return (
    <address style={{ display: 'flex', flexWrap: 'wrap', rowGap: '3px', marginBottom: '8px', alignItems: 'center', fontStyle: 'normal' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          {item.href ? <a href={item.href} style={{ fontSize: `${sizes.contact}px`, color: textColor, fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere', textDecoration: atsMode ? 'underline' : 'none' }}>{item.value}</a> : <span style={{ fontSize: `${sizes.contact}px`, color: textColor, fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{item.value}</span>}
          {i < items.length - 1 && <span aria-hidden="true" style={{ margin: '0 6px', color: sepColor, fontSize: `${sizes.contact - 1}px`, lineHeight: 1 }}>·</span>}
        </span>
      ))}
    </address>
  );
}

function PhotoCircle({ photo, size = 70, border = '#e5e7eb', name = '' }) {
  if (!photo) return null;
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`,
      borderRadius: '50%',
      overflow: 'hidden',           // primary circle clip
      border: `2.5px solid ${border}`,
      flexShrink: 0, alignSelf: 'flex-start',
      display: 'block', position: 'relative',
    }}>
      <img src={photo} alt={name ? `${name} profile photo` : 'Profile photo'} style={{
        width: '100%', height: '100%',
        objectFit: 'cover', display: 'block',
        borderRadius: '50%',         // fallback clip directly on the img
        clipPath: 'circle(50%)',     // second fallback html2canvas does respect
      }} />
    </div>
  );
}

function HobbiesBlock({ hobbies, primary, fontFamily, sizes, atsMode }) {
  if (!hobbies || hobbies.length === 0) return null;
  const color = atsMode ? '#374151' : (primary || '#374151');
  return (
    <p style={{ fontSize: `${sizes.body}px`, color, fontFamily, lineHeight: 1.6, margin: 0, textAlign: 'justify' }}>
      {hobbies.join(SEP)}
    </p>
  );
}

function ReferencesBlock({ references, primary, fontFamily, sizes, atsMode }) {
  if (!references || references.length === 0) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
      {references.map((ref, i) => (
        <div key={i} style={{
          background: '#f8fafc',
          border: `1px solid ${atsMode ? '#e5e7eb' : hexAlpha(primary, 0.18)}`,
          borderLeft: `3px solid ${atsMode ? '#9ca3af' : primary}`,
          borderRadius: '0 6px 6px 0',
          padding: '10px 13px',
        }}>
          <p style={{ fontSize: `${sizes.jobTitle - 0.5}px`, fontWeight: '700', color: '#111827', fontFamily, margin: '0 0 3px' }}>{ref.name}</p>
          {(ref.title || ref.company) && (
            <p style={{ fontSize: `${sizes.body}px`, color: atsMode ? '#4b5563' : primary, fontFamily, margin: '0 0 2px', fontStyle: 'italic' }}>
              {[ref.title, ref.company].filter(Boolean).join(' · ')}
            </p>
          )}
          {ref.relationship && (
            <p style={{ fontSize: `${sizes.date}px`, color: '#9ca3af', fontFamily, margin: '0 0 2px' }}>{ref.relationship}</p>
          )}
          {ref.email && (
            <p style={{ fontSize: `${sizes.date}px`, color: '#6b7280', fontFamily, margin: '0 0 1px' }}>{ref.email}</p>
          )}
          {ref.phone && (
            <p style={{ fontSize: `${sizes.date}px`, color: '#6b7280', fontFamily, margin: 0 }}>{ref.phone}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function AdditionalExpBlock({ items, fontFamily, sizes }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: '4px' }}>
      {items.filter(Boolean).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
          <span style={{ flexShrink: 0, marginTop: '0.45em', width: '4px', height: '4px', borderRadius: '50%', background: '#374151', opacity: 0.7, display: 'inline-block' }} />
          <span style={{ fontSize: `${sizes.body}px`, color: '#374151', lineHeight: '1.6', fontFamily, wordBreak: 'break-word', overflowWrap: 'break-word', flex: 1 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function SummaryBlock({ text, fontFamily, sizes, color = '#374151' }) {
  if (!text) return null;
  const lines = text.split('\n');
  const result = [];
  let bullets = [];

  const flushBullets = (key) => {
    if (bullets.length === 0) return;
    result.push(
      <ul key={`ul-${key}`} style={{ paddingLeft: '16px', margin: '3px 0', listStyleType: 'disc' }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ fontSize: `${sizes.body}px`, color, lineHeight: '1.65', fontFamily, marginBottom: '2px' }}>{b}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets(i);
      result.push(<div key={`sp-${i}`} style={{ height: '5px' }} />);
    } else if (/^[•\-\*]\s*/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[•\-\*]\s*/, ''));
    } else {
      flushBullets(i);
      result.push(
        <p key={i} style={{ fontSize: `${sizes.body}px`, color, lineHeight: '1.7', fontFamily, margin: '0 0 3px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{trimmed}</p>
      );
    }
  });
  flushBullets('end');

  return <div style={{ margin: 0 }}>{result}</div>;
}

function CustomBlock({ custom, primary, fontFamily, sizes, atsMode, secHFn }) {
  if (!custom || !custom.title) return null;
  return (
    <div style={{ marginBottom: '13px' }}>
      {secHFn(custom.title)}
      {custom.body && (
        <p style={{ fontSize: `${sizes.body}px`, color: '#111827', lineHeight: '1.65', fontFamily, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: 'justify' }}>
          {custom.body}
        </p>
      )}
    </div>
  );
}

export { hexAlpha, SEP, SkillItems, SectionHeading, PreviewBullets, ContactLine, PhotoCircle, HobbiesBlock, ReferencesBlock, CustomBlock, AdditionalExpBlock, SummaryBlock };
