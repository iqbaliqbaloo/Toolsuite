// @ts-nocheck
import React from 'react';
import { EMPTY_DATA } from './cv-core';
import { hexAlpha, SectionHeading, PreviewBullets, SkillItems, ContactLine, PhotoCircle, HobbiesBlock, ReferencesBlock, CustomBlock, AdditionalExpBlock, SummaryBlock } from './cv-template-parts';

// ─── Template 13: Gradient ✦ ─────────────────────────────────────────────────
function CvGradientTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#1e293b' : theme.primary;
  const accent  = atsMode ? '#475569' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const gSecH = (label) => (
    <div style={{ marginBottom:'11px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px' }}>
        <span style={{ width:'3px', height:`${sizes.secHead + 4}px`, background:primary, borderRadius:'2px', flexShrink:0 }}/>
        <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:primary, margin:0, fontFamily, wordBreak:'break-word' }}>{label}</h2>
      </div>
      <div style={{ height:'1.5px', background:`linear-gradient(to right, ${primary}, ${hexAlpha(primary,0)})`, borderRadius:'1px', marginLeft:'11px' }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.48, color:'#111827', background:'#ffffff', width:'100%', boxSizing:'border-box', overflowX:'hidden' }}>
      <div style={{ background:atsMode?'linear-gradient(135deg,#1e293b,#334155)':`linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`, padding:'36px 52px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', bottom:'-30px', left:'30%', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'20px', position:'relative' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 6}px`, fontWeight:'800', color:'#ffffff', margin:'0 0 5px', fontFamily, letterSpacing:'-0.02em', lineHeight:1.1, wordBreak:'break-word' }}>{h.name||'Your Name'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine + 1}px`, color:'rgba(255,255,255,0.78)', fontWeight:'500', margin:'0 0 12px', fontFamily }}>{h.title}</p>}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px 18px' }}>
              {[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).map((v,i)=>(
                <span key={i} style={{ fontSize:`${sizes.contact - 0.5}px`, color:'rgba(255,255,255,0.65)', fontFamily }}>{v}</span>
              ))}
            </div>
          </div>
          {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'88px', height:'88px', border:'3px solid rgba(255,255,255,0.38)', flexShrink:0, alignSelf:'flex-start', boxShadow:'0 8px 24px rgba(0,0,0,0.22)' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,3fr) minmax(0,2fr)', padding:'26px 52px 40px', gap:'0' }}>
        <div style={{ paddingRight:'28px', borderRight:'1px solid #f0f0f0', minWidth:0 }}>
          {data.summary && <div style={{ marginBottom:'18px' }}>{gSecH('Profile')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
          {data.experience.length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Experience')}{data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'13px', paddingLeft:'12px', borderLeft:`2.5px solid ${atsMode?'#d1d5db':hexAlpha(primary,0.35)}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
              <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>))}</div>}
          {data.projects.length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Projects')}{data.projects.map((proj,i)=>(
            <div key={i} style={{ marginBottom:'10px', paddingLeft:'12px', borderLeft:`2.5px solid ${atsMode?'#d1d5db':hexAlpha(accent||primary,0.4)}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                  {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                </div>
                {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
              </div>
              {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
              <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>))}</div>}
          {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
          {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{gSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
          {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{gSecH('Hobbies')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
          <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>gSecH(label)}/>
        </div>
        <div style={{ paddingLeft:'26px', minWidth:0 }}>
          {data.skills.length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'8px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'3px', fontFamily }}>{cat.name}</p>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>))}</div>}
          {data.education.length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'10px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.certifications.length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Certifications')}{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:'6px' }}><p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:0 }}>{c.name}</p>{c.issuer&&<p style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, margin:0 }}>{c.issuer}</p>}</div>)}</div>}
          {data.languages.length>0 && <div style={{ marginBottom:'18px' }}>{gSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, marginBottom:'3px' }}>{l.language}{l.proficiency&&<span style={{ color:'#6b7280' }}> — {l.proficiency}</span>}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Template 14: Two Column ✦ ───────────────────────────────────────────────
function CvTwoColumnTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const lSecH = (label) => (
    <div style={{ marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:primary, margin:'0 0 4px', fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ height:'2px', background:`linear-gradient(to right, ${atsMode?'#374151':primary}, transparent)` }}/>
    </div>
  );
  const rSecH = (label) => (
    <div style={{ marginBottom:'9px' }}>
      <h2 style={{ fontSize:`${sizes.secHead-0.5}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:atsMode?'#374151':accent||'#374151', margin:'0 0 4px', fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ height:'2px', background:`linear-gradient(to right, ${atsMode?'#6b7280':accent||'#374151'}, transparent)` }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827', width:'100%', boxSizing:'border-box', overflowX:'hidden' }}>
      <div style={{ background:atsMode?'#111827':primary, padding:'28px 44px 22px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'16px' }}>
        <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
          <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'800', color:'#ffffff', margin:'0 0 5px', fontFamily, wordBreak:'break-word', lineHeight:1.1, letterSpacing:'-0.01em' }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:'rgba(255,255,255,0.78)', fontWeight:'500', margin:'0 0 10px', fontFamily }}>{h.title}</p>}
          <p style={{ fontSize:`${sizes.contact - 0.5}px`, color:'rgba(255,255,255,0.58)', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
        </div>
        {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'80px', height:'80px', border:'3px solid rgba(255,255,255,0.3)', flexShrink:0, alignSelf:'flex-start' }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,3fr) minmax(0,2fr)', overflowX:'hidden' }}>
        <div style={{ padding:'24px 26px 36px 44px', borderRight:`2px solid ${atsMode?'#f3f4f6':hexAlpha(primary,0.1)}` }}>
          {data.summary && <div style={{ marginBottom:'18px' }}>{lSecH('Summary')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
          {data.experience.length>0 && <div style={{ marginBottom:'18px' }}>{lSecH('Experience')}{data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'13px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
              <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>))}</div>}
          {data.projects.length>0 && <div style={{ marginBottom:'18px' }}>{lSecH('Projects')}{data.projects.map((proj,i)=>(
            <div key={i} style={{ marginBottom:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'7px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                  {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                </div>
                {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
              </div>
              {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
              <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>))}</div>}
          {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'18px' }}>{lSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
          {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{lSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
          {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{lSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
          <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>lSecH(label)}/>
        </div>
        <div style={{ padding:'24px 36px 36px 26px', background:atsMode?'#f9fafb':hexAlpha(accent||primary,0.05), minWidth:0 }}>
          {data.skills.length>0 && <div style={{ marginBottom:'18px' }}>{rSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'8px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'3px', fontFamily }}>{cat.name}</p>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>))}</div>}
          {data.education.length>0 && <div style={{ marginBottom:'18px' }}>{rSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'10px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.certifications.length>0 && <div style={{ marginBottom:'18px' }}>{rSecH('Certifications')}{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:'6px' }}><p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:0 }}>{c.name}</p>{c.issuer&&<p style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, margin:0, fontStyle:'italic' }}>{c.issuer}</p>}</div>)}</div>}
          {data.languages.length>0 && <div style={{ marginBottom:'18px' }}>{rSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, marginBottom:'4px' }}>{l.language}{l.proficiency&&<span style={{ color:'#6b7280' }}> — {l.proficiency}</span>}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Template 15: Centered ✦ ──────────────────────────────────────────────────
function CvCenteredTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const cntSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
      <div style={{ flex:1, height:'1px', background:atsMode?'#d1d5db':hexAlpha(primary,0.28) }}/>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.15em', color:primary, margin:0, fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ flex:1, height:'1px', background:atsMode?'#d1d5db':hexAlpha(primary,0.28) }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.5, color:'#111827', padding:'44px 56px', width:'100%', boxSizing:'border-box', overflowX:'hidden', background:'#ffffff' }}>
      <div style={{ textAlign:'center', marginBottom:'30px' }}>
        {h.photo && <div style={{ display:'flex', justifyContent:'center', marginBottom:'14px' }}><div style={{ borderRadius:'50%', overflow:'hidden', width:'88px', height:'88px', border:`2.5px solid ${atsMode?'#d1d5db':hexAlpha(primary,0.45)}`, boxShadow:`0 4px 20px ${hexAlpha(primary,0.14)}` }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div></div>}
        <h1 style={{ fontSize:`${sizes.name + 4}px`, fontWeight:'300', color:'#111827', letterSpacing:'0.09em', textTransform:'uppercase', margin:'0 0 6px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
        {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, letterSpacing:'0.13em', textTransform:'uppercase', fontWeight:'500', margin:'0 0 12px', fontFamily }}>{h.title}</p>}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', marginBottom:'12px' }}>
          <div style={{ height:'1px', width:'48px', background:`linear-gradient(to right, transparent, ${atsMode?'#9ca3af':hexAlpha(primary,0.5)})` }}/>
          <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:atsMode?'#9ca3af':primary, display:'inline-block' }}/>
          <div style={{ height:'1px', width:'48px', background:`linear-gradient(to left, transparent, ${atsMode?'#9ca3af':hexAlpha(primary,0.5)})` }}/>
        </div>
        <p style={{ fontSize:`${sizes.contact - 0.5}px`, color:'#6b7280', letterSpacing:'0.04em', fontFamily, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
      </div>
      {data.summary && <div style={{ marginBottom:'20px' }}>{cntSecH('Profile')}<div style={{ textAlign:'center', maxWidth:'600px', margin:'0 auto' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
      {data.experience.length>0 && <div style={{ marginBottom:'20px' }}>{cntSecH('Experience')}{data.experience.map((exp,i)=>(
        <div key={i} style={{ marginBottom:'13px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
            <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
            <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' — ')}</span>
          </div>
          <p style={{ fontSize:`${sizes.body}px`, color:atsMode?'#374151':primary, fontWeight:'500', margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
          <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
        </div>))}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'24px', marginBottom:'20px' }}>
        {data.education.length>0 && <div>{cntSecH('Education')}{data.education.map((edu,i)=>(
          <div key={i} style={{ marginBottom:'9px' }}>
            <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
            <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
            <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
          </div>))}</div>}
        {data.skills.length>0 && <div>{cntSecH('Skills')}{data.skills.map((cat,i)=>(
          <div key={i} style={{ marginBottom:'6px' }}>
            {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
            <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
          </div>))}</div>}
      </div>
      {data.projects.length>0 && <div style={{ marginBottom:'20px' }}>{cntSecH('Projects')}{data.projects.map((proj,i)=>(
        <div key={i} style={{ marginBottom:'11px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
              <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
              {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
            </div>
            {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
          </div>
          {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
          <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
        </div>))}</div>}
      {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'20px' }}>{cntSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
      {data.certifications.length>0 && <div style={{ marginBottom:'20px' }}>{cntSecH('Certifications')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, textAlign:'center' }}>{data.certifications.map(c=>c.name+(c.issuer?' — '+c.issuer:'')).join('  ·  ')}</p></div>}
      {data.languages.length>0 && <div style={{ marginBottom:'20px' }}>{cntSecH('Languages')}<p style={{ textAlign:'center', fontSize:`${sizes.body}px`, color:'#374151', fontFamily }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
      {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'20px' }}>{cntSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
      {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'20px' }}>{cntSecH('Hobbies & Interests')}<div style={{ textAlign:'center' }}><HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
      <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>cntSecH(label)}/>
    </div>
  );
}

// ─── Template 16: Slate ✦ ────────────────────────────────────────────────────
function CvSlateTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const h = data?.header || EMPTY_DATA.header;
  const slSecH = (label) => (
    <div style={{ marginBottom:'10px' }}>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.18em', color:'#111827', margin:'0 0 5px', fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ display:'flex', gap:'0' }}>
        <div style={{ height:'2px', width:'24px', background:'#111827', borderRadius:'2px' }}/>
        <div style={{ height:'2px', flex:1, background:'#f3f4f6' }}/>
      </div>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.48, color:'#111827', width:'100%', boxSizing:'border-box', overflowX:'hidden', background:'#ffffff' }}>
      <div style={{ background:'#111827', padding:'30px 48px 26px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'16px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'200', color:'#ffffff', letterSpacing:'0.07em', textTransform:'uppercase', margin:'0 0 5px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:'#6b7280', margin:'0 0 12px', fontFamily, letterSpacing:'0.04em' }}>{h.title}</p>}
            <p style={{ fontSize:`${sizes.contact - 0.5}px`, color:'#4b5563', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
          </div>
          {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'78px', height:'78px', border:'2px solid #374151', flexShrink:0 }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
      </div>
      <div style={{ height:'4px', background:'#374151' }}/>
      <div style={{ padding:'28px 48px 44px' }}>
        {data.summary && <div style={{ marginBottom:'20px' }}>{slSecH('Profile')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
        {data.experience.length>0 && <div style={{ marginBottom:'20px' }}>{slSecH('Experience')}{data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:'13px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
              <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
              <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' — ')}</span>
            </div>
            <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:'#374151', margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
            <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes} color="#374151"/>
          </div>))}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'28px', marginBottom:'20px' }}>
          {data.education.length>0 && <div>{slSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'9px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.skills.length>0 && <div>{slSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'7px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#374151', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, lineHeight:1.6, margin:0 }}>{(cat.items||[]).join('  ·  ')}</p>
            </div>))}</div>}
        </div>
        {data.projects.length>0 && <div style={{ marginBottom:'20px' }}>{slSecH('Projects')}{data.projects.map((proj,i)=>(
          <div key={i} style={{ marginBottom:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily }}>{proj.techStack.join(', ')}</span>}
              </div>
              {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
            </div>
            {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
            <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes} color="#374151"/>
          </div>))}</div>}
        {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'20px' }}>{slSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {data.certifications.length>0 && <div style={{ marginBottom:'20px' }}>{slSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'4px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280', fontWeight:'400' }}> — {c.issuer}</span>}</p>)}</div>}
        {data.languages.length>0 && <div style={{ marginBottom:'20px' }}>{slSecH('Languages')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, wordBreak:'break-word' }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'20px' }}>{slSecH('References')}<ReferencesBlock references={data.references} primary="#374151" fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'20px' }}>{slSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary="#374151" fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        <CustomBlock custom={data.custom} primary="#374151" fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>slSecH(label)}/>
      </div>
    </div>
  );
}

// ─── Template 17: Cosmic ✦ (dark) ────────────────────────────────────────────
function CvCosmicTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const bg      = atsMode ? '#ffffff' : '#0f172a';
  const primary = atsMode ? '#2563eb' : theme.primary;
  const accent  = atsMode ? '#0d9488' : theme.accent;
  const text    = atsMode ? '#111827' : '#e2e8f0';
  const muted   = atsMode ? '#6b7280' : '#94a3b8';
  const h = data?.header || EMPTY_DATA.header;
  const csmSecH = (label) => (
    <div style={{ marginBottom:'11px' }}>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.12em', color:primary, margin:'0 0 5px', fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ height:'1px', background:`linear-gradient(to right, ${primary}, transparent)` }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.5, color:text, background:bg, minHeight:'1122px', width:'100%', boxSizing:'border-box', overflowX:'hidden' }}>
      <div style={{ padding:'36px 48px 28px', borderBottom:`1px solid ${atsMode?'#e5e7eb':'rgba(255,255,255,0.08)'}`, background:atsMode?'transparent':`linear-gradient(160deg, ${hexAlpha(primary,0.14)} 0%, ${hexAlpha(accent||primary,0.04)} 100%)` }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'20px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 6}px`, fontWeight:'800', color:atsMode?'#111827':'#ffffff', margin:'0 0 5px', fontFamily, letterSpacing:'-0.02em', lineHeight:1.1, wordBreak:'break-word' }}>{h.name||'Your Name'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:primary, fontWeight:'600', margin:'0 0 12px', fontFamily, letterSpacing:'0.02em' }}>{h.title}</p>}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px 18px' }}>
              {[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).map((v,i)=>(
                <span key={i} style={{ fontSize:`${sizes.contact - 0.5}px`, color:muted, fontFamily }}>{v}</span>
              ))}
            </div>
          </div>
          {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'84px', height:'84px', border:`2px solid ${hexAlpha(primary,0.5)}`, flexShrink:0, boxShadow:`0 0 22px ${hexAlpha(primary,0.28)}` }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,3fr) minmax(0,2fr)', padding:'24px 48px 40px', gap:'0' }}>
        <div style={{ paddingRight:'28px', borderRight:`1px solid ${atsMode?'#e5e7eb':'rgba(255,255,255,0.07)'}`, minWidth:0 }}>
          {data.summary && <div style={{ marginBottom:'18px' }}>{csmSecH('Profile')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} color={muted} /></div>}
          {data.experience.length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Experience')}{data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'13px', paddingLeft:'12px', borderLeft:`2px solid ${hexAlpha(primary,0.4)}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:atsMode?'#111827':'#ffffff', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:primary, fontFamily, flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, color:primary, fontWeight:'500', margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
              <ul style={{ paddingLeft:'14px', marginTop:'4px', listStyleType:'disc' }}>
                {(exp.bullets||[]).filter(Boolean).map((b,j)=><li key={j} style={{ fontSize:`${sizes.body}px`, color:muted, lineHeight:'1.65', marginBottom:'2px', fontFamily }}>{b}</li>)}
              </ul>
            </div>))}</div>}
          {data.projects.length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Projects')}{data.projects.map((proj,i)=>(
            <div key={i} style={{ marginBottom:'10px', paddingLeft:'12px', borderLeft:`2px solid ${hexAlpha(accent||primary,0.4)}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:atsMode?'#111827':'#ffffff', fontFamily }}>{proj.name}</span>
                  {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:accent||primary, fontFamily }}>{proj.techStack.join(', ')}</span>}
                </div>
                {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:muted, fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
              </div>
              {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:muted, fontFamily, margin:'2px 0' }}>{proj.description}</p>}
              {(proj.bullets||[]).filter(Boolean).length>0 && <ul style={{ paddingLeft:'14px', marginTop:'3px', listStyleType:'disc' }}>{proj.bullets.filter(Boolean).map((b,j)=><li key={j} style={{ fontSize:`${sizes.body}px`, color:muted, fontFamily }}>{b}</li>)}</ul>}
            </div>))}</div>}
          {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
          {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{csmSecH('References')}{(data.references||[]).map((ref,i)=><div key={i} style={{ marginBottom:'7px' }}><p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:text, fontFamily, margin:0 }}>{ref.name}</p>{(ref.title||ref.company)&&<p style={{ fontSize:`${sizes.date}px`, color:primary, fontFamily, margin:0 }}>{[ref.title,ref.company].filter(Boolean).join(', ')}</p>}{ref.email&&<p style={{ fontSize:`${sizes.date}px`, color:muted, fontFamily, margin:0 }}>{ref.email}</p>}</div>)}</div>}
          {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{csmSecH('Hobbies & Interests')}<p style={{ fontSize:`${sizes.body}px`, color:muted, fontFamily }}>{data.hobbies.join('  ·  ')}</p></div>}
          {data.custom?.title && <div style={{ marginBottom:'14px' }}>{csmSecH(data.custom.title)}{data.custom.body&&<p style={{ fontSize:`${sizes.body}px`, color:muted, lineHeight:'1.7', fontFamily, whiteSpace:'pre-wrap' }}>{data.custom.body}</p>}</div>}
        </div>
        <div style={{ paddingLeft:'26px' }}>
          {data.skills.length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'9px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:text, marginBottom:'4px', fontFamily }}>{cat.name}</p>}
              <span style={{ fontSize:`${sizes.body}px`, color:muted, fontFamily, lineHeight:1.6 }}>{(cat.items||[]).join(' · ')}</span>
            </div>))}</div>}
          {data.education.length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'10px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:text, fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:muted, fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:hexAlpha(muted,0.65), fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.certifications.length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Certifications')}{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:'6px' }}><p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:text, fontFamily, margin:0 }}>{c.name}</p>{c.issuer&&<p style={{ fontSize:`${sizes.date}px`, color:muted, fontFamily, margin:0 }}>{c.issuer}</p>}</div>)}</div>}
          {data.languages.length>0 && <div style={{ marginBottom:'18px' }}>{csmSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:muted, fontFamily, marginBottom:'3px' }}>{l.language}{l.proficiency&&<span style={{ color:hexAlpha(muted,0.65) }}> — {l.proficiency}</span>}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Template 18: Sharp ✦ ────────────────────────────────────────────────────
function CvSharpTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const shpSecH = (label) => (
    <div style={{ display:'flex', alignItems:'stretch', gap:'0', marginBottom:'13px' }}>
      <div style={{ width:'4px', background:atsMode?'#111827':primary, flexShrink:0 }}/>
      <div style={{ background:atsMode?'#111827':primary, padding:`${Math.max(4, Math.round((28 - sizes.secHead) / 2))}px 14px`, flex:1 }}>
        <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.1em', color:'#ffffff', margin:0, fontFamily, wordBreak:'break-word', lineHeight:1 }}>{label}</h2>
      </div>
      <div style={{ width:0, height:0, borderTop:'18px solid transparent', borderBottom:'18px solid transparent', borderLeft:`14px solid ${atsMode?'#111827':primary}`, flexShrink:0, alignSelf:'center' }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827', background:'#ffffff' }}>
      <div style={{ background:atsMode?'#111827':primary, padding:'28px 48px 30px', borderBottom:'3px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'16px' }}>
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <h1 style={{ fontSize:`${sizes.name + 5}px`, fontWeight:'900', color:'#ffffff', margin:'0 0 5px', fontFamily, letterSpacing:'-0.025em', wordBreak:'break-word', lineHeight:1.0 }}>{h.name||'YOUR NAME'}</h1>
            {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:'rgba(255,255,255,0.72)', fontWeight:'500', margin:'0 0 12px', fontFamily, textTransform:'uppercase', letterSpacing:'0.07em' }}>{h.title}</p>}
            <p style={{ fontSize:`${sizes.contact - 0.5}px`, color:'rgba(255,255,255,0.55)', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
          </div>
          {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'80px', height:'80px', border:'3px solid rgba(255,255,255,0.28)', flexShrink:0 }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
        </div>
      </div>
      <div style={{ padding:'10px 48px 40px' }}>
        {data.summary && <div style={{ marginBottom:'16px' }}>{shpSecH('Profile')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div>}
        {data.experience.length>0 && <div style={{ marginBottom:'16px' }}>{shpSecH('Experience')}{data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:'12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
              <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'800', color:'#111827', fontFamily, flex:1, minWidth:0, wordBreak:'break-word' }}>{exp.jobTitle}</span>
              <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, fontWeight:'600', flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
            </div>
            <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join('  ·  ')}</p>
            <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
          </div>))}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'24px', marginBottom:'16px' }}>
          {data.education.length>0 && <div>{shpSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'9px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.skills.length>0 && <div>{shpSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'7px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>))}</div>}
        </div>
        {data.projects.length>0 && <div style={{ marginBottom:'16px' }}>{shpSecH('Projects')}{data.projects.map((proj,i)=>(
          <div key={i} style={{ marginBottom:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'800', color:'#111827', fontFamily }}>{proj.name}</span>
                {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
              </div>
              {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
            </div>
            {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
            <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
          </div>))}</div>}
        {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'16px' }}>{shpSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {data.certifications.length>0 && <div style={{ marginBottom:'16px' }}>{shpSecH('Certifications')}{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'3px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280', fontWeight:'400' }}> — {c.issuer}</span>}</p>)}</div>}
        {data.languages.length>0 && <div style={{ marginBottom:'16px' }}>{shpSecH('Languages')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'16px' }}>{shpSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'16px' }}>{shpSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>shpSecH(label)}/>
      </div>
    </div>
  );
}

// ─── Template 19: Nova ✦ ─────────────────────────────────────────────────────
function CvNovaTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const novSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'11px' }}>
      <div style={{ width:'24px', height:'3px', background:atsMode?'#374151':primary, borderRadius:'2px' }}/>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:'#111827', margin:0, fontFamily, wordBreak:'break-word' }}>{label}</h2>
      <div style={{ flex:1, height:'1px', background:atsMode?'#e5e7eb':hexAlpha(primary,0.2) }}/>
    </div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.48, color:'#111827', overflowX:'hidden', background:'#ffffff' }}>
      <div style={{ display:'grid', gridTemplateColumns:h.photo?'auto minmax(0,1fr) auto':'minmax(0,1fr) auto', background:atsMode?'#111827':primary }}>
        {h.photo && <div style={{ padding:'24px 20px 24px 36px', display:'flex', alignItems:'center' }}><div style={{ borderRadius:'50%', overflow:'hidden', width:'88px', height:'88px', border:'3px solid rgba(255,255,255,0.28)', flexShrink:0 }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div></div>}
        <div style={{ padding:'24px 20px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <h1 style={{ fontSize:`${sizes.name + 2}px`, fontWeight:'800', color:'#ffffff', margin:'0 0 4px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:'rgba(255,255,255,0.75)', fontWeight:'500', margin:0, fontFamily }}>{h.title}</p>}
        </div>
        <div style={{ padding:'24px 36px 24px 16px', display:'flex', flexDirection:'column', justifyContent:'center', borderLeft:'1px solid rgba(255,255,255,0.15)', minWidth:0, overflowX:'hidden' }}>
          {[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).map((v,i)=>(
            <p key={i} style={{ fontSize:`${sizes.contact - 1}px`, color:'rgba(255,255,255,0.65)', fontFamily, margin:'2px 0', textAlign:'right', wordBreak:'break-all', lineHeight:1.5 }}>{v}</p>
          ))}
        </div>
      </div>
      <div style={{ padding:'26px 48px 40px' }}>
        {data.summary && <div style={{ marginBottom:'20px' }}>{novSecH('Summary')}<div style={{ paddingLeft:'34px' }}><SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></div></div>}
        {data.experience.length>0 && <div style={{ marginBottom:'20px' }}>{novSecH('Experience')}{data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:'13px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
              <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
              <span style={{ fontSize:`${sizes.date}px`, color:atsMode?'#374151':primary, fontFamily, fontWeight:'600', flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
            </div>
            <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:'#374151', margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location,exp.employmentType].filter(Boolean).join('  ·  ')}</p>
            <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
          </div>))}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'24px', marginBottom:'20px' }}>
          {data.education.length>0 && <div>{novSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'9px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</div>}
          {data.skills.length>0 && <div>{novSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'6px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'2px', fontFamily }}>{cat.name}</p>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>))}</div>}
        </div>
        {data.projects.length>0 && <div style={{ marginBottom:'20px' }}>{novSecH('Projects')}{data.projects.map((proj,i)=>(
          <div key={i} style={{ marginBottom:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
                <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
              </div>
              {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
            </div>
            {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
            <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
          </div>))}</div>}
        {(data.additionalExperience||[]).length>0 && <div style={{ marginBottom:'20px' }}>{novSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></div>}
        {data.certifications.length>0 && <div style={{ marginBottom:'18px' }}>{novSecH('Certifications')}<div style={{ paddingLeft:'34px' }}>{data.certifications.map((c,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', marginBottom:'3px', fontFamily }}><strong>{c.name}</strong>{c.issuer&&<span style={{ color:'#6b7280', fontWeight:'400' }}> — {c.issuer}</span>}</p>)}</div></div>}
        {data.languages.length>0 && <div style={{ marginBottom:'18px' }}>{novSecH('Languages')}<p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, wordBreak:'break-word', paddingLeft:'34px' }}>{data.languages.map(l=>`${l.language}${l.proficiency?` (${l.proficiency})`:''}`).join('  ·  ')}</p></div>}
        {(data.references||[]).length>0 && <div data-cv-sec="references" style={{ marginBottom:'18px' }}>{novSecH('References')}<div style={{ paddingLeft:'34px' }}><ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
        {(data.hobbies||[]).length>0 && <div data-cv-sec="hobbies" style={{ marginBottom:'18px' }}>{novSecH('Hobbies & Interests')}<div style={{ paddingLeft:'34px' }}><HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></div></div>}
        <CustomBlock custom={data.custom} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode} secHFn={label=>novSecH(label)}/>
      </div>
    </div>
  );
}

// ─── Template 20: Boxed ✦ ────────────────────────────────────────────────────
function CvBoxedTemplate({ data, theme, sizes, fontFamily, skillStyle, atsMode, labels }) {
  const primary = atsMode ? '#111827' : theme.primary;
  const accent  = atsMode ? '#374151' : theme.accent;
  const h = data?.header || EMPTY_DATA.header;
  const boxSecH = (label) => (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
      <div style={{ width:'3px', height:`${sizes.secHead + 4}px`, background:atsMode?'#374151':primary, borderRadius:'2px', flexShrink:0 }}/>
      <h2 style={{ fontSize:`${sizes.secHead}px`, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.09em', color:'#111827', margin:0, fontFamily, wordBreak:'break-word' }}>{label}</h2>
    </div>
  );
  const Card = ({ children, accent: cardAccent=false }) => (
    <div style={{ border:`1px solid ${cardAccent&&!atsMode?hexAlpha(primary,0.22):'#e5e7eb'}`, borderRadius:'10px', padding:'16px 20px', marginBottom:'12px', backgroundColor:'#ffffff', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', borderTop:cardAccent&&!atsMode?`3px solid ${primary}`:'1px solid #e5e7eb' }}>{children}</div>
  );
  return (
    <div style={{ fontFamily, lineHeight:1.45, color:'#111827', padding:'22px 30px', background:'#f1f5f9', minHeight:'1122px', width:'100%', boxSizing:'border-box', overflowX:'hidden' }}>
      <div style={{ border:`2px solid ${atsMode?'#374151':primary}`, borderRadius:'12px', padding:'22px 28px', marginBottom:'14px', background:'#ffffff', display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'flex-start', gap:'16px', boxShadow:`0 4px 14px ${hexAlpha(atsMode?'#374151':primary,0.1)}` }}>
        <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
          <h1 style={{ fontSize:`${sizes.name + 1}px`, fontWeight:'800', color:'#111827', margin:'0 0 4px', fontFamily, wordBreak:'break-word', lineHeight:1.1 }}>{h.name||'Your Name'}</h1>
          {h.title && <p style={{ fontSize:`${sizes.titleLine}px`, color:atsMode?'#374151':primary, fontWeight:'600', margin:'0 0 8px', fontFamily }}>{h.title}</p>}
          <p style={{ fontSize:`${sizes.contact - 0.5}px`, color:'#6b7280', fontFamily, margin:0, lineHeight:1.7 }}>{[h.email,h.phone,h.location,h.linkedin,h.github,h.portfolio].filter(Boolean).join('  ·  ')}</p>
        </div>
        {h.photo && <div style={{ borderRadius:'50%', overflow:'hidden', width:'80px', height:'80px', border:`2.5px solid ${atsMode?'#e5e7eb':hexAlpha(primary,0.38)}`, flexShrink:0 }}><img src={h.photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }}/></div>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,3fr) minmax(0,2fr)', gap:'12px', overflowX:'hidden' }}>
        <div>
          {data.summary && <Card accent>{boxSecH('Summary')}<SummaryBlock text={data.summary} fontFamily={fontFamily} sizes={sizes} /></Card>}
          {data.experience.length>0 && <Card accent>{boxSecH('Experience')}{data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'2px 8px' }}>
                <span style={{ fontSize:`${sizes.jobTitle}px`, fontWeight:'700', color:'#111827', fontFamily, wordBreak:'break-word', minWidth:0, flex:1 }}>{exp.jobTitle}</span>
                <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, fontWeight:'500', flexShrink:0 }}>{[exp.startDate,exp.current?'Present':exp.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'600', color:atsMode?'#374151':primary, margin:'1px 0 3px', fontFamily }}>{[exp.company,exp.location].filter(Boolean).join(', ')}</p>
              <PreviewBullets bullets={exp.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>))}</Card>}
          {data.projects.length>0 && <Card accent>{boxSecH('Projects')}{data.projects.map((proj,i)=>(
            <div key={i} style={{ marginBottom:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'2px 8px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'7px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:`${sizes.jobTitle-0.5}px`, fontWeight:'700', color:'#111827', fontFamily }}>{proj.name}</span>
                  {proj.techStack.length>0 && <span style={{ fontSize:`${sizes.date}px`, color:'#4b5563', fontFamily }}>{proj.techStack.join(', ')}</span>}
                </div>
                {(proj.startDate||proj.endDate) && <span style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, flexShrink:0 }}>{[proj.startDate,proj.endDate].filter(Boolean).join(' – ')}</span>}
              </div>
              {proj.description && <p style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, margin:'2px 0', wordBreak:'break-word' }}>{proj.description}</p>}
              <PreviewBullets bullets={proj.bullets} fontFamily={fontFamily} sizes={sizes}/>
            </div>))}</Card>}
          {(data.additionalExperience||[]).length>0 && <Card accent>{boxSecH('Additional Experience')}<AdditionalExpBlock items={data.additionalExperience} fontFamily={fontFamily} sizes={sizes}/></Card>}
          {(data.references||[]).length>0 && <Card>{boxSecH('References')}<ReferencesBlock references={data.references} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></Card>}
          {(data.hobbies||[]).length>0 && <Card>{boxSecH('Hobbies & Interests')}<HobbiesBlock hobbies={data.hobbies} primary={primary} fontFamily={fontFamily} sizes={sizes} atsMode={atsMode}/></Card>}
          {data.custom?.title && <Card accent>{boxSecH(data.custom.title)}{data.custom.body&&<p style={{ fontSize:`${sizes.body}px`, color:'#374151', lineHeight:'1.7', fontFamily, margin:0, whiteSpace:'pre-wrap' }}>{data.custom.body}</p>}</Card>}
        </div>
        <div>
          {data.education.length>0 && <Card>{boxSecH('Education')}{data.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:'10px' }}>
              <p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:'0 0 1px' }}>{[edu.degree,edu.field].filter(Boolean).join(' in ')}</p>
              <p style={{ fontSize:`${sizes.body-0.5}px`, color:'#6b7280', fontFamily, margin:0 }}>{edu.institution}{edu.gpa?` · GPA ${edu.gpa}`:''}</p>
              <p style={{ fontSize:`${sizes.date}px`, color:'#9ca3af', fontFamily, margin:0 }}>{[edu.startYear,edu.endYear].filter(Boolean).join(' – ')}</p>
            </div>))}</Card>}
          {data.skills.length>0 && <Card>{boxSecH('Skills')}{data.skills.map((cat,i)=>(
            <div key={i} style={{ marginBottom:'8px' }}>
              {cat.name && <p style={{ fontSize:`${sizes.body-0.5}px`, fontWeight:'700', color:'#111827', marginBottom:'3px', fontFamily }}>{cat.name}</p>}
              <SkillItems items={cat.items} primary={primary} accent={accent} sizes={sizes} fontFamily={fontFamily} skillStyle={skillStyle} atsMode={atsMode}/>
            </div>))}</Card>}
          {data.certifications.length>0 && <Card>{boxSecH('Certifications')}{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:'6px' }}><p style={{ fontSize:`${sizes.body}px`, fontWeight:'700', color:'#111827', fontFamily, margin:0 }}>{c.name}</p>{c.issuer&&<p style={{ fontSize:`${sizes.date}px`, color:'#6b7280', fontFamily, margin:0, fontStyle:'italic' }}>{c.issuer}</p>}</div>)}</Card>}
          {data.languages.length>0 && <Card>{boxSecH('Languages')}{data.languages.map((l,i)=><p key={i} style={{ fontSize:`${sizes.body}px`, color:'#374151', fontFamily, marginBottom:'4px' }}>{l.language}{l.proficiency&&<span style={{ color:'#6b7280' }}> — {l.proficiency}</span>}</p>)}</Card>}
        </div>
      </div>
    </div>
  );
}

export { CvGradientTemplate, CvTwoColumnTemplate, CvCenteredTemplate, CvSlateTemplate, CvCosmicTemplate, CvSharpTemplate, CvNovaTemplate, CvBoxedTemplate };
