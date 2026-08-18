// @ts-nocheck
import React from 'react';
import { EMPTY_DATA } from './cv-core';
import { hexAlpha, SectionHeading, PreviewBullets, SkillItems, ContactLine, PhotoCircle, HobbiesBlock, ReferencesBlock, CustomBlock, AdditionalExpBlock, SummaryBlock } from './cv-template-parts';

// ─── Template 7: Elegant ─────────────────────────────────────────────────────
function CvElegantTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#4b3f2f' : theme.primary;
  const accent  = atsMode ? '#6b7280' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const elegantSecH = (label) => (
    <div style={{ textAlign:'center', margin:'0 0 12px' }}>
      <h2 style={{ fontSize:`${sizes.secHead - 1}px`, fontWeight:'400', textTransform:'uppercase', letterSpacing:'0.22em', color:atsMode?'#374151':primary, display:'inline-block', fontFamily, margin:'0 0 6px' }}>{label}</h2>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', justifyContent:'center' }}>
        <div style={{ flex:1, height:'1px', background:atsMode?'#d1d5db':hexAlpha(primary,0.25) }}/>
        <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:atsMode?'#d1d5db':hexAlpha(primary,0.4), display:'inline-block' }}/>
        <div style={{ flex:1, height:'1px', background:atsMode?'#d1d5db':hexAlpha(primary,0.25) }}/>
      </div>
    </div>
  );
  const allContact = [h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ');
  return (
    <div style={{ fontFamily, lineHeight:1.55, color:'#111827', padding:'40px 48px', background:'#ffffff' }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'28px', paddingBottom:'20px', borderBottom:`1px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.25)}` }}>
        {h.photo && <div style={{ display:'flex', justifyContent:'center', marginBottom:'14px' }}><div style={{ borderRadius:'50%', overflow:'hidden', width:'82px', height:'82px', border:`2px solid ${atsMode?'#d1d5db':hexAlpha(primary,0.4)}` }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div></div>}
        <h1 style={{ fontSize:`${sizes.name}px`, fontWeight:'300', color:'#111827', letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 6px', fontFamily, wordBreak:'break-word' }}>{h.name||'Your Name'}</h1>
        {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:'400', margin:'0 0 12px', fontFamily }}>{h.title}</p>}
        {allContact && <p style={{ fontSize:`${sizes.contact - 0.5}px`, color:'#6b7280', letterSpacing:'0.05em', fontFamily, lineHeight:1.7 }}>{allContact}</p>}
      </div>
      {data.summary && <div data-cv-sec="summary" style={{ marginBottom:'22px' }}>{elegantSecH('Profile')}<div style={{ textAlign:'center', maxWidth:'580px', margin:'0 auto' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
      {data.experience.length>0 && (
        <div data-cv-sec="experience" style={{ marginBottom:'22px' }}>{elegantSecH('Experience')}
          {data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'600', color:'#111827', fontFamily }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, fontStyle:'italic', flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, color:atsMode?'#374151':primary, fontStyle:'italic', margin:'1px 0 4px', fontFamily, fontWeight:'500' }}>{[exp.company,exp.location].filter(Boolean).join(' · ')}</p>
              <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:'flex', gap:'36px' }}>
        <div style={{ flex:3 }}>
          {data.education.length>0 && (
            <div style={{ marginBottom:'22px' }}>{elegantSecH('Education')}
              {data.education.map((edu,i)=>(
                <div key={i} style={{ marginBottom:'9px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2px 8px' }}>
                    <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'600', color:'#111827', fontFamily }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</span>
                    <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, fontStyle:'italic', flexShrink:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</span>
                  </div>
                  <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily, fontStyle:'italic', margin:'1px 0' }}>{[edu.institution,edu.gpa?`GPA ${edu.gpa}`:''].filter(Boolean).join(' · ')}</p>
                </div>
              ))}
            </div>
          )}
          {data.projects.length>0 && (
            <div style={{ marginBottom:'22px' }}>{elegantSecH('Projects')}
              {data.projects.map((proj,i)=>(
                <div key={i} style={{ marginBottom:'11px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'600', color:'#111827', fontFamily }}>{proj.name}</span>
                      {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontStyle:'italic', fontFamily }}>{proj.techStack.join(', ')}</span>}
                    </div>
                    {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, fontStyle:'italic' }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
                  <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex:2 }}>
          {data.skills.length>0 && (
            <div style={{ marginBottom:'22px' }}>{elegantSecH('Skills')}
              {data.skills.map((cat,i)=>(
                <div key={i} style={{ marginBottom:'6px' }}>
                  {cat.name && <span style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontStyle:'italic', fontFamily }}>{cat.name}: </span>}
                  <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
                </div>
              ))}
            </div>
          )}
          {data.languages.length>0 && (
            <div style={{ marginBottom:'22px' }}>{elegantSecH('Languages')}
              {data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'0 0 4px' }}>{l.language}<span style={{ color:'#6b7280' }}> — {l.proficiency}</span></p>)}
            </div>
          )}
          {data.certifications.length>0 && (
            <div>{elegantSecH('Certifications')}
              {data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'4px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280' }}> — {c.issuer}</span>}</p>)}
            </div>
          )}
        </div>
      </div>
      {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'22px' }}>{elegantSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'22px' }}>{elegantSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'22px' }}>{elegantSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>elegantSecH(label)}/>
    </div>
  );
}

// ─── Template 8: Compact ─────────────────────────────────────────────────────
function CvCompactTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const s = { ...sizes, body:sizes.body - 0.5, secHead:sizes.secHead - 0.5, jobTitle:sizes.jobTitle - 0.5 };
  const h = data?.header || EMPTY_DATA.header;
  const cmpSecH = (label) => (
    <div style={{ marginBottom:'7px' }}>
      <h2 style={{ fontSize:`${s.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:primary, margin:'0 0 4px', fontFamily, display:'flex', alignItems:'center', gap:'7px' }}>
        <span style={{ width:'3px', height:`${s.secHead + 2}px`, background:primary, borderRadius:'2px', flexShrink:0, display:'inline-block' }}/>
        {label}
      </h2>
      <div style={{ height:'1px', background:atsMode?'#e5e7eb':hexAlpha(primary,0.18), marginLeft:'10px' }}/>
    </div>
  );
  const allContact = [h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean);
  return (
    <div style={{ fontFamily, lineHeight:1.38, color:'#111827', background:'#ffffff' }}>
      <div style={{ background:atsMode?'#111827':primary, padding:'18px 32px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'center', gap:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', flex:1, minWidth:0 }}>
            {h.photo && <div style={{ flexShrink:0, borderRadius:'50%', overflow:'hidden', width:'66px', height:'66px', border:'2px solid rgba(255,255,255,0.3)' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
            <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
              <h1 style={{ fontSize:`${sizes.name - 1}px`, fontWeight:'700', color:'#ffffff', margin:0, fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
              {h.title && <p style={{ fontSize:`${s.body}px`, color:'rgba(255,255,255,0.75)', fontWeight:'400', margin:'3px 0 0', fontFamily }}>{h.title}</p>}
            </div>
          </div>
          <p style={{ fontSize:`${s.body - 0.5}px`, color:'rgba(255,255,255,0.6)', textAlign:'right', fontFamily, flexShrink:0, lineHeight:1.7 }}>{allContact.join(' · ')}</p>
        </div>
      </div>
      <div style={{ display:'flex', padding:'16px 32px 32px', gap:'24px' }}>
        <div style={{ flex:3 }}>
          {data.summary && <div style={{ marginBottom:'13px' }}>{cmpSecH('Summary')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={s} /></div>}
          {data.experience.length>0 && (
            <div style={{ marginBottom:'13px' }}>{cmpSecH('Experience')}
              {data.experience.map((exp,i)=>(
                <div key={i} style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2px 8px' }}>
                    <span style={{ fontSize:`${s.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                    <span style={{ fontSize:`${s.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
                  </div>
                  <p style={{ fontSize:`${s.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 2px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
                  <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={s}/>
                </div>
              ))}
            </div>
          )}
          {data.projects.length>0 && (
            <div style={{ marginBottom:'13px' }}>{cmpSecH('Projects')}
              {data.projects.map((proj,i)=>(
                <div key={i} style={{ marginBottom:'8px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'6px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:`${s.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                      {proj.techStack.length>0 && <span style={{ fontSize:`${s.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                    </div>
                    {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${s.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize:`${s.body}px`, color:'#374151', margin:'1px 0', fontFamily, wordBreak:'break-word' }}>{proj.description}</p>}
                  <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={s}/>
                </div>
              ))}
            </div>
          )}
          {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'13px' }}>{cmpSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={s}/></div>}
        </div>
        <div style={{ flex:2 }}>
          {data.education.length>0 && (
            <div style={{ marginBottom:'13px' }}>{cmpSecH('Education')}
              {data.education.map((edu,i)=>(
                <div key={i} style={{ marginBottom:'9px' }}>
                  <p style={{ fontSize:`${s.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                  <p style={{ fontSize:`${s.body}px`, color:'#374151', fontFamily, margin:0 }}>{edu.institution}</p>
                  <p style={{ fontSize:`${s.date}px`, color:'#6b7280', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}{edu.gpa?` · ${edu.gpa}`:''}</p>
                </div>
              ))}
            </div>
          )}
          {data.skills.length>0 && (
            <div style={{ marginBottom:'13px' }}>{cmpSecH('Skills')}
              {data.skills.map((cat,i)=>(
                <div key={i} style={{ marginBottom:'6px' }}>
                  {cat.name && <p style={{ fontSize:`${s.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
                  <SkillItems items={cat.items} primary={primary} accent={accent} sizes={s} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
                </div>
              ))}
            </div>
          )}
          {data.languages.length>0 && <div style={{ marginBottom:'13px' }}>{cmpSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${s.body}px`, color:'#374151', marginBottom:'3px', fontFamily }}>{l.language}<span style={{ color:'#6b7280' }}> ({l.proficiency})</span></p>)}</div>}
          {data.certifications.length>0 && <div style={{ marginBottom:'13px' }}>{cmpSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${s.body}px`, color:'#111827', marginBottom:'3px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280', fontWeight:'400' }}> — {c.issuer}</span>}</p>)}</div>}
        </div>
      </div>
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ padding:'0 32px 14px' }}>{cmpSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={s} atsMode={atsMode}/></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ padding:'0 32px 14px' }}>{cmpSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={s} atsMode={atsMode}/></div>}
      {data.custom?.title && <div style={{ padding:'0 32px 20px' }}><CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={s} atsMode={atsMode} secHFn={label=>cmpSecH(label)}/></div>}
    </div>
  );
}

// ─── Template 9: Bold ────────────────────────────────────────────────────────
function CvBoldTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const boldSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
      <div style={{ width:'5px', height:`${sizes.secHead + 7}px`, background:atsMode?'#111827':primary, borderRadius:'3px', flexShrink:0 }}/>
      <h2 style={{ fontSize:`${sizes.secHead + 1}px`, fontWeight:'900', textTransform:'uppercase', letterSpacing:'0.07em', color:'#111827', margin:0, fontFamily }}>{label}</h2>
    </div>
  );
  const allContact = [h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean);
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827', padding:'36px 44px', background:'#ffffff' }}>
      <div style={{ marginBottom:'24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px', marginBottom:'10px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 10}px`, fontWeight:'900', color:'#111827', margin:'0 0 6px', fontFamily, lineHeight:1.0, letterSpacing:'-0.03em', wordBreak:'break-word' }}>{h.name||'YOUR NAME'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine + 1}px`, fontWeight:'700', margin:0, color:atsMode?'#374151':primary, fontFamily, textTransform:'uppercase', letterSpacing:'0.08em', wordBreak:'break-word' }}>{h.title}</p>}
          </div>
          {h.photo && <div style={{ flexShrink:0, borderRadius:'50%', overflow:'hidden', width:'88px', height:'88px', border:`3px solid ${atsMode?'#d1d5db':primary}` }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
        <div style={{ height:'4px', background:atsMode?'#111827':`linear-gradient(to right, ${primary}, ${accent||primary}, transparent)`, borderRadius:'3px', margin:'8px 0' }}/>
        {allContact.length>0 && <p style={{ fontSize:`${sizes.contact}px`, color:'#6b7280', fontFamily, lineHeight:1.7, wordBreak:'break-word', margin:0 }}>{allContact.join('   ·   ')}</p>}
      </div>
      {data.summary && <div style={{ marginBottom:'20px' }}>{boldSecH('Summary')}<div style={{ paddingLeft:'15px' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
      {data.experience.length>0 && (
        <div style={{ marginBottom:'20px' }}>{boldSecH('Experience')}
          {data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'13px', paddingLeft:'15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle + 1}px`, fontWeight:'800', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(' · ')}{exp.employmentType?` · ${exp.employmentType}`:''}</p>
              <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:'flex', gap:'32px' }}>
        <div style={{ flex:3 }}>
          {data.education.length>0 && (
            <div style={{ marginBottom:'20px' }}>{boldSecH('Education')}
              {data.education.map((edu,i)=>(
                <div key={i} style={{ marginBottom:'9px', paddingLeft:'15px' }}>
                  <p style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                  <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily, margin:0 }}>{[edu.institution,edu.location].filter(Boolean).join(', ')}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
                  <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
                </div>
              ))}
            </div>
          )}
          {data.projects.length>0 && (
            <div style={{ marginBottom:'20px' }}>{boldSecH('Projects')}
              {data.projects.map((proj,i)=>(
                <div key={i} style={{ marginBottom:'10px', paddingLeft:'15px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'800', color:'#111827', fontFamily }}>{proj.name}</span>
                      {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                    </div>
                    {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
                  <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
                </div>
              ))}
            </div>
          )}
          {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'20px' }}>{boldSecH('Additional Experience')}<div style={{ paddingLeft:'15px' }}><AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div></div>}
        </div>
        <div style={{ flex:2 }}>
          {data.skills.length>0 && (
            <div style={{ marginBottom:'20px' }}>{boldSecH('Skills')}
              {data.skills.map((cat,i)=>(
                <div key={i} style={{ marginBottom:'7px', paddingLeft:'15px' }}>
                  {cat.name && <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', marginBottom:'3px', fontFamily }}>{cat.name}</p>}
                  <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
                </div>
              ))}
            </div>
          )}
          {data.languages.length>0 && <div style={{ marginBottom:'20px' }}>{boldSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', paddingLeft:'15px', marginBottom:'3px', fontFamily }}>{l.language}<span style={{ color:'#6b7280' }}> ({l.proficiency})</span></p>)}</div>}
          {data.certifications.length>0 && <div style={{ marginBottom:'20px' }}>{boldSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#111827', paddingLeft:'15px', marginBottom:'3px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280', fontWeight:'400' }}> — {c.issuer}</span>}</p>)}</div>}
        </div>
      </div>
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'20px' }}>{boldSecH('References')}<div style={{ paddingLeft:'15px' }}><ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'20px' }}>{boldSecH('Hobbies & Interests')}<div style={{ paddingLeft:'15px' }}><HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
      <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>boldSecH(label)}/>
    </div>
  );
}

// ─── Template 10: Academic ────────────────────────────────────────────────────
function CvAcademicTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const acaSecH = (label) => (
    <div style={{ marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.14em', color:primary, margin:'0 0 5px', fontFamily }}>{label}</h2>
      <div style={{ height:'1.5px', background:`linear-gradient(to right, ${atsMode?'#374151':primary}, ${hexAlpha(atsMode?'#374151':primary,0)})` }}/>
    </div>
  );
  const allContact = [h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean);
  return (
    <div style={{ fontFamily, lineHeight:1.55, color:'#111827', padding:'36px 48px', background:'#ffffff' }}>
      <div style={{ borderBottom:'2px solid #111827', paddingBottom:'14px', marginBottom:'18px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'16px' }}>
        <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
          <h1 style={{ fontSize:`${sizes.name}px`, fontWeight:'700', color:'#111827', margin:'0 0 4px', fontFamily, textTransform:'uppercase', letterSpacing:'0.04em', wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, margin:'0 0 8px', fontFamily }}>{h.title}</p>}
          <p style={{ fontSize:`${sizes.contact}px`, color:'#6b7280', fontFamily, margin:0, lineHeight:1.7 }}>{allContact.join(' | ')}</p>
        </div>
        {h.photo && <div style={{ flexShrink:0, borderRadius:'50%', overflow:'hidden', width:'76px', height:'76px', border:`2px solid ${atsMode?'#d1d5db':hexAlpha(primary,0.45)}` }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
      </div>
      {data.summary && <div style={{ marginBottom:'16px' }}>{acaSecH('Summary')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
      {data.experience.length>0 && (
        <div style={{ marginBottom:'16px' }}>{acaSecH('Experience')}
          {data.experience.map((exp,i)=>(
            <div key={i} style={{ display:'flex', gap:'16px', marginBottom:'13px' }}>
              <div style={{ width:'96px', flexShrink:0, textAlign:'right', paddingTop:'1px' }}>
                <p style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, fontStyle:'italic', margin:0, lineHeight:1.5 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' –\n')}</p>
              </div>
              <div style={{ flex:1, borderLeft:`1.5px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.3)}`, paddingLeft:'14px' }}>
                <p style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px', wordBreak:'break-word' }}>{exp.jobTitle}</p>
                <p style={{ fontSize:`${sizes.body}px`, color:atsMode?'#374151':primary, fontStyle:'italic', margin:'0 0 3px', fontFamily, fontWeight:'500' }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
                <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            </div>
          ))}
        </div>
      )}
      {data.education.length>0 && (
        <div style={{ marginBottom:'16px' }}>{acaSecH('Education')}
          {data.education.map((edu,i)=>(
            <div key={i} style={{ display:'flex', gap:'16px', marginBottom:'10px' }}>
              <div style={{ width:'96px', flexShrink:0, textAlign:'right', paddingTop:'1px' }}>
                <p style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, fontStyle:'italic', margin:0 }}>{[edu.startYear,edu.expected?`Exp. ${edu.endYear}`:edu.endYear].filter(Boolean).join(' – ')}</p>
              </div>
              <div style={{ flex:1, borderLeft:`1.5px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.3)}`, paddingLeft:'14px' }}>
                <p style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontStyle:'italic', fontFamily, margin:0 }}>{[edu.institution,edu.location].filter(Boolean).join(', ')}{edu.gpa?` · GPA: ${edu.gpa}`:''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:'flex', gap:'28px' }}>
        <div style={{ flex:3 }}>
          {data.projects.length>0 && (
            <div style={{ marginBottom:'16px' }}>{acaSecH('Research / Projects')}
              {data.projects.map((proj,i)=>(
                <div key={i} style={{ marginBottom:'11px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                      <p style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily, margin:0 }}>{proj.name}</p>
                      {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontStyle:'italic', fontFamily }}>{proj.techStack.join(', ')}</span>}
                    </div>
                    {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, fontStyle:'italic' }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
                  <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
                </div>
              ))}
            </div>
          )}
          {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'16px' }}>{acaSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        </div>
        <div style={{ flex:2 }}>
          {data.skills.length>0 && (
            <div style={{ marginBottom:'16px' }}>{acaSecH('Skills')}
              {data.skills.map((cat,i)=>(
                <div key={i} style={{ marginBottom:'6px' }}>
                  {cat.name && <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 2px' }}>{cat.name}</p>}
                  <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
                </div>
              ))}
            </div>
          )}
          {data.certifications.length>0 && <div style={{ marginBottom:'16px' }}>{acaSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'4px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280', fontWeight:'400' }}> — {c.issuer}</span>}{c.issueDate&&` (${c.issueDate})`}</p>)}</div>}
          {data.languages.length>0 && <div style={{ marginBottom:'16px' }}>{acaSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'3px', fontFamily }}>{l.language}<span style={{ color:'#6b7280' }}> — {l.proficiency}</span></p>)}</div>}
        </div>
      </div>
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'16px' }}>{acaSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'16px' }}>{acaSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>acaSecH(label)}/>
    </div>
  );
}

// ─── Template 11: Timeline ────────────────────────────────────────────────────
function CvTimelineTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const tlSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
      <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:primary, flexShrink:0, boxShadow:`0 0 0 3px ${hexAlpha(primary,0.18)}` }}/>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:primary, margin:0, fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ flex:1, height:'1px', background:atsMode?'#e5e7eb':hexAlpha(primary,0.22) }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.48, color:'#111827', padding:'36px 48px', width:'100%', boxSizing:'border-box', overflowX:'hidden', background:'#ffffff' }}>
      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', marginBottom:'26px', paddingBottom:'20px', borderBottom:`3px solid ${atsMode?'#111827':primary}`, gap:'16px' }}>
        <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
          <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'800', color:'#111827', margin:'0 0 4px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, fontWeight:'600', margin:'0 0 10px', fontFamily }}>{h.title}</p>}
          <p style={{ fontSize:`${sizes.contact}px`, color:'#6b7280', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
        </div>
        {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'82px', height:'82px', border:`3px solid ${atsMode?'#d1d5db':primary}`, flexShrink:0, alignSelf:'flex-start' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/></div>}
      </div>
      {data.summary && <div style={{ marginBottom:'20px' }}>{tlSecH('Summary')}<div style={{ paddingLeft:'20px' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
      {data.experience.length>0 && (
        <div style={{ marginBottom:'20px' }}>{tlSecH('Experience')}
          <div style={{ position:'relative', paddingLeft:'22px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.25)}` }}>
            {data.experience.map((exp,i)=>(
              <div key={i} style={{ position:'relative', marginBottom:'14px' }}>
                <div style={{ position:'absolute', left:'-27px', top:'5px', width:'10px', height:'10px', borderRadius:'50%', background:atsMode?'#374151':primary, border:'2px solid #ffffff', boxShadow:`0 0 0 2px ${hexAlpha(atsMode?'#374151':primary,0.3)}` }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px', marginBottom:'1px' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
                  <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
                </div>
                <p style={{ fontSize:`${sizes.body}px`, color:atsMode?'#374151':primary, fontWeight:'600', margin:'0 0 3px', fontFamily }}>{[exp.company,exp.location,exp.employmentType].filter(Boolean).join('  ·  ')}</p>
                <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.projects.length>0 && (
        <div style={{ marginBottom:'20px' }}>{tlSecH('Projects')}
          <div style={{ position:'relative', paddingLeft:'22px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(accent||primary,0.3)}` }}>
            {data.projects.map((proj,i)=>(
              <div key={i} style={{ position:'relative', marginBottom:'11px' }}>
                <div style={{ position:'absolute', left:'-27px', top:'5px', width:'10px', height:'10px', borderRadius:'2px', background:atsMode?'#374151':accent||primary, border:'2px solid #ffffff' }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px', marginBottom:'1px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:'7px' }}>
                    <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                    {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                  </div>
                  {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                </div>
                {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'0 0 2px' }}>{proj.description}</p>}
                <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        </div>
      )}
      {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'20px' }}>{tlSecH('Additional Experience')}<div style={{ paddingLeft:'20px' }}><AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div></div>}
      {(data.education.length>0||data.skills.length>0) && (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'24px', marginBottom:'18px' }}>
          {data.education.length>0 && <div>{tlSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'9px', paddingLeft:'12px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.3)}` }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.skills.length>0 && <div>{tlSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'7px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>))}</div>}
        </div>
      )}
      {data.certifications.length>0 && <div style={{ marginBottom:'16px' }}>{tlSecH('Certifications')}<div style={{ display:'flex', flexDirection:'column', gap:'3px', paddingLeft:'20px' }}>{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#111827', fontFamily, margin:0 }}><strong>{c.name}</strong>{c.issuer&&<span style={{ fontWeight:'400', color:'#6b7280' }}> — {c.issuer}</span>}</p>)}</div></div>}
      {data.languages.length>0 && <div style={{ marginBottom:'16px' }}>{tlSecH('Languages')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, wordBreak:'break-word', paddingLeft:'20px' }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'16px' }}>{tlSecH('References')}<div style={{ paddingLeft:'20px' }}><ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'16px' }}>{tlSecH('Hobbies & Interests')}<div style={{ paddingLeft:'20px' }}><HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
      <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>tlSecH(label)}/>
    </div>
  );
}

// ─── Template 12: Sidebar Pro ─────────────────────────────────────────────────
function CvSidebarRightTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const sidebarBg   = atsMode ? '#1e293b' : theme.sidebar;
  const sidebarText = theme.sidebarText || '#ffffff';
  const primary     = atsMode ? '#111827' : theme.primary;
  const accent      = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const mainSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'10px' }}>
      <div style={{ width:'3px', height:`${sizes.secHead + 6}px`, background:atsMode?'#374151':primary, borderRadius:'2px', flexShrink:0 }}/>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.09em', color:'#111827', margin:0, fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ flex:1, height:'1px', background:'#e5e7eb' }}/>
    </div>
  );
  const sideSecH = (label) => <h3 style={{ fontSize:`${sizes.secHead - 1}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.13em', color:hexAlpha(sidebarText,0.48), margin:'0 0 8px', fontFamily, borderBottom:`1px solid ${hexAlpha(sidebarText,0.14)}`, paddingBottom:'5px' }}>{label}</h3>;
  const contactItems = [{label:'Email',v:h.email},{label:'Phone',v:h.phone},{label:'Location',v:h.location},{label:'LinkedIn',v:h.linkedin},{label:'GitHub',v:h.github},{label:'Portfolio',v:h.portfolio}].filter(i=>i.v);
  return (
    <div style={{ fontFamily, lineHeight:1.45, display:'flex', minHeight:'1122px', width:'100%', boxSizing:'border-box', overflowX:'hidden' }}>
      <div style={{ flex:1, padding:'32px 30px 40px', minWidth:0 }}>
        <div style={{ marginBottom:'22px', paddingBottom:'16px', borderBottom:`2.5px solid ${atsMode?'#111827':primary}` }}>
          <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'800', color:'#111827', margin:'0 0 4px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, fontWeight:'600', margin:0, fontFamily }}>{h.title}</p>}
        </div>
        {data.summary && <div style={{ marginBottom:'18px' }}>{mainSecH('Summary')}<div style={{ paddingLeft:'12px' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
        {data.experience.length>0 && <div style={{ marginBottom:'18px' }}>{mainSecH('Experience')}{data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:'12px', paddingLeft:'12px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.3)}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
              <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
              <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
            </div>
            <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
            <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
          </div>))}</div>}
        {data.projects.length>0 && <div style={{ marginBottom:'18px' }}>{mainSecH('Projects')}{data.projects.map((proj,i)=>(
          <div key={i} style={{ marginBottom:'10px', paddingLeft:'12px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(accent||primary,0.35)}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
              <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:'6px' }}>
                <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
              </div>
              {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
            </div>
            {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
            <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
          </div>))}</div>}
        {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'18px' }}>{mainSecH('Additional Experience')}<div style={{ paddingLeft:'12px' }}><AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div></div>}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{mainSecH('References')}<div style={{ paddingLeft:'12px' }}><ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{mainSecH('Hobbies & Interests')}<div style={{ paddingLeft:'12px' }}><HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>mainSecH(label)}/>
      </div>
      <div style={{ width:'216px', minWidth:'216px', background:sidebarBg, flexShrink:0, padding:'32px 18px 40px', color:sidebarText, overflowX:'hidden' }}>
        {h.photo && <div style={{ display:'flex', justifyContent:'center', marginBottom:'20px' }}><div style={{ borderRadius:'50%', overflow:'hidden', width:'92px', height:'92px', border:`2.5px solid ${hexAlpha(sidebarText,0.28)}`, boxShadow:'0 4px 18px rgba(0,0,0,0.28)' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/></div></div>}
        {contactItems.length>0 && <div style={{ marginBottom:'20px' }}>{sideSecH('Contact')}{contactItems.map((item,i)=>(
          <div key={i} style={{ marginBottom:'7px' }}>
            <p style={{ fontSize:`${sizes.body-2}px`, fontWeight:'700', color:hexAlpha(sidebarText,0.44), textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 1px', fontFamily }}>{item.label}</p>
            <p style={{ fontSize:`${sizes.body-1.5}px`, color:hexAlpha(sidebarText,0.85), fontFamily, wordBreak:'break-all', lineHeight:1.35, margin:0 }}>{item.v}</p>
          </div>))}</div>}
        {data.skills.length>0 && <div style={{ marginBottom:'20px' }}>{sideSecH('Skills')}{data.skills.map((cat,i)=>(
          <div key={i} style={{ marginBottom:'9px' }}>
            {cat.name && <p style={{ fontSize:`${sizes.body-1}px`, fontWeight:'700', color:hexAlpha(sidebarText,0.9), marginBottom:'4px', fontFamily }}>{cat.name}</p>}
            <p style={{ fontSize:`${sizes.body-1.5}px`, color:hexAlpha(sidebarText,0.68), fontFamily, lineHeight:1.6, wordBreak:'break-word', overflowWrap:'break-word', margin:0 }}>{(cat.items||[]).join('  ·  ')}</p>
          </div>))}</div>}
        {data.education.length>0 && <div style={{ marginBottom:'20px' }}>{sideSecH('Education')}{data.education.map((edu,i)=>(
          <div key={i} style={{ marginBottom:'10px' }}>
            <p style={{ fontSize:`${sizes.body-1}px`, fontWeight:'700', color:hexAlpha(sidebarText,0.9), fontFamily, lineHeight:1.35, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
            <p style={{ fontSize:`${sizes.body-1.5}px`, color:hexAlpha(sidebarText,0.65), fontFamily, margin:'0 0 1px' }}>{edu.institution}</p>
            <p style={{ fontSize:`${sizes.date}px`, color:hexAlpha(sidebarText,0.45), fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
          </div>))}</div>}
        {data.languages.length>0 && <div style={{ marginBottom:'20px' }}>{sideSecH('Languages')}{data.languages.map((l,i)=>(
          <div key={i} style={{ marginBottom:'6px' }}>
            <p style={{ fontSize:`${sizes.body-1}px`, fontWeight:'600', color:hexAlpha(sidebarText,0.9), fontFamily, margin:0 }}>{l.language}</p>
            {l.proficiency && <p style={{ fontSize:`${sizes.date}px`, color:hexAlpha(sidebarText,0.48), fontFamily, margin:0 }}>{l.proficiency}</p>}
          </div>))}</div>}
        {data.certifications.length>0 && <div>{sideSecH('Certifications')}{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:'7px' }}><p style={{ fontSize:`${sizes.body-1}px`, fontWeight:'700', color:hexAlpha(sidebarText,0.9), fontFamily, margin:'0 0 1px', lineHeight:1.35 }}>{c.name}</p>{c.issuer&&<p style={{ fontSize:`${sizes.date}px`, color:hexAlpha(sidebarText,0.5), fontFamily, margin:0 }}>{c.issuer}</p>}</div>)}</div>}
      </div>
    </div>
  );
}

export { CvElegantTemplate, CvCompactTemplate, CvBoldTemplate, CvAcademicTemplate, CvTimelineTemplate, CvSidebarRightTemplate };
