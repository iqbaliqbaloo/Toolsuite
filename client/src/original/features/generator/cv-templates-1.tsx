// @ts-nocheck
import React from 'react';
import { EMPTY_DATA } from './cv-core';
import { hexAlpha, SectionHeading, PreviewBullets, SkillItems, ContactLine, PhotoCircle, HobbiesBlock, ReferencesBlock, CustomBlock, AdditionalExpBlock, SummaryBlock } from './cv-template-parts';

// ─── Template 1: Classic ─────────────────────────────────────────────────────
function CvClassicTemplate({ data, theme, sizes, fontFamily, headingFont, bodyFont, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#1a3a5c' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const L = (k, def) => (labels && labels[k]) || def;
  const clsSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead - 0.5}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.13em', color:primary, margin:0, fontFamily, whiteSpace:'nowrap' }}>{label}</h2>
      <div style={{ flex:1, height:'1.5px', background:atsMode?'#d1d5db':hexAlpha(primary,0.28) }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827', width:'100%', boxSizing:'border-box', overflowX:'hidden', background:'#ffffff' }}>
      <div style={{ padding:'36px 44px 22px', borderBottom:`3px solid ${atsMode?'#1a3a5c':primary}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'800', color:'#111827', margin:'0 0 4px', fontFamily, letterSpacing:'-0.015em', wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, fontWeight:'500', margin:'0 0 10px', fontFamily, letterSpacing:'0.02em' }}>{h.title}</p>}
            <p style={{ fontSize:`${sizes.contact}px`, color:'#6b7280', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
          </div>
          {h.photo && <PhotoCircle photo={h.photo} size={76} border={primary}/>}
        </div>
      </div>
      <div style={{ padding:'22px 44px 40px' }}>
        {data.summary && <div data-cv-sec="summary" style={{ marginBottom:'16px' }}>{clsSecH(L('summary','Professional Summary'))}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
        {(data.experience||[]).length>0 && (
          <div data-cv-sec="experience" style={{ marginBottom:'16px' }}>{clsSecH(L('experience','Experience'))}
            {(data.experience||[]).map((exp,i)=>(
              <div key={i} style={{ marginBottom:'12px', paddingLeft:'12px', borderLeft:`2.5px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.3)}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                  <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' — ')}</span>
                </div>
                <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}{exp.employmentType?` · ${exp.employmentType}`:''}</p>
                <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        {(data.education||[]).length>0 && (
          <div data-cv-sec="education" style={{ marginBottom:'16px' }}>{clsSecH(L('education','Education'))}
            {data.education.map((edu,i)=>(
              <div key={i} style={{ marginBottom:'9px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                  <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily, margin:0 }}>{[edu.institution,edu.location].filter(Boolean).join(', ')}{edu.gpa?` · GPA: ${edu.gpa}`:''}</p>
                </div>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[edu.startYear,edu.expected?`Expected ${edu.endYear}`:edu.endYear].filter(Boolean).join(' — ')}</span>
              </div>
            ))}
          </div>
        )}
        {(data.skills||[]).length>0 && (
          <div data-cv-sec="skills" style={{ marginBottom:'16px' }}>{clsSecH(L('skills','Skills'))}
            {data.skills.map((cat,i)=>(
              <div key={i} style={{ marginBottom:'5px', display:'flex', flexWrap:'wrap', gap:'2px 4px', alignItems:'baseline' }}>
                {cat.name && <span style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, marginRight:'4px' }}>{cat.name}:</span>}
                <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
              </div>
            ))}
          </div>
        )}
        {(data.projects||[]).length>0 && (
          <div data-cv-sec="projects" style={{ marginBottom:'16px' }}>{clsSecH(L('projects','Projects'))}
            {data.projects.map((proj,i)=>(
              <div key={i} style={{ marginBottom:'10px', paddingLeft:'12px', borderLeft:`2.5px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.3)}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                    {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:atsMode?'#374151':primary, fontFamily, fontStyle:'italic' }}>{proj.techStack.join(', ')}</span>}
                  </div>
                  {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                </div>
                {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', marginTop:'2px', fontFamily, wordBreak:'break-word' }}>{proj.description}</p>}
                <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'16px' }}>{clsSecH(L('additionalExperience','Additional Experience'))}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {(data.certifications||[]).length>0 && (
          <div data-cv-sec="certifications" style={{ marginBottom:'16px' }}>{clsSecH(L('certifications','Certifications'))}
            {data.certifications.map((cert,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#111827', marginBottom:'4px', fontFamily }}><span style={{ fontWeight:'700' }}>{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.issueDate&&` (${cert.issueDate})`}</p>)}
          </div>
        )}
        {(data.languages||[]).length>0 && <div data-cv-sec="languages" style={{ marginBottom:'16px' }}>{clsSecH(L('languages','Languages'))}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'16px' }}>{clsSecH(L('references','References'))}<ReferencesBlock references={data.references} primary={primary} fontFamily={bodyFont||fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'16px' }}>{clsSecH(L('hobbies','Hobbies & Interests'))}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={bodyFont||fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={bodyFont||fontFamily} sizes={sizes} atsMode={atsMode} secHFn={(label)=>clsSecH(label)}/>
      </div>
    </div>
  );
}

// ─── Template 2: Modern ───────────────────────────────────────────────────────
function CvModernTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary  = atsMode ? '#1e293b' : theme.primary;
  const accent   = atsMode ? '#475569' : theme.accent;
  const headerBg = atsMode ? '#1e293b' : theme.sidebar;
  const h = data?.header || EMPTY_DATA.header;
  const modSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
      <span style={{ width:'4px', height:`${sizes.secHead + 4}px`, background:primary, borderRadius:'2px', flexShrink:0, display:'inline-block' }}/>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:primary, margin:0, fontFamily }}>{label}</h2>
      <div style={{ flex:1, height:'1px', background:atsMode?'#e5e7eb':hexAlpha(primary,0.2) }}/>
    </div>
  );
  const allContact = [h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ');
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827', display:'flex', flexDirection:'column' }}>
      <div style={{ background:headerBg, padding:'28px 44px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px' }}>
        <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
          <h1 style={{ fontSize:`${sizes.name + 3}px`, fontWeight:'800', color:'#ffffff', margin:'0 0 4px', fontFamily, letterSpacing:'-0.02em', wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#cbd5e1':hexAlpha(accent||'#ffffff',0.9), margin:'0 0 10px', fontWeight:'500', fontFamily }}>{h.title}</p>}
          {allContact && <p style={{ fontSize:`${sizes.contact}px`, color:'rgba(255,255,255,0.55)', fontFamily, margin:0, lineHeight:1.7 }}>{allContact}</p>}
        </div>
        {h.photo && <PhotoCircle photo={h.photo} size={72} border="rgba(255,255,255,0.3)"/>}
      </div>
      <div style={{ display:'flex', flex:1 }}>
        <div style={{ width:'5px', background:atsMode?'#1e293b':`linear-gradient(to bottom, ${primary}, ${accent||primary})`, flexShrink:0 }}/>
        <div style={{ flex:1, padding:'26px 40px 40px' }}>
          {data.summary && <div data-cv-sec="summary" style={{ marginBottom:'16px' }}>{modSecH('Summary')}<div style={{ paddingLeft:'12px' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
          {(data.experience||[]).length>0 && (
            <div data-cv-sec="experience" style={{ marginBottom:'16px' }}>{modSecH('Experience')}
              {(data.experience||[]).map((exp,i)=>(
                <div key={i} style={{ marginBottom:'12px', paddingLeft:'12px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.25)}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                    <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                    <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' — ')}</span>
                  </div>
                  <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(' · ')}</p>
                  <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:'28px' }}>
            {data.education.length>0 && (
              <div data-cv-sec="education" style={{ flex:1, marginBottom:'16px' }}>{modSecH('Education')}
                {data.education.map((edu,i)=>(
                  <div key={i} style={{ marginBottom:'9px', paddingLeft:'12px' }}>
                    <p style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                    <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
                    <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.expected?`Expected ${edu.endYear}`:edu.endYear].filter(Boolean).join(' — ')}</p>
                  </div>
                ))}
              </div>
            )}
            {data.skills.length>0 && (
              <div style={{ flex:1, marginBottom:'16px' }}>{modSecH('Skills')}
                {data.skills.map((cat,i)=>(
                  <div key={i} style={{ marginBottom:'6px', paddingLeft:'12px' }}>
                    {cat.name && <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
                    <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
                  </div>
                ))}
              </div>
            )}
          </div>
          {data.projects.length>0 && (
            <div data-cv-sec="projects" style={{ marginBottom:'16px' }}>{modSecH('Projects')}
              {data.projects.map((proj,i)=>(
                <div key={i} style={{ marginBottom:'10px', paddingLeft:'12px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.25)}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'7px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                      {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:atsMode?'#374151':primary, fontFamily, fontStyle:'italic' }}>{proj.techStack.join(', ')}</span>}
                    </div>
                    {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
                  <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
                </div>
              ))}
            </div>
          )}
          {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'16px' }}>{modSecH('Additional Experience')}<div style={{ paddingLeft:'12px' }}><AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div></div>}
          {(data.certifications.length>0||data.languages.length>0) && (
            <div style={{ display:'flex', gap:'28px', marginBottom:'14px' }}>
              {data.certifications.length>0 && <div style={{ flex:1 }}>{modSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#111827', marginBottom:'3px', paddingLeft:'12px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&` — ${c.issuer}`}</p>)}</div>}
              {data.languages.length>0 && <div style={{ flex:1 }}>{modSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'3px', paddingLeft:'12px', fontFamily }}>{l.language}{l.proficiency&&<span style={{ color:'#6b7280' }}> — {l.proficiency}</span>}</p>)}</div>}
            </div>
          )}
          {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'16px' }}>{modSecH('References')}<div style={{ paddingLeft:'12px' }}><ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
          {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'16px' }}>{modSecH('Hobbies & Interests')}<div style={{ paddingLeft:'12px' }}><HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
          <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>modSecH(label.toUpperCase())}/>
        </div>
      </div>
    </div>
  );
}

// ─── Template 3: Minimal ─────────────────────────────────────────────────────
function CvMinimalTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const minSecH = (label) => (
    <div style={{ marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead - 1}px`, fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.18em', color:atsMode?'#374151':primary, margin:'0 0 5px', fontFamily }}>{label}</h2>
      <div style={{ height:'1px', background:atsMode?'#e5e7eb':`linear-gradient(to right, ${hexAlpha(primary,0.4)}, transparent)` }}/>
    </div>
  );
  const h = data?.header || EMPTY_DATA.header;
  return (
    <div style={{ fontFamily, lineHeight:1.55, padding:'44px 52px', color:'#111827', background:'#ffffff' }}>
      <div style={{ marginBottom:'28px', paddingBottom:'18px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px' }}>
        <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
          <h1 style={{ fontSize:`${sizes.name}px`, fontWeight:'300', color:'#111827', letterSpacing:'-0.01em', margin:'0 0 4px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:'#6b7280', margin:'0 0 10px', fontFamily, fontWeight:'400' }}>{h.title}</p>}
          <p style={{ fontSize:`${sizes.contact}px`, color:'#9ca3af', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
        </div>
        {h.photo && <div style={{ flexShrink:0, borderRadius:'50%', overflow:'hidden', width:'78px', height:'78px', border:'1.5px solid #e5e7eb' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
      </div>
      {data.summary && <div data-cv-sec="summary" style={{ marginBottom:'22px' }}>{minSecH('Summary')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
      {data.experience.length>0 && (
        <div data-cv-sec="experience" style={{ marginBottom:'22px' }}>{minSecH('Experience')}
          {data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'600', color:'#111827', fontFamily }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' — ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
              <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes} color="#4b5563"/>
            </div>
          ))}
        </div>
      )}
      {data.education.length>0 && (
        <div data-cv-sec="education" style={{ marginBottom:'22px' }}>{minSecH('Education')}
          {data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'9px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'600', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily, margin:0 }}>{[edu.institution,edu.gpa?`GPA ${edu.gpa}`:''].filter(Boolean).join(' · ')}</p>
              </div>
              <span style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[edu.startYear,edu.expected?`Expected ${edu.endYear}`:edu.endYear].filter(Boolean).join(' — ')}</span>
            </div>
          ))}
        </div>
      )}
      {data.skills.length>0 && (
        <div data-cv-sec="skills" style={{ marginBottom:'22px' }}>{minSecH('Skills')}
          {data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'5px', display:'flex', flexWrap:'wrap', gap:'2px 4px', alignItems:'baseline' }}>
              {cat.name && <span style={{ fontSize:`${sizes.body}px`, color:'#9ca3af', fontFamily, marginRight:'4px' }}>{cat.name}:</span>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>
          ))}
        </div>
      )}
      {data.projects.length>0 && (
        <div data-cv-sec="projects" style={{ marginBottom:'22px' }}>{minSecH('Projects')}
          {data.projects.map((proj,i)=>(
            <div key={i} style={{ marginBottom:'11px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'600', color:'#111827', fontFamily }}>{proj.name}</span>
                  {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily }}>{proj.techStack.join(', ')}</span>}
                </div>
                {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
              </div>
              {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
              <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes} color="#4b5563"/>
            </div>
          ))}
        </div>
      )}
      {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'22px' }}>{minSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
      {(data.certifications.length>0||data.languages.length>0) && (
        <div style={{ display:'flex', gap:'36px', marginBottom:'22px' }}>
          {data.certifications.length>0 && <div style={{ flex:1 }}>{minSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'4px', fontFamily }}>{c.name}{c.issuer&&<span style={{ color:'#9ca3af' }}> — {c.issuer}</span>}</p>)}</div>}
          {data.languages.length>0 && <div style={{ flex:1 }}>{minSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'3px', fontFamily }}>{l.language}{l.proficiency&&<span style={{ color:'#9ca3af' }}> — {l.proficiency}</span>}</p>)}</div>}
        </div>
      )}
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'22px' }}>{minSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'22px' }}>{minSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>minSecH(label)}/>
    </div>
  );
}

// ─── Template 4: Creative (sidebar left) ─────────────────────────────────────
function CvCreativeTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const sidebarBg   = atsMode ? '#1e293b' : theme.sidebar;
  const sidebarText = theme.sidebarText || '#ffffff';
  const primary     = atsMode ? '#111827' : theme.primary;
  const accent      = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const sideSecH = (label) => (
    <div style={{ marginBottom:'8px' }}>
      <h2 style={{ fontSize:`${sizes.secHead - 1}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.14em', color:hexAlpha(sidebarText,0.55), margin:'0 0 5px', fontFamily }}>{label}</h2>
      <div style={{ height:'1px', background:hexAlpha(sidebarText,0.15) }}/>
    </div>
  );
  const rightSecH = (label) => (
    <div style={{ marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:primary, margin:'0 0 4px', fontFamily }}>{label}</h2>
      <div style={{ height:'2px', background:atsMode?'#111827':primary, width:'32px', borderRadius:'2px' }}/>
    </div>
  );
  const sidebarContactItems = [
    h.email    && { label:'Email',    val:h.email },
    h.phone    && { label:'Phone',    val:h.phone },
    h.location && { label:'Location', val:h.location },
    h.linkedin && { label:'LinkedIn', val:h.linkedin },
    h.github   && { label:'GitHub',   val:h.github },
    h.portfolio && { label:'Web',     val:h.portfolio },
  ].filter(Boolean);
  return (
    <div style={{ fontFamily, lineHeight:1.45, display:'flex', minHeight:'1122px' }}>
      {/* Sidebar */}
      <div style={{ width:'240px', background:sidebarBg, flexShrink:0, padding:'36px 20px 36px', color:sidebarText, overflowX:'hidden' }}>
        {h.photo && (
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'18px' }}>
            <div style={{ borderRadius:'50%', overflow:'hidden', width:'96px', height:'96px', border:`2.5px solid ${hexAlpha(sidebarText,0.3)}` }}>
              <img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/>
            </div>
          </div>
        )}
        <h1 style={{ fontSize:`${sizes.name - 2}px`, fontWeight:'700', color:sidebarText, margin:'0 0 4px', fontFamily, lineHeight:1.2, wordBreak:'break-word' }}>{h.name||'Your Name'}</h1>
        {h.title && <p style={{ fontSize:`${sizes.titleLine - 1}px`, color:hexAlpha(sidebarText,0.65), margin:'0 0 20px', fontFamily, fontWeight:'400', lineHeight:1.4 }}>{h.title}</p>}
        {sidebarContactItems.length>0 && (
          <div style={{ marginBottom:'20px' }}>
            {sideSecH('Contact')}
            {sidebarContactItems.map((item,i)=>(
              <div key={i} style={{ marginBottom:'7px' }}>
                <p style={{ fontSize:`${sizes.body-2}px`, fontWeight:'700', color:hexAlpha(sidebarText,0.45), textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 1px', fontFamily }}>{item.label}</p>
                <p style={{ fontSize:`${sizes.body-1}px`, color:hexAlpha(sidebarText,0.85), fontFamily, wordBreak:'break-all', lineHeight:1.35, margin:0 }}>{item.val}</p>
              </div>
            ))}
          </div>
        )}
        {data.skills.length>0 && (
          <div style={{ marginBottom:'20px' }}>
            {sideSecH('Skills')}
            {data.skills.map((cat,i)=>(
              <div key={i} style={{ marginBottom:'9px' }}>
                {cat.name && <p style={{ fontSize:`${sizes.body-1}px`, fontWeight:'700', color:hexAlpha(sidebarText,0.9), marginBottom:'4px', fontFamily }}>{cat.name}</p>}
                <p style={{ fontSize:`${sizes.body-1}px`, color:hexAlpha(sidebarText,0.7), fontFamily, margin:0, lineHeight:1.65, wordBreak:'break-word' }}>{cat.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        )}
        {data.languages.length>0 && (
          <div style={{ marginBottom:'20px' }}>
            {sideSecH('Languages')}
            {data.languages.map((l,i)=>(
              <div key={i} style={{ marginBottom:'6px' }}>
                <p style={{ fontSize:`${sizes.body-1}px`, color:hexAlpha(sidebarText,0.9), fontFamily, fontWeight:'600', margin:0 }}>{l.language}</p>
                <p style={{ fontSize:`${sizes.body-2}px`, color:hexAlpha(sidebarText,0.5), fontFamily, margin:0 }}>{l.proficiency}</p>
              </div>
            ))}
          </div>
        )}
        {data.summary && (
          <div>
            {sideSecH('Profile')}
            <SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} color={hexAlpha(sidebarText,0.75)} />
          </div>
        )}
      </div>
      {/* Main content */}
      <div style={{ flex:1, padding:'36px 32px 40px', background:'#ffffff' }}>
        {data.experience.length>0 && (
          <div data-cv-sec="experience" style={{ marginBottom:'20px' }}>{rightSecH('Experience')}
            {data.experience.map((exp,i)=>(
              <div key={i} style={{ marginBottom:'13px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                  <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' — ')}</span>
                </div>
                <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}{exp.employmentType?` · ${exp.employmentType}`:''}</p>
                <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        {data.education.length>0 && (
          <div data-cv-sec="education" style={{ marginBottom:'20px' }}>{rightSecH('Education')}
            {data.education.map((edu,i)=>(
              <div key={i} style={{ marginBottom:'9px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</span>
                  <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[edu.startYear,edu.expected?`Expected ${edu.endYear}`:edu.endYear].filter(Boolean).join(' — ')}</span>
                </div>
                <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily }}>{[edu.institution,edu.location].filter(Boolean).join(', ')}{edu.gpa?` · GPA: ${edu.gpa}`:''}</p>
              </div>
            ))}
          </div>
        )}
        {data.projects.length>0 && (
          <div data-cv-sec="projects" style={{ marginBottom:'20px' }}>{rightSecH('Projects')}
            {data.projects.map((proj,i)=>(
              <div key={i} style={{ marginBottom:'10px', paddingLeft:'10px', borderLeft:`2px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.25)}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'7px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                    {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                  </div>
                  {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
                </div>
                {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', marginTop:'2px', fontFamily, wordBreak:'break-word' }}>{proj.description}</p>}
                <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'20px' }}>{rightSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {data.certifications.length>0 && (
          <div data-cv-sec="certifications" style={{ marginBottom:'20px' }}>{rightSecH('Certifications')}
            {data.certifications.map((cert,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#111827', marginBottom:'4px', fontFamily }}><strong>{cert.name}</strong>{cert.issuer&&` — ${cert.issuer}`}{cert.issueDate&&` (${cert.issueDate})`}</p>)}
          </div>
        )}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'20px' }}>{rightSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'20px' }}>{rightSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>rightSecH(label)}/>
      </div>
    </div>
  );
}

// ─── Template 5: Executive ────────────────────────────────────────────────────
function CvExecutiveTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const exSecH = (label) => (
    <div style={{ marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.12em', color:'#111827', margin:'0 0 4px', fontFamily }}>{label}</h2>
      <div style={{ display:'flex', gap:'0' }}>
        <div style={{ height:'3px', width:'28px', background:atsMode?'#111827':primary, borderRadius:'2px' }}/>
        <div style={{ height:'3px', flex:1, background:atsMode?'#e5e7eb':hexAlpha(primary,0.15) }}/>
      </div>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827' }}>
      <div style={{ height:'7px', background:atsMode?'#111827':`linear-gradient(to right, ${primary}, ${accent||primary})` }}/>
      <div style={{ padding:'30px 44px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'800', color:'#111827', margin:'0 0 4px', fontFamily, letterSpacing:'-0.01em', wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'0 0 10px', fontFamily, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h.title}</p>}
            <p style={{ fontSize:`${sizes.contact}px`, color:'#6b7280', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
          </div>
          {h.photo && <div style={{ flexShrink:0, borderRadius:'50%', overflow:'hidden', width:'82px', height:'82px', border:`3px solid ${atsMode?'#d1d5db':primary}` }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
      </div>
      <div style={{ height:'1px', background:'#f3f4f6', margin:'0 44px' }}/>
      <div style={{ padding:'22px 44px 40px' }}>
        {data.summary && <div data-cv-sec="summary" style={{ marginBottom:'18px' }}>{exSecH('Executive Profile')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
        {data.experience.length>0 && (
          <div data-cv-sec="experience" style={{ marginBottom:'18px' }}>{exSecH('Experience')}
            {data.experience.map((exp,i)=>(
              <div key={i} style={{ marginBottom:'13px', paddingLeft:'14px', borderLeft:`3px solid ${atsMode?'#d1d5db':hexAlpha(primary,0.35)}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                  <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0, whiteSpace:'nowrap' }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
                </div>
                <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(' · ')}{exp.employmentType?` | ${exp.employmentType}`:''}</p>
                <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        {data.education.length>0 && (
          <div data-cv-sec="education" style={{ marginBottom:'18px' }}>{exSecH('Education')}
            {data.education.map((edu,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2px 8px', marginBottom:'9px' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                  <p style={{ fontSize:`${sizes.body}px`, color:'#6b7280', fontFamily, margin:0 }}>{[edu.institution,edu.location].filter(Boolean).join(', ')}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
                </div>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, whiteSpace:'nowrap', paddingLeft:'10px', flexShrink:0 }}>{[edu.startYear,edu.expected?`Expected ${edu.endYear}`:edu.endYear].filter(Boolean).join(' – ')}</span>
              </div>
            ))}
          </div>
        )}
        {data.skills.length>0 && (
          <div data-cv-sec="skills" style={{ marginBottom:'18px' }}>{exSecH('Core Skills')}
            {data.skills.map((cat,i)=>(
              <div key={i} style={{ marginBottom:'5px', display:'flex', flexWrap:'wrap', gap:'2px 4px', alignItems:'baseline' }}>
                {cat.name && <span style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', marginRight:'6px', fontFamily }}>{cat.name}:</span>}
                <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
              </div>
            ))}
          </div>
        )}
        {data.projects.length>0 && (
          <div data-cv-sec="projects" style={{ marginBottom:'18px' }}>{exSecH('Projects')}
            {data.projects.map((proj,i)=>(
              <div key={i} style={{ marginBottom:'10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'7px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
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
        {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'18px' }}>{exSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {(data.certifications.length>0||data.languages.length>0) && (
          <div style={{ display:'flex', gap:'36px', marginBottom:'18px' }}>
            {data.certifications.length>0 && <div style={{ flex:1 }}>{exSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#111827', marginBottom:'3px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&` — ${c.issuer}`}</p>)}</div>}
            {data.languages.length>0 && <div style={{ flex:1 }}>{exSecH('Languages')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
          </div>
        )}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{exSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{exSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>exSecH(label)}/>
      </div>
    </div>
  );
}

// ─── Template 6: Tech ─────────────────────────────────────────────────────────
function CvTechTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#0f172a' : theme.primary;
  const accent  = atsMode ? '#334155' : theme.accent;
  const mono    = 'ui-monospace, "Cascadia Code", "Fira Code", monospace';
  const h = data?.header || EMPTY_DATA.header;
  const techSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
      <span style={{ fontSize:`${sizes.secHead - 1}px`, fontWeight:'700', color:atsMode?'#334155':accent, fontFamily:mono, letterSpacing:'0.03em' }}>{'// '}</span>
      <span style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', color:atsMode?'#0f172a':primary, fontFamily, textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</span>
      <div style={{ flex:1, height:'1px', background:atsMode?'#e5e7eb':hexAlpha(primary,0.2) }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827' }}>
      <div style={{ background:atsMode?'#0f172a':primary, padding:'26px 40px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 1}px`, fontWeight:'700', color:'#ffffff', margin:'0 0 5px', fontFamily:mono, wordBreak:'break-word', lineHeight:1.1 }}>
              <span style={{ color:hexAlpha(atsMode?'#94a3b8':accent||'#64748b',0.85) }}>&gt;_ </span>{h.name||'Your Name'}
            </h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#94a3b8':hexAlpha(accent||'#94a3b8',0.9), margin:'0 0 10px', fontFamily:mono }}>{h.title}</p>}
            <p style={{ fontSize:`${sizes.contact - 1}px`, color:'rgba(255,255,255,0.5)', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location].filter(Boolean).join('  ·  ')}</p>
            {[h.linkedin,h.github,h.portfolio].filter(Boolean).length>0 && <p style={{ fontSize:`${sizes.contact - 1}px`, color:atsMode?'#94a3b8':hexAlpha(accent||'#94a3b8',0.8), fontFamily, margin:'2px 0 0' }}>{[h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>}
          </div>
          {h.photo && <div style={{ flexShrink:0, borderRadius:'50%', overflow:'hidden', width:'76px', height:'76px', border:'2px solid rgba(255,255,255,0.2)' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
      </div>
      <div style={{ padding:'28px 40px 40px' }}>
        {data.summary && <div data-cv-sec="summary" style={{ marginBottom:'18px' }}>{techSecH('About')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
        {data.experience.length>0 && (
          <div data-cv-sec="experience" style={{ marginBottom:'18px' }}>{techSecH('Experience')}
            {data.experience.map((exp,i)=>(
              <div key={i} style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                  <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word', paddingRight:'8px' }}>{exp.jobTitle}</span>
                  <code style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily:mono, background:'#f1f5f9', padding:'1px 7px', borderRadius:'4px', flexShrink:0 }}>{[exp.startDate,exp.current?'NOW':exp.endDate].filter(Boolean).join(' → ')}</code>
                </div>
                <p style={{ fontSize:`${sizes.body}px`, color:atsMode?'#374151':primary, fontWeight:'600', margin:'2px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(' @ ')}</p>
                <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:'flex', gap:'28px', marginBottom:'18px' }}>
          {data.education.length>0 && (
            <div style={{ flex:1 }}>{techSecH('Education')}
              {data.education.map((edu,i)=>(
                <div key={i} style={{ marginBottom:'9px' }}>
                  <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
                  <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#374151', fontFamily, margin:0 }}>{edu.institution}</p>
                  <p style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
                </div>
              ))}
            </div>
          )}
          {data.skills.length>0 && (
            <div style={{ flex:1 }}>{techSecH('Skills')}
              {data.skills.map((cat,i)=>(
                <div key={i} style={{ marginBottom:'6px' }}>
                  {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:atsMode?'#334155':accent||primary, fontFamily:mono, margin:'0 0 2px' }}>{cat.name}</p>}
                  <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
                </div>
              ))}
            </div>
          )}
        </div>
        {data.projects.length>0 && (
          <div data-cv-sec="projects" style={{ marginBottom:'18px' }}>{techSecH('Projects')}
            {data.projects.map((proj,i)=>(
              <div key={i} style={{ marginBottom:'10px', background:'#f8fafc', borderRadius:'8px', padding:'10px 14px', border:`1px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.15)}`, borderLeft:`3px solid ${atsMode?'#334155':primary}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                    {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:atsMode?'#334155':accent||primary, fontFamily:mono }}>{proj.techStack.slice(0,4).join(' · ')}</span>}
                  </div>
                  {(proj.startDate||proj.endDate) && <code style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily:mono }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</code>}
                </div>
                {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', marginTop:'4px', fontFamily, wordBreak:'break-word' }}>{proj.description}</p>}
                <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
              </div>
            ))}
          </div>
        )}
        {(data.additionalExperience||[]).length>0 && <div data-cv-sec="additionalExperience" style={{ marginBottom:'18px' }}>{techSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {data.languages.length>0 && <div data-cv-sec="languages" style={{ marginBottom:'18px' }}>{techSecH('Languages')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{techSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{techSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>techSecH(label)}/>
      </div>
    </div>
  );
}

export { CvClassicTemplate, CvModernTemplate, CvMinimalTemplate, CvCreativeTemplate, CvExecutiveTemplate, CvTechTemplate };
