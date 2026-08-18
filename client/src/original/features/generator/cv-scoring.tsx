// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { calcAtsScore, calcCompletenessScore, calcGrammarScore, safeArr, safeStr, hasRealWords, isRealName, isValidEmail, isRealPhone, isRealLink, EMPTY_DATA, KNOWN_SKILLS, isSkillLike } from './cv-core';

function scoreColor(score) {
  return score >= 80 ? '#15803d' : score >= 60 ? '#92400e' : '#991b1b';
}
// ─── Multi-Score Panel ────────────────────────────────────────────────────────
function CvResumeScore({ data }) {
  const [open, setOpen] = useState(false);
  const ats        = useMemo(() => calcAtsScore(data), [data]);
  const completeness = useMemo(() => calcCompletenessScore(data), [data]);
  const grammar    = useMemo(() => calcGrammarScore(data), [data]);

  // Keyword score (requires job desc passed externally; standalone = skill keyword density)
 const skillWords = useMemo(() => {
  const items = safeArr(data?.skills).flatMap(s => safeArr(s.items));
  const unique = new Set(items.map(i => i.trim().toLowerCase()).filter(i => i.length >= 2));
  return Math.min(100, Math.round((unique.size / 15) * 100));
}, [data]);

  const overall = Math.round((ats + completeness + grammar + skillWords) / 4);
  const overallColor = scoreColor(overall);
  const scores = [
    { label: 'ATS',          value: ats,          desc: 'Detected by applicant tracking systems', color: '#2563eb' },
    { label: 'Completeness', value: completeness,  desc: 'Sections filled with quality content',   color: '#7c3aed' },
    { label: 'Grammar',      value: grammar,       desc: 'Bullet strength & writing quality',       color: '#059669' },
    { label: 'Keywords',     value: skillWords,    desc: 'Skills density (≥15 skills = 100)',        color: '#d97706' },
  ];

  return (
    <div className="mt-3 rounded-xl border border-blue-100 bg-white overflow-hidden shadow-sm">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-blue-50 hover:bg-blue-100 transition-colors border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Icon name="BarChart2" size={13} className="text-blue-600" />
          <span className="text-[11px] font-bold text-blue-900">Resume Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold tabular-nums" style={{ color: overallColor }}>{overall}</span>
          <span className="text-[10px] text-gray-500">/100</span>
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-blue-500" />
        </div>
      </button>
      {open && (
        <div className="px-3 py-3 flex flex-col gap-2.5">
          {scores.map(s => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-semibold text-gray-700">{s.label}</span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.value}%`, background: s.color }} />
              </div>
              <p className="text-[9.5px] text-gray-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
          <div className="pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-gray-800">Overall Score</span>
              <span className="text-[14px] font-bold tabular-nums" style={{ color: overallColor }}>{overall}/100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Professional Tips Panel ─────────────────────────────────────────────────
function CvProfessionalTips({ data }) {
  const [open, setOpen] = useState(false);
  const tips = [];
  const h = data?.header || EMPTY_DATA.header;

  if (!isRealName(h.name))               tips.push({ cat: 'Contact', icon: 'User',          text: 'Add your full real name — this is required on every professional resume' });
  if (!isValidEmail(h.email))            tips.push({ cat: 'Contact', icon: 'AlertCircle',   text: 'Add a valid email address (e.g. jane@gmail.com) — recruiters must be able to contact you' });
  if (!isRealPhone(h.phone))             tips.push({ cat: 'Contact', icon: 'AlertCircle',   text: 'Add a phone number with at least 7 digits so recruiters can call you directly' });
  if (!h.location?.trim())               tips.push({ cat: 'Contact', icon: 'Globe',         text: 'Add your city/country — many roles are location-specific' });
  if (!isRealLink(h.linkedin))           tips.push({ cat: 'Contact', icon: 'User',          text: 'Add your LinkedIn URL — 87% of recruiters check LinkedIn before interviews' });
  if (!isRealLink(h.github) && !isRealLink(h.portfolio)) tips.push({ cat: 'Contact', icon: 'Code2', text: 'Add a GitHub or portfolio link — shows real work beyond the resume' });
  if (!hasRealWords(h.title, 1))         tips.push({ cat: 'Contact', icon: 'Briefcase',     text: 'Add a professional headline (e.g. "Senior Full-Stack Engineer") below your name' });

  const sm = safeStr(data.summary);
  if (!sm)                               tips.push({ cat: 'Summary', icon: 'AlignLeft',     text: "Write a professional summary — it's the first thing recruiters read" });
  else if (!hasRealWords(sm, 5))         tips.push({ cat: 'Summary', icon: 'AlignLeft',     text: 'Summary appears to contain random text — write 3–4 real sentences describing your skills and value' });
  else if (sm.length < 100)             tips.push({ cat: 'Summary', icon: 'AlignLeft',     text: 'Summary is too short — aim for 3–4 sentences (150–300 chars) covering role, top skills, and value' });
  else if (sm.length > 600)             tips.push({ cat: 'Summary', icon: 'AlignLeft',     text: 'Summary is too long — keep it under 5 sentences; recruiters spend ~7 seconds on first scan' });

  if (safeArr(data?.experience).length === 0) tips.push({ cat: 'Experience',   icon: 'Briefcase',     text: 'No work experience added — even internships, freelance, or volunteer work counts' });
 const expBullets = safeArr(data?.experience).flatMap(e => safeArr(e.bullets).filter(Boolean));
const weakJobs   = safeArr(data?.experience).filter(e => safeArr(e.bullets).filter(Boolean).length < 3);
  const hasNumbers = expBullets.some(b => /\d+/.test(b));
  if (data.experience.length > 0 && !hasNumbers) tips.push({ cat: 'Experience', icon: 'Hash', text: 'No numbers in bullet points — quantify impact (e.g. "Reduced load time by 40%", "Led team of 8")' });
const weakVerbs = expBullets.filter(b =>
  /^(was|did|helped|worked|responsible|involved|assisted|tasked|handled|participated|engaged|contributed|supported|collaborated|served)/i.test(b.trim())
);
  if (weakVerbs.length > 0)         tips.push({ cat: 'Experience',   icon: 'Briefcase',     text: 'Weak bullet openers — start with strong action verbs: "Built", "Led", "Increased", "Designed"' });
  const longBullets = expBullets.filter(b => b.length > 200);
  if (longBullets.length > 0)       tips.push({ cat: 'Experience',   icon: 'Briefcase',     text: `${longBullets.length} bullet(s) are too long — trim to 1–2 lines; recruiters skim, not read` });
  const noDate = data.experience.filter(e => !e.startDate);
  if (noDate.length > 0)            tips.push({ cat: 'Experience',   icon: 'Calendar',      text: `${noDate.length} experience entry/entries missing dates — always include start/end month and year` });

  if (safeArr(data?.education).length === 0)  tips.push({ cat: 'Education',    icon: 'GraduationCap', text: 'No education added — include at least your highest qualification' });

  if (safeArr(data?.skills).length === 0)     tips.push({ cat: 'Skills',       icon: 'Code2',         text: 'No skills listed — ATS software filters resumes by keywords in Skills section' });
  else {
const totalSkillItems = safeArr(data?.skills).reduce((sum, s) => sum + safeArr(s.items).length, 0);
    if (totalSkillItems < 6)        tips.push({ cat: 'Skills',       icon: 'Code2',         text: 'Very few skills listed — aim for at least 10–15 relevant skills across categories' });
    if (totalSkillItems > 30)       tips.push({ cat: 'Skills',       icon: 'Code2',         text: 'Too many skills (30+) — trim to the most relevant 15–20; quality over quantity' });
  }

  if (safeArr(data?.projects).length === 0)   tips.push({ cat: 'Projects',     icon: 'FolderOpen',    text: 'No projects listed — include 2–3 projects to prove practical skills' });
  else {
const noDesc = safeArr(data?.projects).filter(p => !p.description && !safeArr(p.bullets).filter(Boolean).length);
    if (noDesc.length > 0)          tips.push({ cat: 'Projects',     icon: 'FolderOpen',    text: `${noDesc.length} project(s) have no description — explain what you built` });
const noTech = safeArr(data?.projects).filter(p => !safeArr(p.techStack).length);
    if (noTech.length > 0)          tips.push({ cat: 'Projects',     icon: 'FolderOpen',    text: `${noTech.length} project(s) missing tech stack — list the technologies used` });
  }

  if (safeArr(data?.certifications).length === 0) tips.push({ cat: 'Certs',   icon: 'Award',         text: 'No certifications — even one cert (AWS, Google, CompTIA) significantly boosts credibility' });
  if (safeArr(data?.languages).length === 0)  tips.push({ cat: 'Languages',    icon: 'Globe',         text: 'Add languages you speak — multilingual candidates stand out in global teams' });

const totalContent = [safeStr(data?.summary), ...expBullets, ...safeArr(data?.skills).flatMap(s => safeArr(s.items))].join(' ').split(/\s+/).length;
  if (totalContent < 150)           tips.push({ cat: 'Content',      icon: 'AlertCircle',   text: 'Resume is very sparse — aim for at least 300–400 words of content' });

  const score = Math.max(0, 100 - tips.length * 5);
  const tipScoreColor = scoreColor(score);

  // useMemo must be called before any conditional return (Rules of Hooks)
  const grouped = useMemo(() => {
    const map = {};
    for (const tip of tips) {
      if (!map[tip.cat]) map[tip.cat] = [];
      map[tip.cat].push(tip);
    }
    return map;
  }, [tips]);
  const categories = Object.keys(grouped);

  if (tips.length === 0) return (
    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
      <Icon name="CheckCircle" size={15} className="text-green-600 shrink-0" />
      <div>
        <p className="text-[11.5px] text-green-800 font-bold">Resume looks professional — great work!</p>
        <p className="text-[10px] text-green-700 mt-0.5">All key sections are complete and optimised.</p>
      </div>
    </div>
  );

  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-amber-100 border-b border-amber-200 hover:bg-amber-200 transition-colors">
        <div className="flex items-center gap-1.5">
          <Icon name="Lightbulb" size={13} className="text-amber-600" />
          <p className="text-[11px] font-bold text-amber-900">Resume Checklist</p>
          <span className="text-[10px] text-amber-700 font-medium">({tips.length} tip{tips.length !== 1 ? 's' : ''})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold" style={{ color: tipScoreColor }}>{score}/100</span>
          <div className="w-14 h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: tipScoreColor }} />
          </div>
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-amber-600 shrink-0" />
        </div>
      </button>
      {open && (
        <div className="p-3 flex flex-col gap-3">
          {categories.map(cat => (
            <div key={cat}>
              <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">{cat}</p>
              <ul className="flex flex-col gap-1.5">
                {grouped[cat].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white rounded-lg px-2.5 py-2 border border-amber-100">
                    <Icon name={tip.icon} size={11} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-700 leading-relaxed">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Job Match Smart Suggestions ─────────────────────────────────────────────
function classifyKw(kw) {
  const k = kw.toLowerCase();
  if (/\b(aws|gcp|azure|ec2|s3|lambda|cloud|heroku|vercel|netlify|cloudflare|digitalocean)\b/.test(k)) return 'cloud';
  if (/\b(postgres|postgresql|mysql|mongodb|redis|sqlite|dynamo|cassandra|database|sql|nosql|orm|prisma|sequelize)\b/.test(k)) return 'database';
  if (/\b(jest|mocha|cypress|selenium|vitest|playwright|testing|unit\s*test|e2e|tdd|bdd|coverage)\b/.test(k)) return 'testing';
  if (/\b(docker|kubernetes|k8s|ci[\/ ]?cd|jenkins|github\s*actions|gitlab|terraform|ansible|nginx|linux|bash|shell|devops|helm)\b/.test(k)) return 'devops';
  if (/\b(api|rest|graphql|grpc|websocket|webhook|microservice|oauth|jwt|openapi|swagger)\b/.test(k)) return 'api';
  if (/\b(agile|scrum|kanban|sprint|jira|confluence|oop|solid|design\s*pattern|tdd|mvp|lean|sdlc)\b/.test(k)) return 'methodology';
  return 'skill';
}

function generateKwSentence(kw, type) {
  switch (type) {
    case 'cloud':       return `Deployed and scaled production infrastructure using ${kw} for high-availability and cost-efficient systems`;
    case 'database':    return `Designed, queried, and optimized ${kw} databases handling thousands of records in production`;
    case 'testing':     return `Written automated tests with ${kw} achieving 80%+ code coverage across core application modules`;
    case 'devops':      return `Configured ${kw} pipelines for automated build, test, and deployment to production environments`;
    case 'api':         return `Built and integrated ${kw} endpoints enabling seamless communication across distributed services`;
    case 'methodology': return `Applied ${kw} principles across team projects improving delivery speed and overall code quality`;
    default:            return `Proficient in ${kw} — applied in real-world projects to build scalable and maintainable applications`;
  }
}

const SOFT_PATTERNS = [
  { re: /problem[\s\-]?solv/i,        kw: 'Problem-Solving',       summary: 'Strong problem-solving mindset — break down complex challenges into clean, maintainable engineering solutions.' },
  { re: /analytical/i,                kw: 'Analytical Thinking',   summary: 'Analytical approach to system design and debugging, translating ambiguous requirements into precise implementations.' },
  { re: /communicat/i,                kw: 'Communication',         summary: 'Clear communicator experienced presenting technical concepts to non-technical stakeholders and cross-functional teams.' },
  { re: /collaborat/i,                kw: 'Collaboration',         summary: 'Collaborative team player who thrives in agile environments — comfortable with code reviews, pair programming, and sprint planning.' },
  { re: /leadership|lead\b/i,         kw: 'Leadership',            summary: 'Hands-on technical leader who mentors engineers, drives architecture decisions, and owns delivery end-to-end.' },
  { re: /adapt/i,                     kw: 'Adaptability',          summary: 'Adaptable fast learner who quickly picks up new languages, frameworks, and domain knowledge to contribute from day one.' },
  { re: /curiosit/i,                  kw: 'Curiosity',             summary: 'Intellectually curious engineer who actively keeps up with industry trends and experiments with emerging tools and techniques.' },
  { re: /mentor/i,                    kw: 'Mentoring',             summary: 'Experienced mentoring junior developers through code reviews, pair programming, and structured onboarding sessions.' },
  { re: /ownership|own\b/i,           kw: 'Ownership',             summary: 'Takes full ownership of features from ideation to production — including testing, documentation, and post-deployment monitoring.' },
  { re: /fast[\s\-]?paced/i,          kw: 'Fast-Paced Delivery',   summary: 'Experienced in fast-paced startup and product environments where priorities shift and delivery timelines are tight.' },
  { re: /independent|autonomou/i,     kw: 'Independence',          summary: 'Highly independent contributor — takes vague requirements, clarifies scope, and self-manages delivery without close supervision.' },
  { re: /stakeholder/i,               kw: 'Stakeholder Management',summary: 'Confident communicating project status, risks, and trade-offs to both technical and business stakeholders.' },
  { re: /detail[\s\-]?orient/i,       kw: 'Attention to Detail',   summary: 'Detail-oriented engineer with a systematic approach to code quality, test coverage, and documentation accuracy.' },
  { re: /cross[\s\-]?functional/i,    kw: 'Cross-Functional Work', summary: 'Experienced working across engineering, design, and product teams to align technical solutions with business goals.' },
  { re: /time[\s\-]?manag/i,          kw: 'Time Management',       summary: 'Strong time management skills — consistently deliver features on schedule by breaking work into trackable milestones.' },
  { re: /innovat/i,                   kw: 'Innovation',            summary: 'Passionate about innovation — regularly contribute new ideas, prototypes, and process improvements to the team.' },
  { re: /open[\s\-]?source/i,         kw: 'Open-Source',           summary: 'Contributed to open-source projects — familiar with public collaboration workflows, PR reviews, and community standards.' },
  { re: /third[\s\-]?party|integrat/i,kw: 'Third-Party Integration',bullet: 'Integrated third-party APIs and external services to extend platform capabilities with minimal coupling' },
  { re: /deploy/i,                    kw: 'Deployment',             bullet: 'Managed end-to-end deployment pipelines from code commit through staging, testing, and production release' },
  { re: /scalab/i,                    kw: 'Scalability',            bullet: 'Designed and optimised system architecture for scalability, reducing latency and supporting 10x traffic growth' },
  { re: /secur/i,                     kw: 'Security',               bullet: 'Implemented security best practices including input validation, HTTPS enforcement, and role-based access control' },
  { re: /perform/i,                   kw: 'Performance',            bullet: 'Profiled and optimised application performance, achieving significant reductions in page load time and API response latency' },
];

function CvJobMatchFixes({ data, setData, missing, jobDesc }) {
  const [expanded, setExpanded] = useState(null);

  const hardSuggestions = useMemo(() =>
    missing.slice(0, 15).map(kw => ({ kw, type: classifyKw(kw), sentence: generateKwSentence(kw, classifyKw(kw)), kind: 'hard' }))
  , [missing]);

  const softSuggestions = useMemo(() => {
    if (!jobDesc) return [];
    const results = [];
    const seen = new Set();
    SOFT_PATTERNS.forEach(({ re, kw, summary, bullet }) => {
      if (re.test(jobDesc) && !seen.has(kw)) {
        seen.add(kw);
        results.push({ kw, summary: summary || null, bullet: bullet || null, kind: summary ? 'soft' : 'action' });
      }
    });
    return results.slice(0, 10);
  }, [jobDesc]);

  const totalCount = hardSuggestions.length + softSuggestions.length;
  if (!totalCount) return null;

  const addSkill = (kw, type) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const skills = next.skills || [];
      const catMatchers = {
        cloud:     /cloud|devops|infra|tools?|ops/i,
        database:  /database|db|data/i,
        testing:   /test|qa|quality/i,
        devops:    /devops|tools?|infra|ops|cloud/i,
        api:       /backend|server|api|node/i,
        skill:     /frontend|backend|language|framework|skill/i,
      };
      const pattern = catMatchers[type];
      let cat = pattern ? skills.find(c => pattern.test(c.name)) : null;
      if (!cat) cat = skills.find(c => /^(tools?|other|general|misc|additional)/i.test(c.name));
      if (!cat) cat = skills[skills.length - 1];
      if (!cat) { skills.push({ name:'Tools', items:[] }); cat = skills[skills.length - 1]; }
      if (!(cat.items||[]).some(i => i.toLowerCase() === kw.toLowerCase())) {
        cat.items = [...(cat.items||[]), kw];
      }
      next.skills = skills;
      return next;
    });
  };

  const hasExp = safeArr(data?.experience).length > 0;
  const addBullet = (kw, sentence) => {
    if (!hasExp) return;
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.experience[0].bullets = [...(next.experience[0].bullets||[]), sentence];
      return next;
    });
  };

  const addSummary = (kw, sentence) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.summary = (next.summary ? next.summary.trimEnd() + ' ' : '') + sentence;
      return next;
    });
  };

  const typeBadge = {
    cloud:'bg-sky-100 text-sky-700', database:'bg-violet-100 text-violet-700',
    testing:'bg-emerald-100 text-emerald-700', devops:'bg-orange-100 text-orange-700',
    api:'bg-indigo-100 text-indigo-700', methodology:'bg-teal-100 text-teal-700',
    skill:'bg-gray-100 text-gray-600',
  };

  const skillItems = useMemo(() =>
    new Set(safeArr(data?.skills).flatMap(s => safeArr(s.items).map(i => i.toLowerCase())))
  , [data?.skills]);

  const summaryText = safeStr(data?.summary);
  const exp0Bullets = safeArr(data?.experience?.[0]?.bullets);

  const renderCard = (item, key) => {
    const { kw, type, sentence, kind, summary, bullet } = item;
    const displaySentence = sentence || bullet || summary || '';
    const skAdded = skillItems.has(kw.toLowerCase());
    const blAdded = exp0Bullets.some(b => b === displaySentence);
    const smAdded = summaryText.includes((displaySentence).slice(0, 40));
    const isOpen  = expanded === key;
    const isSoft  = kind === 'soft';
    const isAction = kind === 'action';

    return (
      <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] font-bold text-gray-800 truncate">{kw}</span>
            {isSoft && <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-pink-100 text-pink-700">Soft skill</span>}
            {isAction && <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-amber-100 text-amber-700">Experience</span>}
            {!isSoft && !isAction && type && <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${typeBadge[type] || 'bg-gray-100 text-gray-600'}`}>{type.charAt(0).toUpperCase()+type.slice(1)}</span>}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {!isSoft && !isAction && (
              <button disabled={skAdded} onClick={() => addSkill(kw, type)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all active:scale-95 ${skAdded ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                <Icon name={skAdded ? 'Check' : 'Plus'} size={9}/>
                {skAdded ? '✓ Skill' : '+ Skills'}
              </button>
            )}
            {(isSoft || isAction) ? (
              <>
                {(isSoft ? summary : bullet) && (
                  <button disabled={smAdded} onClick={() => addSummary(kw, isSoft ? summary : bullet)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all active:scale-95 ${smAdded ? 'bg-green-100 text-green-700' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                    <Icon name={smAdded ? 'Check' : 'Plus'} size={9}/>
                    {smAdded ? '✓ Summary' : '+ Summary'}
                  </button>
                )}
                <button
                  disabled={blAdded || !hasExp}
                  title={!hasExp ? 'Add at least one Experience entry first' : 'Add as experience bullet'}
                  onClick={() => addBullet(kw, isSoft ? summary : bullet)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all active:scale-95 ${blAdded ? 'bg-green-100 text-green-700' : !hasExp ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  <Icon name={blAdded ? 'Check' : 'Plus'} size={9}/>
                  {blAdded ? '✓ Bullet' : !hasExp ? 'No Exp' : '+ Bullet'}
                </button>
              </>
            ) : (
              <button
                disabled={blAdded || !hasExp}
                title={!hasExp ? 'Add at least one Experience entry first' : 'Add as experience bullet'}
                onClick={() => addBullet(kw, displaySentence)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all active:scale-95 ${blAdded ? 'bg-green-100 text-green-700' : !hasExp ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                <Icon name={blAdded ? 'Check' : 'Plus'} size={9}/>
                {blAdded ? '✓ Bullet' : !hasExp ? 'No Exp' : '+ Bullet'}
              </button>
            )}
            <button onClick={() => setExpanded(isOpen ? null : key)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={12}/>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="px-3 pb-3 border-t border-gray-100">
            <p className="text-[9.5px] text-gray-400 uppercase font-semibold tracking-wide mt-2 mb-1">Suggested text (click ▼ to preview before adding):</p>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-[11.5px] text-gray-700 leading-relaxed">"{displaySentence}"</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              {isSoft ? '+ Summary → appends to profile summary  ·  + Bullet → adds to most recent experience' :
               isAction ? '+ Summary → appends to profile summary  ·  + Bullet → adds to most recent experience' :
               '+ Skills → adds to skills section  ·  + Bullet → adds to most recent experience'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-orange-200 bg-white overflow-hidden shadow-sm">
      <div className="px-3 py-2.5 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={13} className="text-orange-500"/>
          <span className="text-[12px] font-bold text-gray-800">Smart Add Suggestions</span>
          <span className="text-[10px] text-orange-600 font-medium">({totalCount} suggestion{totalCount !== 1 ? 's' : ''})</span>
        </div>
        <span className="text-[10px] text-gray-400">Click any button to add directly to resume</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {hardSuggestions.length > 0 && (
          <>
            <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest px-1">Missing Tech Skills</p>
            {hardSuggestions.map(item => renderCard(item, `hard-${item.kw}`))}
          </>
        )}
        {softSuggestions.length > 0 && (
          <>
            <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest px-1 mt-1">Soft Skills & Qualities Mentioned in JD</p>
            {softSuggestions.map(item => renderCard(item, `soft-${item.kw}`))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ATS Fix Panel ───────────────────────────────────────────────────────────
const WEAK_VERB_RE = /^(responsible\s+for|was\s+responsible\s+for|worked\s+(on|with|in|alongside)?|helped(\s+(with|to))?|assisted(\s+(in|with))?|tasked\s+with|handled|participated(\s+in)?|served(\s+(as|on|in))?|engaged(\s+(with|in))?|contributed(\s+to)?|collaborated(\s+(with|on))?|supported|involved\s+in|was\s+involved\s+in|was\s+in\s+charge\s+of|in\s+charge\s+of|was\s+part\s+of|did|made\s+(sure|the|a|an)?|used\s+to)\s+/i;

const STRONG_VERBS = ['Led','Built','Developed','Engineered','Designed','Implemented','Managed','Delivered','Optimized','Launched','Architected','Deployed','Drove','Owned','Executed','Created','Streamlined','Spearheaded','Achieved','Reduced','Increased','Automated'];

function buildAtsFixes(data) {
  const fixes = [];

  // 1. Weak verb openers — experience
  safeArr(data?.experience).forEach((exp, ei) => {
    safeArr(exp?.bullets).forEach((bullet, bi) => {
      if (!bullet?.trim()) return;
      if (WEAK_VERB_RE.test(bullet.trim())) {
        fixes.push({ id:`wv-e-${ei}-${bi}`, type:'weak_verb', sev:'high', cat:'Experience',
          label:`Weak opener in "${exp.jobTitle||'experience'}"`,
          original: bullet.trim(),
          path:['experience',ei,'bullets',bi] });
      }
    });
  });

  // 2. Weak verb openers — projects
  safeArr(data?.projects).forEach((proj, pi) => {
    safeArr(proj?.bullets).forEach((bullet, bi) => {
      if (!bullet?.trim()) return;
      if (WEAK_VERB_RE.test(bullet.trim())) {
        fixes.push({ id:`wv-p-${pi}-${bi}`, type:'weak_verb', sev:'high', cat:'Projects',
          label:`Weak opener in "${proj.name||'project'}"`,
          original: bullet.trim(),
          path:['projects',pi,'bullets',bi] });
      }
    });
  });

  // 3. Bullets starting with "I "
  safeArr(data?.experience).forEach((exp, ei) => {
    safeArr(exp?.bullets).forEach((bullet, bi) => {
      if (!bullet?.trim()) return;
      if (/^I\s+[a-z]/i.test(bullet.trim())) {
        const rest = bullet.trim().replace(/^I\s+/i,'');
        const fixed = rest.charAt(0).toUpperCase() + rest.slice(1);
        fixes.push({ id:`i-${ei}-${bi}`, type:'direct', sev:'medium', cat:'Experience',
          label:`Bullet starts with "I" — avoid first person`,
          original: bullet.trim(),
          preview: fixed,
          path:['experience',ei,'bullets',bi], replacement: fixed });
      }
    });
  });

  // 4. No numbers in experience
  const allExpBullets = safeArr(data?.experience).flatMap(e => safeArr(e?.bullets).filter(Boolean));
  if (allExpBullets.length > 0 && !allExpBullets.some(b => /\d/.test(b))) {
    fixes.push({ id:'no-nums', type:'tip', sev:'high', cat:'Experience',
      label:'No numbers or metrics in any bullet',
      hint:'Recruiters love impact numbers. Examples:\n• "Improved performance" → "Improved performance by 45%"\n• "Managed team" → "Managed team of 8 engineers"\n• "Saved time" → "Saved 10+ hours/week through automation"' });
  }

  // 5. Very long bullets
  allExpBullets.forEach((bullet, i) => {
    if (bullet.length > 220) {
      fixes.push({ id:`long-${i}`, type:'tip', sev:'low', cat:'Experience',
        label:`Bullet too long (${bullet.length} chars)`,
        hint:`"${bullet.slice(0,60)}..."\n\nKeep bullets under 180 characters. Split into 2 shorter bullets.` });
    }
  });

  // 6. Summary missing or short
  const sm = safeStr(data?.summary);
  if (!sm) {
    const topSkills = safeArr(data?.skills).flatMap(s => safeArr(s.items)).slice(0,4).join(', ');
    const role = safeStr(data?.header?.title) || 'Software Developer';
    const template = `${role} with a passion for building scalable, user-focused applications. Skilled in ${topSkills||'modern technologies'}. Committed to writing clean code, continuous learning, and delivering quality results.`;
    fixes.push({ id:'no-summary', type:'direct', sev:'high', cat:'Summary',
      label:'No profile summary — first thing recruiters read',
      original:'(empty)',
      preview: template,
      path:['summary'], replacement: template });
  } else {
    const wc = sm.split(/\s+/).filter(Boolean).length;
    if (wc < 20) {
      fixes.push({ id:'short-summary', type:'tip', sev:'medium', cat:'Summary',
        label:`Summary too short — only ${wc} words`,
        hint:'Aim for 40–60 words covering:\n• Your role and years of experience\n• Top 2–3 skills or technologies\n• What value you bring to the team' });
    }
  }

  // 7. Missing LinkedIn
  if (!isRealLink(safeStr(data?.header?.linkedin))) {
    fixes.push({ id:'no-linkedin', type:'tip', sev:'medium', cat:'Contact',
      label:'No LinkedIn URL — 87% of recruiters verify on LinkedIn',
      hint:'Add your LinkedIn: linkedin.com/in/your-name\n\nGo to the Header section to add it.' });
  }

  // 8. Low skills count
  const skillCount = safeArr(data?.skills).reduce((s,c) => s + safeArr(c.items).length, 0);
  if (skillCount > 0 && skillCount < 8) {
    fixes.push({ id:'low-skills', type:'tip', sev:'medium', cat:'Skills',
      label:`Only ${skillCount} skills listed — ATS needs keywords`,
      hint:'Aim for 12–20 skills across categories:\n• Frontend: React, TypeScript, Tailwind\n• Backend: Node.js, Express, REST APIs\n• Databases: PostgreSQL, MongoDB\n• Tools: Git, Docker, CI/CD' });
  }

  // 9. Experience missing dates
  const noDates = safeArr(data?.experience).filter(e => !e.startDate);
  if (noDates.length > 0) {
    fixes.push({ id:'no-dates', type:'tip', sev:'medium', cat:'Experience',
      label:`${noDates.length} experience entr${noDates.length>1?'ies':'y'} missing start date`,
      hint:'ATS systems expect date ranges for all roles. Go to each experience entry and add the start/end dates.' });
  }

  return fixes;
}

function CvAtsFix({ data, setData }) {
  const [expanded, setExpanded] = useState(null);
  const [applied,  setApplied]  = useState({});
  const fixes = useMemo(() => buildAtsFixes(data), [data]);

  const applyWeakVerb = (fix, verb) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let t = next;
      fix.path.slice(0,-1).forEach(k => { t = t[k]; });
      const orig = t[fix.path.at(-1)];
      const rest = orig.replace(WEAK_VERB_RE,'');
      t[fix.path.at(-1)] = verb + ' ' + rest.charAt(0).toLowerCase() + rest.slice(1);
      return next;
    });
    setApplied(p => ({...p, [fix.id]: true}));
    setExpanded(null);
  };

  const applyDirect = (fix) => {
    if (!fix.path) return;
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let t = next;
      fix.path.slice(0,-1).forEach(k => { t = t[k]; });
      t[fix.path.at(-1)] = fix.replacement;
      return next;
    });
    setApplied(p => ({...p, [fix.id]: true}));
    setExpanded(null);
  };

  if (fixes.length === 0) return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
      <Icon name="CheckCircle" size={14} className="text-green-600 shrink-0"/>
      <p className="text-[11.5px] text-green-800 font-semibold">No ATS issues found — your resume is well optimised!</p>
    </div>
  );

  const sevColor = { high:'#dc2626', medium:'#d97706', low:'#6b7280' };
  const sevBg    = { high:'border-red-100 bg-red-50', medium:'border-amber-100 bg-amber-50', low:'border-gray-100 bg-gray-50' };
  const high = fixes.filter(f=>f.sev==='high').length;
  const mid  = fixes.filter(f=>f.sev==='medium').length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={13} className="text-blue-600"/>
          <span className="text-[12px] font-bold text-gray-800">ATS Fix Suggestions</span>
        </div>
        <div className="flex items-center gap-1.5">
          {high>0 && <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">{high} high</span>}
          {mid>0  && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{mid} medium</span>}
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {fixes.map(fix => {
          const isOpen = expanded === fix.id;
          const isDone = !!applied[fix.id];
          return (
            <div key={fix.id} className={`rounded-lg border p-2.5 transition-all ${isDone ? 'border-green-200 bg-green-50 opacity-60' : sevBg[fix.sev]}`}>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0" style={{background: isDone ? '#16a34a' : sevColor[fix.sev]}}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-gray-800 leading-snug">{fix.label}</p>
                  {fix.cat && <span className="text-[9.5px] text-gray-400 font-medium uppercase tracking-wide">{fix.cat}</span>}
                </div>
                {!isDone && (
                  <button onClick={() => setExpanded(isOpen ? null : fix.id)}
                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 underline">
                    {isOpen ? 'close' : fix.type === 'tip' ? 'see tip' : 'fix it'}
                  </button>
                )}
                {isDone && <Icon name="CheckCircle" size={13} className="text-green-500 shrink-0"/>}
              </div>

              {isOpen && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex flex-col gap-2">
                  {/* Tip-only */}
                  {fix.type === 'tip' && (
                    <p className="text-[11px] text-gray-600 whitespace-pre-line leading-relaxed">{fix.hint}</p>
                  )}

                  {/* Weak verb — show original + verb chips */}
                  {fix.type === 'weak_verb' && (
                    <>
                      <div className="rounded-md bg-white border border-gray-200 px-2.5 py-1.5">
                        <p className="text-[9.5px] text-gray-400 font-medium uppercase mb-0.5">Current</p>
                        <p className="text-[11px] text-gray-700 leading-snug">"{fix.original.slice(0,90)}{fix.original.length>90?'...':''}"</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium mb-1.5">Pick a replacement verb — click to apply:</p>
                        <div className="flex flex-wrap gap-1">
                          {STRONG_VERBS.map(v => (
                            <button key={v} onClick={() => applyWeakVerb(fix, v)}
                              className="px-2.5 py-1 text-[10.5px] font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all">
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Direct replace — show before/after + button */}
                  {fix.type === 'direct' && (
                    <>
                      <div className="rounded-md bg-white border border-gray-200 px-2.5 py-1.5">
                        <p className="text-[9.5px] text-red-400 font-medium uppercase mb-0.5">Before</p>
                        <p className="text-[11px] text-gray-600 leading-snug line-through">{fix.original.slice(0,80)}{fix.original.length>80?'...':''}</p>
                      </div>
                      <div className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1.5">
                        <p className="text-[9.5px] text-green-600 font-medium uppercase mb-0.5">After</p>
                        <p className="text-[11px] text-gray-700 leading-snug">{fix.preview.slice(0,100)}{fix.preview.length>100?'...':''}</p>
                      </div>
                      <button onClick={() => applyDirect(fix)}
                        className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 active:scale-95 transition-all">
                        <Icon name="Check" size={11}/>
                        Apply Fix
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Cover Letter Generator ───────────────────────────────────────────────────
function CvCoverLetterPanel({ data, jobDesc }) {
  const [letter, setLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const h = data?.header || EMPTY_DATA.header;
  const canGenerate = h.name && h.email && (data?.experience?.length > 0 || data?.summary);

  const generate = async () => {
    if (!canGenerate || generating) return;
    setGenerating(true);
setError('');
const API = window.TOOLSUITE_API_URL || 'http://localhost:3001/api/v1';
try {

      const resumeText = [
        `Name: ${h.name}`,
        h.title && `Title: ${h.title}`,
        data.summary && `Summary: ${data.summary}`,
        ...safeArr(data.experience).map(e => `Experience: ${e.jobTitle} at ${e.company} (${[e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ')})\n${safeArr(e.bullets).join('; ')}`),
        ...safeArr(data.skills).map(s => `Skills: ${s.name}: ${safeArr(s.items).join(', ')}`),
        ...safeArr(data.certifications).map(c => `Certification: ${c.name} — ${c.issuer}`),
      ].filter(Boolean).join('\n');

      const safeJobDesc = (jobDesc?.trim() || '').slice(0, 3000).replace(/<[^>]*>/g, '');
const safeResumeText = resumeText.slice(0, 6000);
const prompt = safeJobDesc
  ? `Write a professional cover letter for ${h.name} applying to this role:\n\nJob Description:\n${safeJobDesc}\n\nResume:\n${safeResumeText}\n\nWrite a compelling 3-paragraph cover letter (opening hook, skills match, closing). Use formal tone. No placeholders.`
  : `Write a general professional cover letter for ${h.name} based on this resume:\n\n${safeResumeText}\n\nWrite a compelling 3-paragraph cover letter (opening, skills/achievements, closing). Use formal tone.`;

      const res = await fetch(`${API}/cv/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, type: 'cover_letter' }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      setLetter(json.improved || json.text || '');
    } catch (e) {
      setError('Could not generate cover letter. Check your backend connection.');
    } finally {
      setGenerating(false);
    }
  };

  const copyText = () => {
    if (!letter) return;
if (navigator.clipboard?.writeText) {
  navigator.clipboard.writeText(letter)
    .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
    .catch(() => {}); // silently fail — user on HTTP or unsupported browser
}  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
        <Icon name="FileText" size={15} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[12px] font-semibold text-blue-900">Cover Letter Generator</p>
          <p className="text-[11px] text-blue-700 mt-0.5">
            {jobDesc?.trim() ? 'Generating cover letter tailored to the job description in the ATS panel.' : 'Paste a job description in the ATS tab for a tailored letter, or generate a general one now.'}
          </p>
        </div>
      </div>

      {!canGenerate && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
          <Icon name="AlertTriangle" size={13} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-800">Add your name, email, and at least one experience entry or summary to generate a cover letter.</p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={generate} disabled={!canGenerate || generating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-[12px] font-semibold transition-colors">
          {generating ? <Icon name="Loader" size={13} className="animate-spin" /> : <Icon name="Sparkles" size={13} />}
          {generating ? 'Generating...' : jobDesc?.trim() ? 'Generate Tailored Letter' : 'Generate General Letter'}
        </button>
        {letter && (
          <button onClick={copyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12px] font-medium transition-colors">
            <Icon name={copied ? 'Check' : 'Copy'} size={13} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 flex items-start gap-2">
          <Icon name="AlertCircle" size={13} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-red-700">{error}</p>
        </div>
      )}

      {letter && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Generated Cover Letter</p>
            <button onClick={() => setLetter('')} className="text-[10px] text-gray-400 hover:text-red-500 font-medium transition-colors">Clear</button>
          </div>
          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            rows={18}
            className="w-full text-[12.5px] text-gray-800 leading-relaxed resize-y focus:outline-none"
            style={{ border: 'none', padding: 0, background: 'transparent', fontFamily: 'inherit', color: '#111827', WebkitTextFillColor: '#111827', caretColor: '#111827' }}
          />
        </div>
      )}
    </div>
  );
}
export { scoreColor, CvResumeScore, CvProfessionalTips, CvCoverLetterPanel, CvAtsFix, CvJobMatchFixes };
