import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, KeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  TbAddressBook, TbApps, TbBattery4, TbBrandGithub, TbBriefcase, TbBulb,
  TbCertificate, TbChevronRight, TbCode, TbDownload, TbExternalLink, TbFileCv,
  TbFolder, TbGridDots, TbLayoutList, TbMail, TbMaximize, TbMoon, TbSearch,
  TbSettings, TbSun, TbTerminal2, TbUser, TbWifi, TbX,
} from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { certifications } from '../../data/certifications';
import { experienceItems } from '../../data/experience';
import { personalInfo, socialLinks } from '../../data/personal';
import { projects } from '../../data/projects';
import { skillCategories } from '../../data/skills';
import type { ContactFormErrors, ContactFormValues } from '../../types';
import { hasValidationErrors, validateContactForm } from '../../utils/validation';

type AppId = 'about' | 'projects' | 'skills' | 'experience' | 'certifications' | 'github' | 'terminal' | 'contact' | 'resume';
type AppDef = { id: AppId; label: string; icon: IconType; color: string };
type WindowState = { id: AppId; minimized: boolean; maximized: boolean; z: number; x: number; y: number; width: number; height: number };

const apps: AppDef[] = [
  { id: 'about', label: 'About Me', icon: TbUser, color: 'blue' },
  { id: 'projects', label: 'Projects', icon: TbFolder, color: 'cyan' },
  { id: 'skills', label: 'Skills', icon: TbCode, color: 'violet' },
  { id: 'experience', label: 'Experience', icon: TbBriefcase, color: 'orange' },
  { id: 'certifications', label: 'Certificates', icon: TbCertificate, color: 'yellow' },
  { id: 'github', label: 'GitHub', icon: TbBrandGithub, color: 'slate' },
  { id: 'terminal', label: 'Terminal', icon: TbTerminal2, color: 'dark' },
  { id: 'contact', label: 'Contact', icon: TbMail, color: 'pink' },
  { id: 'resume', label: 'Resume', icon: TbFileCv, color: 'green' },
];

const contents: Record<AppId, (open: (id: AppId) => void) => ReactNode> = {
  about: (open) => <AboutApp open={open} />,
  projects: () => <ProjectsApp />,
  skills: () => <SkillsApp />,
  experience: () => <ExperienceApp />,
  certifications: () => <CertificationsApp />,
  github: () => <GitHubApp />,
  terminal: (open) => <TerminalApp open={open} />,
  contact: () => <ContactApp />,
  resume: (open) => <ResumeApp open={open} />,
};

export function DesktopPortfolio() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [spotlight, setSpotlight] = useState(false);
  const [launchpad, setLaunchpad] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [wallpaper, setWallpaper] = useState(0);
  const [desktopKey, setDesktopKey] = useState(0);
  const [now, setNow] = useState(new Date());
  const zRef = useRef(10);

  const focus = (id: AppId) => setWindows((all) => all.map((w) => w.id === id ? { ...w, minimized: false, z: ++zRef.current } : w));
  const open = (id: AppId) => setWindows((all) => {
    const existing = all.find((w) => w.id === id);
    if (existing) return all.map((w) => w.id === id ? { ...w, minimized: false, z: ++zRef.current } : w);
    const offset = all.length % 5;
    return [...all, { id, minimized: false, maximized: false, z: ++zRef.current, x: 10 + offset * 24, y: 8 + offset * 20, width: Math.min(1050, window.innerWidth - 150), height: Math.min(690, window.innerHeight - 155) }];
  });
  const close = (id: AppId) => setWindows((all) => all.filter((w) => w.id !== id));
  const patchWindow = (id: AppId, patch: Partial<WindowState>) => setWindows((all) => all.map((w) => w.id === id ? { ...w, ...patch } : w));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    const keys = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSpotlight((v) => !v); }
      if (e.key === 'Escape') { setSpotlight(false); setLaunchpad(false); setContextMenu(null); }
    };
    window.addEventListener('keydown', keys);
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', keys); };
  }, []);

  return (
    <main className={`desktop-os ${theme} wallpaper-${wallpaper}`} aria-label="Mahesh Portfolio desktop" onPointerDown={() => setContextMenu(null)}>
      <div className="wallpaper-orb orb-one" /><div className="wallpaper-orb orb-two" />
      <MenuBar now={now} theme={theme} setTheme={setTheme} open={open} showLaunchpad={() => setLaunchpad(true)} showSearch={() => setSpotlight(true)} />
      <section className="desktop-area" aria-label="Applications" onContextMenu={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.desktop-window, input, textarea')) return;
        e.preventDefault();
        setContextMenu({ x: Math.min(e.clientX, window.innerWidth - 243), y: Math.min(e.clientY, window.innerHeight - 308) });
      }}>
        <motion.div key={desktopKey} className="desktop-icons" initial={{ opacity: .3 }} animate={{ opacity: 1 }}>{apps.map((app) => <DesktopIcon key={app.id} app={app} onOpen={() => open(app.id)} />)}</motion.div>
        <div className="desktop-widgets" aria-label="Desktop widgets">
          <article className="widget profile-widget"><span className="eyebrow">DEVELOPER PROFILE</span><div className="avatar">MR</div><h1>Mahesh Raskar</h1><p>Full-Stack Developer</p><span className="availability"><i /> Available for opportunities</span></article>
          <article className="widget feature-widget"><span className="eyebrow">FEATURED WORK</span><TbBulb /><h2>AI Hospital Recommendation</h2><p>Location-aware emergency support powered by FastAPI and machine learning.</p><button onClick={() => open('projects')}>Explore projects <TbChevronRight /></button></article>
        </div>
        <AnimatePresence>{windows.map((w) => !w.minimized && <DesktopWindow key={w.id} state={w} app={apps.find((a) => a.id === w.id)!} close={() => close(w.id)} minimize={() => patchWindow(w.id, { minimized: true })} maximize={() => patchWindow(w.id, { maximized: !w.maximized })} focus={() => focus(w.id)} move={(x, y) => patchWindow(w.id, { x, y })} resize={(width, height) => patchWindow(w.id, { width, height })}>{contents[w.id](open)}</DesktopWindow>)}</AnimatePresence>
      </section>
      <Dock windows={windows} open={open} showLaunchpad={() => setLaunchpad(true)} />
      <AnimatePresence>{spotlight && <Spotlight close={() => setSpotlight(false)} open={open} />}</AnimatePresence>
      <AnimatePresence>{launchpad && <Launchpad close={() => setLaunchpad(false)} open={open} />}</AnimatePresence>
      <AnimatePresence>{contextMenu && <DesktopContextMenu position={contextMenu} close={() => setContextMenu(null)} open={open} theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} wallpaper={wallpaper} selectWallpaper={setWallpaper} refresh={() => setDesktopKey((value) => value + 1)} launchpad={() => setLaunchpad(true)} />}</AnimatePresence>
      <div className="seo-copy" aria-hidden="false"><h2>Mahesh Raskar — Full Stack Developer</h2><p>Projects, skills, experience, certifications, resume and contact information.</p></div>
    </main>
  );
}

function DesktopContextMenu({ position, close, open, theme, toggleTheme, wallpaper, selectWallpaper, refresh, launchpad }: { position: { x: number; y: number }; close: () => void; open: (id: AppId) => void; theme: 'dark' | 'light'; toggleTheme: () => void; wallpaper: number; selectWallpaper: (value: number) => void; refresh: () => void; launchpad: () => void }) {
  const [showWallpapers, setShowWallpapers] = useState(false);
  const action = (callback: () => void) => { callback(); close(); };
  return <motion.div className="desktop-context-menu" style={{ left: position.x, top: position.y }} initial={{ opacity: 0, scale: .96, transformOrigin: 'top left' }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .12 }} role="menu" aria-label="Desktop options" onPointerDown={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
    {showWallpapers ? <><div className="context-heading"><button onClick={() => setShowWallpapers(false)} aria-label="Back"><TbChevronRight /></button><strong>Choose Wallpaper</strong></div><div className="wallpaper-picker">{['Alpine Blue Hour', 'Fjord Sunrise', 'Basalt Cove', 'Aurora Lake', 'Rainforest Coast'].map((name, index) => <button key={name} className={wallpaper === index ? 'selected' : ''} onClick={() => selectWallpaper(index)} aria-label={`Use ${name} wallpaper`}><span className={`wallpaper-preview wallpaper-preview-${index}`}><i /></span><small>{name}</small></button>)}</div></> : <>
      <button role="menuitem" onClick={() => action(() => open('about'))}><TbUser /> About This Portfolio</button>
      <button role="menuitem" onClick={() => action(launchpad)}><TbApps /> Open Launchpad</button><i />
      <button role="menuitem" onClick={() => setShowWallpapers(true)}><TbGridDots /> Change Wallpaper <TbChevronRight className="menu-chevron" /></button>
      <button role="menuitem" onClick={() => action(() => open('terminal'))}><TbTerminal2 /> Open Terminal</button>
      <button role="menuitem" onClick={() => action(() => open('projects'))}><TbFolder /> View Projects</button><i />
      <button role="menuitem" onClick={() => action(refresh)}><TbSettings /> Refresh Desktop</button>
      <button role="menuitem" onClick={() => action(toggleTheme)}>{theme === 'dark' ? <TbSun /> : <TbMoon />} Use {theme === 'dark' ? 'Light' : 'Dark'} Appearance</button>
    </>}
  </motion.div>;
}

function MenuBar({ now, theme, setTheme, open, showLaunchpad, showSearch }: { now: Date; theme: 'dark' | 'light'; setTheme: (t: 'dark' | 'light') => void; open: (id: AppId) => void; showLaunchpad: () => void; showSearch: () => void }) {
  return <header className="menu-bar"><nav className="menu-left"><button className="brand-button" onClick={showLaunchpad} aria-label="Open Launchpad">M</button><strong>Mahesh</strong><button onClick={() => open('about')}>File</button><button onClick={() => open('projects')}>Projects</button><button onClick={showSearch}>View</button><button onClick={() => open('contact')}>Contact</button><button onClick={() => open('about')}>Help</button></nav><div className="menu-right"><a href={socialLinks.find((x) => x.label === 'GitHub')?.href} target="_blank" rel="noreferrer" aria-label="GitHub"><TbBrandGithub /></a><TbWifi /><TbBattery4 /><button onClick={showSearch} aria-label="Search"><TbSearch /></button><span className="menu-date">{now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span><span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <TbSun /> : <TbMoon />}</button></div></header>;
}

function AppIcon({ app }: { app: AppDef }) { const Icon = app.icon; return <span className={`app-icon ${app.color}`}><Icon /></span>; }
function DesktopIcon({ app, onOpen }: { app: AppDef; onOpen: () => void }) { return <button className="desktop-icon" onClick={onOpen} onDoubleClick={onOpen}><AppIcon app={app} /><span>{app.label}</span></button>; }

function Dock({ windows, open, showLaunchpad }: { windows: WindowState[]; open: (id: AppId) => void; showLaunchpad: () => void }) {
  const dockApps = apps.filter((a) => ['about', 'projects', 'skills', 'terminal', 'github', 'contact', 'resume'].includes(a.id));
  return <nav className="dock" aria-label="Application dock"><button className="dock-item" onClick={showLaunchpad}><span className="app-icon blue"><TbApps /></span><span className="tooltip">Launchpad</span></button><i className="dock-separator" />{dockApps.map((app) => <button key={app.id} className={`dock-item ${windows.some((w) => w.id === app.id) ? 'active' : ''}`} onClick={() => open(app.id)}><AppIcon app={app} /><span className="tooltip">{app.label}</span></button>)}</nav>;
}

function DesktopWindow({ state, app, children, close, minimize, maximize, focus, move, resize }: { state: WindowState; app: AppDef; children: ReactNode; close: () => void; minimize: () => void; maximize: () => void; focus: () => void; move: (x: number, y: number) => void; resize: (width: number, height: number) => void }) {
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const sizing = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { if (state.maximized || window.innerWidth < 769) return; drag.current = { x: e.clientX, y: e.clientY, ox: state.x, oy: state.y }; e.currentTarget.setPointerCapture(e.pointerId); };
  const onPointerMove = (e: React.PointerEvent) => { if (drag.current) move(Math.max(-5, drag.current.ox + e.clientX - drag.current.x), Math.max(0, drag.current.oy + e.clientY - drag.current.y)); };
  return <motion.article initial={{ opacity: 0, scale: .96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .2 }} className={`desktop-window ${state.maximized ? 'maximized' : ''}`} style={{ zIndex: state.z, '--window-x': `${state.x}px`, '--window-y': `${state.y}px`, '--window-width': `${state.width}px`, '--window-height': `${state.height}px` } as React.CSSProperties} onPointerDown={focus} aria-label={`${app.label} window`}>
    <header className="window-titlebar" onDoubleClick={maximize} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { drag.current = null; }}><div className="traffic-lights"><button className="close" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); close(); }} title="Close" aria-label="Close window"><TbX /></button><button className="minimize" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); minimize(); }} title="Minimize" aria-label="Minimize window">−</button><button className="maximize" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); maximize(); }} title={state.maximized ? 'Restore' : 'Maximize'} aria-label={state.maximized ? 'Restore window' : 'Maximize window'}><TbMaximize /></button></div><div className="window-title"><app.icon /> {app.label}</div><span /></header><div className="window-content">{children}</div>
    {!state.maximized && <button className="window-resizer" aria-label="Resize window" title="Drag to resize" onPointerDown={(e) => { e.stopPropagation(); sizing.current = { x: e.clientX, y: e.clientY, width: state.width, height: state.height }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => { if (!sizing.current) return; resize(Math.max(520, Math.min(window.innerWidth - 30, sizing.current.width + e.clientX - sizing.current.x)), Math.max(360, Math.min(window.innerHeight - 80, sizing.current.height + e.clientY - sizing.current.y))); }} onPointerUp={() => { sizing.current = null; }} />}
  </motion.article>;
}

function AboutApp({ open }: { open: (id: AppId) => void }) {
  return <div className="about-layout"><aside className="settings-sidebar"><h3><TbSettings /> Profile</h3><button className="selected"><TbUser /> About Me</button><button onClick={() => open('skills')}><TbCode /> Skills</button><button onClick={() => open('experience')}><TbBriefcase /> Experience</button></aside><div className="about-main"><div className="profile-heading"><div className="avatar large">MR</div><div><h2>{personalInfo.name}</h2><p>{personalInfo.role}</p><span>{personalInfo.location}</span></div></div><p className="lead">{personalInfo.about}</p><div className="stat-grid"><Stat value={`${projects.length}`} label="Featured projects" /><Stat value={`${certifications.length}`} label="Certifications" /><Stat value={`${skillCategories.reduce((n, c) => n + c.skills.length, 0)}`} label="Skills & tools" /><Stat value="Open" label="To opportunities" /></div><div className="interest-row"><span>AI & ML</span><span>Cloud systems</span><span>Mobile</span><span>Full-stack</span></div><div className="button-row"><a className="primary-button" href={personalInfo.resumeUrl} target="_blank" rel="noreferrer">View Resume</a><button onClick={() => open('contact')}>Contact Me</button>{socialLinks.slice(0, 2).map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}</div></div></div>;
}
function Stat({ value, label }: { value: string; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }

function ProjectsApp() {
  const [search, setSearch] = useState(''); const [view, setView] = useState<'grid' | 'list'>('grid'); const [selected, setSelected] = useState<number | null>(null);
  const shown = projects.filter((p) => `${p.name} ${p.description} ${p.stack.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="finder-layout"><aside className="finder-sidebar"><span>Favorites</span><button className="selected"><TbGridDots /> Featured</button><button><TbCode /> Web Apps</button><button><TbBulb /> AI</button><button><TbAddressBook /> Mobile</button><span>Locations</span><button><TbFolder /> All Projects</button></aside><section className="finder-main"><div className="finder-toolbar"><label><TbSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects" /></label><div><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view"><TbGridDots /></button><button className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')} aria-label="List view"><TbLayoutList /></button></div></div><div className={`project-browser ${view}`}>{shown.map((p) => { const index = projects.indexOf(p); return <button key={p.name} className="project-file" onClick={() => setSelected(index)}><span className="folder-art"><TbFolder /></span><div><strong>{p.name}</strong><p>{p.description}</p><small>{p.stack.slice(0, 4).join(' · ')}</small></div><em>{p.status}</em></button>; })}</div>{selected !== null && <div className="preview-pane"><button className="preview-close" onClick={() => setSelected(null)}><TbX /></button><span className="eyebrow">PROJECT PREVIEW</span><h2>{projects[selected].name}</h2><p>{projects[selected].description}</p><div className="tag-row">{projects[selected].stack.map((s) => <span key={s}>{s}</span>)}</div><ul>{projects[selected].features.map((f) => <li key={f}>{f}</li>)}</ul><div className="button-row">{projects[selected].githubUrl && <a className="primary-button" href={projects[selected].githubUrl} target="_blank" rel="noreferrer"><TbBrandGithub /> Source</a>}{projects[selected].liveUrl && <a href={projects[selected].liveUrl} target="_blank" rel="noreferrer"><TbExternalLink /> Live demo</a>}</div></div>}</section></div>;
}

function SkillsApp() { return <div className="skills-app"><div className="app-heading"><span className="eyebrow">SYSTEM INFORMATION</span><h2>Technical toolkit</h2><p>Technologies used across shipped projects and ongoing work.</p></div><div className="skill-grid">{skillCategories.map((category) => { const Icon = category.icon; return <article key={category.title}><header><span><Icon /></span><div><h3>{category.title}</h3><p>{category.summary}</p></div></header><div>{category.skills.map((skill) => { const SkillIcon = skill.icon; return <span className="skill-chip" key={skill.name}><SkillIcon /> {skill.name}</span>; })}</div></article>; })}</div></div>; }
function ExperienceApp() { return <div className="experience-app"><div className="app-heading"><span className="eyebrow">ACTIVITY MONITOR</span><h2>Experience timeline</h2></div><div className="timeline">{experienceItems.map((item) => <article key={item.company}><i /><div className="timeline-date">{item.duration}</div><div className="timeline-card"><span>{item.location}</span><h3>{item.position}</h3><h4>{item.company}</h4><ul>{item.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul></div></article>)}</div></div>; }
function CertificationsApp() { const [query, setQuery] = useState(''); const filtered = certifications.filter((c) => `${c.title} ${c.issuer}`.toLowerCase().includes(query.toLowerCase())); return <div className="cert-app"><div className="finder-toolbar"><h2>Credentials</h2><label><TbSearch /><input placeholder="Search certificates" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div><div className="cert-grid">{filtered.map((c) => { const Icon = c.icon; return <a key={c.title} href={c.documentUrl} target="_blank" rel="noreferrer"><span className="cert-art"><Icon /></span><strong>{c.title}</strong><small>{c.issuer}</small><p>{c.description}</p><em>{c.documentLabel} <TbExternalLink /></em></a>; })}</div></div>; }
function GitHubApp() { const github = socialLinks.find((x) => x.label === 'GitHub')!; return <div className="github-app"><header><span className="github-avatar"><TbBrandGithub /></span><div><span className="eyebrow">GITHUB PROFILE</span><h2>gwc-sys</h2><p>Public work across full-stack, AI, mobile and cloud engineering.</p></div><a className="primary-button" href={github.href} target="_blank" rel="noreferrer">View profile <TbExternalLink /></a></header><h3>Featured repositories</h3><div className="repo-grid">{projects.filter((p) => p.githubUrl).map((p) => <a key={p.name} href={p.githubUrl} target="_blank" rel="noreferrer"><TbCode /><strong>{p.name}</strong><p>{p.description}</p><small>{p.stack.slice(0, 3).join(' · ')}</small></a>)}</div><p className="data-note">Repository cards use verified portfolio data. No live statistics are fabricated.</p></div>; }

const terminalCommands = ['help', 'about', 'skills', 'projects', 'experience', 'certifications', 'github', 'contact', 'resume', 'social', 'open <app>', 'ls', 'pwd', 'date', 'whoami', 'neofetch', 'history', 'echo <text>', 'clear'];
function TerminalApp({ open }: { open: (id: AppId) => void }) {
  const [lines, setLines] = useState<string[]>(['Mahesh Portfolio Terminal', 'Type "help" to see available commands.']); const [input, setInput] = useState(''); const [history, setHistory] = useState<string[]>([]); const [historyIndex, setHistoryIndex] = useState(-1); const end = useRef<HTMLDivElement>(null); const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);
  const run = (raw: string) => {
    const normalized = raw.trim(); if (!normalized) return;
    const [typedCommand, ...args] = normalized.split(/\s+/); const aliases: Record<string, string> = { certs: 'certifications', certificate: 'certifications', certificates: 'certifications', project: 'projects', skill: 'skills', exp: 'experience', cv: 'resume', cls: 'clear' }; const command = aliases[typedCommand.toLowerCase()] ?? typedCommand.toLowerCase(); const prompt = `mahesh@portfolio:~$ ${normalized}`;
    const githubUrl = socialLinks.find((link) => link.label === 'GitHub')?.href ?? '';
    const output: Record<string, string[]> = {
      help: ['Available commands:', ...terminalCommands.map((item) => `  ${item}`), 'Aliases: certs, certificates, project, skill, exp, cv, cls', 'Tip: use Up/Down for history, Tab to autocomplete, and Ctrl+L to clear.'],
      about: [personalInfo.name, personalInfo.role, personalInfo.about, `Location: ${personalInfo.location}`],
      skills: skillCategories.flatMap((category) => [`${category.title}:`, `  ${category.skills.map((skill) => skill.name).join(' · ')}`]),
      projects: projects.flatMap((project, index) => [`${String(index + 1).padStart(2, '0')}. ${project.name} [${project.status ?? 'Project'}]`, `    ${project.stack.join(' · ')}`]),
      experience: experienceItems.flatMap((item) => [`${item.position} @ ${item.company}`, `  ${item.duration} · ${item.location}`]),
      certifications: certifications.map((item, index) => `${String(index + 1).padStart(2, '0')}. ${item.title} — ${item.issuer}`),
      certificates: certifications.map((item, index) => `${String(index + 1).padStart(2, '0')}. ${item.title} — ${item.issuer}`),
      github: [`GitHub: ${githubUrl}`, `Featured repositories: ${projects.filter((project) => project.githubUrl).length}`],
      contact: [`Email: mailto:${personalInfo.email}`, `Location: ${personalInfo.location}`, ...socialLinks.slice(0, 2).map((link) => `${link.label}: ${link.href}`)],
      social: socialLinks.map((link) => `${link.label}: ${link.href}`),
      resume: [`Resume: ${window.location.origin}${personalInfo.resumeUrl}`, 'Run "open resume" to view it in a new window.'],
      whoami: [personalInfo.name, personalInfo.role], date: [new Date().toString()],
      pwd: ['/home/mahesh/portfolio'],
      ls: apps.map((app) => `${app.id}/`).concat(['resume.pdf']),
      neofetch: ['PortfolioOS 3.0', `User: ${personalInfo.name}`, `Role: ${personalInfo.role}`, 'Shell: portfolio-terminal', `Projects: ${projects.length}`, `Skills: ${skillCategories.reduce((total, category) => total + category.skills.length, 0)}`],
      echo: [args.join(' ')],
      history: [...history, normalized].map((item, index) => `${index + 1}  ${item}`),
    };
    if (command === 'clear') setLines([]);
    else if (command === 'open') {
      const rawTarget = args.join(' ').toLowerCase(); const target = aliases[rawTarget] ?? rawTarget;
      const social = socialLinks.find((link) => link.label.toLowerCase() === target); const project = projects.find((item) => item.name.toLowerCase().includes(target));
      if ((apps.map((app) => app.id) as string[]).includes(target)) { open(target as AppId); setLines((current) => [...current, prompt, `Opening ${target}...`]); }
      else if (target === 'email') { window.open(`mailto:${personalInfo.email}`, '_self'); setLines((current) => [...current, prompt, 'Opening email composer...']); }
      else if (social?.href || project?.liveUrl || project?.githubUrl) { const url = social?.href ?? project?.liveUrl ?? project?.githubUrl ?? ''; window.open(url, '_blank', 'noopener,noreferrer'); setLines((current) => [...current, prompt, `Opening ${target}: ${url}`]); }
      else setLines((current) => [...current, prompt, `open: ${target || 'missing target'}: not found`]);
    }
    else if (output[command]) setLines((current) => [...current, prompt, ...output[command]]);
    else setLines((current) => [...current, prompt, `command not found: ${command}. Type "help".`]);
    setHistory((current) => [...current, normalized]); setHistoryIndex(-1);
  };
  const submit = (e: FormEvent) => { e.preventDefault(); run(input); setInput(''); };
  const keys = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); const i = Math.min(historyIndex + 1, history.length - 1); setHistoryIndex(i); setInput(history[history.length - 1 - i]); } else if (e.key === 'ArrowDown') { e.preventDefault(); const i = historyIndex - 1; setHistoryIndex(i); setInput(i >= 0 ? history[history.length - 1 - i] : ''); } else if (e.key === 'Tab') { e.preventDefault(); const fragment = input.toLowerCase(); const match = terminalCommands.map((item) => item.split(' ')[0]).find((item) => item.startsWith(fragment)); if (match) setInput(match); } else if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); run('clear'); setInput(''); } };
  return <div className="terminal-app" onClick={() => inputRef.current?.focus()}><div className="terminal-output" aria-live="polite">{lines.map((line, i) => <TerminalLine key={`${line}-${i}`} line={line} />)}<div ref={end} /></div><div className="terminal-quick">{['help', 'about', 'projects', 'skills', 'experience', 'certifications', 'github', 'contact', 'resume', 'clear'].map((command) => <button type="button" key={command} onClick={() => run(command)}>{command}</button>)}</div><form onSubmit={submit}><span>mahesh@portfolio:~$</span><input ref={inputRef} autoFocus value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={keys} aria-label="Terminal command" autoComplete="off" autoCapitalize="none" spellCheck={false} /></form></div>;
}

function TerminalLine({ line }: { line: string }) {
  const match = line.match(/(https?:\/\/\S+|mailto:\S+)/); if (!match) return <p className={line.includes('$') ? 'command' : ''}>{line}</p>;
  const index = line.indexOf(match[0]); return <p>{line.slice(0, index)}<a href={match[0]} target={match[0].startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">{match[0]}</a>{line.slice(index + match[0].length)}</p>;
}
function ContactApp() {
  const initial: ContactFormValues = { name: '', email: '', subject: '', message: '' }; const [values, setValues] = useState(initial); const [errors, setErrors] = useState<ContactFormErrors>({}); const [status, setStatus] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); const next = validateContactForm(values); setErrors(next); if (hasValidationErrors(next)) return; const body = `Hello Mahesh,\n\n${values.message.trim()}\n\nFrom: ${values.name.trim()}\nEmail: ${values.email.trim()}`; const mailto = `mailto:${personalInfo.email}?subject=${encodeURIComponent(values.subject.trim())}&body=${encodeURIComponent(body)}`; setStatus('Opening your email application…'); window.location.href = mailto; };
  return <div className="contact-app"><aside><span className="eyebrow">LET’S BUILD SOMETHING</span><h2>Get in touch.</h2><p>I’m open to full-stack, AI, data and cloud opportunities.</p><a href={`mailto:${personalInfo.email}`}><TbMail /> {personalInfo.email}</a>{socialLinks.slice(0, 2).map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer"><s.icon /> {s.label}</a>)}</aside><form onSubmit={submit}><div className="form-row"><Field label="Name" name="name" value={values.name} error={errors.name} set={(v) => setValues({ ...values, name: v })} /><Field label="Email" name="email" type="email" value={values.email} error={errors.email} set={(v) => setValues({ ...values, email: v })} /></div><Field label="Subject" name="subject" value={values.subject} error={errors.subject} set={(v) => setValues({ ...values, subject: v })} /><label>Message<textarea value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} rows={6} />{errors.message && <small>{errors.message}</small>}</label><button className="primary-button">Compose Email</button>{status && <p className="form-status">{status}</p>}</form></div>;
}
function Field({ label, name, value, type = 'text', error, set }: { label: string; name: string; value: string; type?: string; error?: string; set: (v: string) => void }) { return <label>{label}<input name={name} type={type} value={value} onChange={(e) => set(e.target.value)} />{error && <small>{error}</small>}</label>; }
function ResumeApp({ open }: { open: (id: AppId) => void }) { return <div className="resume-app"><div className="resume-preview"><object data={`${personalInfo.resumeUrl}#view=FitH&toolbar=1`} type="application/pdf" aria-label="Mahesh Raskar CV preview"><div className="resume-fallback"><TbFileCv /><h3>PDF preview is unavailable in this browser.</h3><p>Open the CV in a new tab or download it to view the complete document.</p><a className="primary-button" href={personalInfo.resumeUrl} target="_blank" rel="noreferrer">Open CV <TbExternalLink /></a></div></object></div><aside><span className="eyebrow">CURRICULUM VITAE</span><h2>Mahesh Raskar</h2><p>This is the actual CV stored in the portfolio. Preview it here, open it in a new tab, or download a copy.</p><a className="primary-button" href={personalInfo.resumeUrl} target="_blank" rel="noreferrer"><TbExternalLink /> Open CV</a><a href={personalInfo.resumeUrl} download="Mahesh-Raskar-CV.pdf"><TbDownload /> Download CV</a><button onClick={() => open('contact')}><TbMail /> Contact Me</button></aside></div>; }

function Spotlight({ close, open }: { close: () => void; open: (id: AppId) => void }) { const [q, setQ] = useState(''); const results = useMemo(() => apps.filter((a) => a.label.toLowerCase().includes(q.toLowerCase())), [q]); const choose = (id: AppId) => { open(id); close(); }; return <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={close}><motion.div className="spotlight" initial={{ scale: .96, y: -10 }} animate={{ scale: 1, y: 0 }} onMouseDown={(e) => e.stopPropagation()}><label><TbSearch /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) choose(results[0].id); }} placeholder="Search apps and portfolio…" /><kbd>ESC</kbd></label><div>{results.map((app, i) => <button key={app.id} className={i === 0 ? 'selected' : ''} onClick={() => choose(app.id)}><AppIcon app={app} /><span><strong>{app.label}</strong><small>Open application</small></span><TbChevronRight /></button>)}</div></motion.div></motion.div>; }
function Launchpad({ close, open }: { close: () => void; open: (id: AppId) => void }) { return <motion.div className="launchpad overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}><h2>Applications</h2><div>{apps.map((app) => <DesktopIcon key={app.id} app={app} onOpen={() => { open(app.id); close(); }} />)}</div><p>Press Esc to close</p></motion.div>; }
