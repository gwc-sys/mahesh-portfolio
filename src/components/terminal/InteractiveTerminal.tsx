import { type FormEvent, type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { certifications } from '../../data/certifications';
import { experienceItems } from '../../data/experience';
import { personalInfo, socialLinks } from '../../data/personal';
import { projects } from '../../data/projects';
import { skillCategories } from '../../data/skills';

type Entry = { id: number; command?: string; path?: string; content: ReactNode };
type SpeechRecognitionEventLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'whoami', 'about', 'skills', 'projects', 'experience', 'certificates', 'contact', 'social', 'resume', 'open', 'voice', 'speak', 'date', 'uname', 'neofetch', 'echo', 'history', 'clear'];
const directories = ['about', 'skills', 'projects', 'experience', 'certificates', 'contact'];
const files: Record<string, string> = {
  'about.txt': personalInfo.about,
  'objective.txt': personalInfo.objective,
  'education.txt': personalInfo.education,
  'contact.txt': `${personalInfo.email}\n${personalInfo.location}`,
};

const welcome = (
  <div className="terminal-welcome max-w-5xl overflow-hidden border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.06] via-transparent to-cyan-400/[0.04] p-5 sm:p-7">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p className="mb-3 inline-flex items-center gap-2 border border-emerald-400/25 bg-emerald-400/[0.06] px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> System ready</p>
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">Full-stack developer / AI builder</p>
        <h1 className="mt-2 bg-gradient-to-r from-white via-emerald-100 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">MAHESH RASKAR</h1>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">Building intelligent products across AI, scalable APIs, data systems and modern web experiences.</p>
      </div>
      <div className="shrink-0 text-left md:text-right"><p className="text-[9px] uppercase tracking-widest text-slate-600">Current status</p><p className="mt-1 text-xs text-emerald-300">OPEN_TO_WORK=true</p><p className="mt-1 text-[10px] text-slate-500">Pune, India · UTC+5:30</p></div>
    </div>
    <div className="mt-7 grid grid-cols-2 border-l border-t border-white/[0.07] sm:grid-cols-4">
      {[['05', 'featured_projects'], ['27', 'public_repos'], ['12', 'certificates'], ['24+', 'technologies']].map(([value, label]) => <div key={label} className="border-b border-r border-white/[0.07] px-4 py-3"><p className="text-lg font-bold text-emerald-300">{value}</p><p className="mt-0.5 text-[8px] uppercase tracking-wider text-slate-600">{label}</p></div>)}
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-slate-500"><span className="text-amber-300">GET_STARTED:</span><span>type <b className="text-emerald-300">help</b></span><span>or try <b className="text-cyan-300">neofetch</b></span><span className="hidden sm:inline">use <b className="text-fuchsia-300">voice</b> to speak</span></div>
  </div>
);

export function InteractiveTerminal() {
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, content: welcome }]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const counter = useRef(1);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const result = (content: ReactNode, command?: string, path = cwd): Entry => ({ id: counter.current++, command, path, content });

  const run = (rawCommand: string) => {
    const raw = rawCommand.trim();
    if (!raw) return;
    const [name = '', ...args] = raw.split(/\s+/);
    const command = name.toLowerCase();
    setHistory((current) => [...current, raw]);
    setHistoryIndex(-1);

    if (command === 'clear') {
      setEntries([]);
      return;
    }

    let content: ReactNode;
    switch (command) {
      case 'help':
        content = <CommandList />;
        break;
      case 'pwd':
        content = <Line>/home/mahesh/{cwd === '~' ? '' : cwd}</Line>;
        break;
      case 'ls':
        content = cwd === '~' ? <div className="flex flex-wrap gap-x-6 gap-y-2">{directories.map((item) => <button key={item} onClick={() => run(`cd ${item}`)} className="text-cyan-300 hover:underline">{item}/</button>)}{Object.keys(files).map((item) => <button key={item} onClick={() => run(`cat ${item}`)} className="text-slate-300 hover:text-emerald-300">{item}</button>)}</div> : <Line>README.md</Line>;
        break;
      case 'cd': {
        const target = args[0] ?? '~';
        if (target === '~' || target === '..' || target === '/') setCwd('~');
        else if (directories.includes(target.replace(/\/$/, ''))) setCwd(target.replace(/\/$/, ''));
        else content = <ErrorLine>cd: {target}: No such directory</ErrorLine>;
        content ??= <Line>directory changed</Line>;
        break;
      }
      case 'cat': {
        const file = args[0] ?? (cwd === '~' ? '' : 'README.md');
        if (cwd !== '~' && (file === 'README.md' || !args[0])) content = renderSection(cwd);
        else if (files[file]) content = <div className="max-w-4xl whitespace-pre-wrap leading-7 text-slate-300">{files[file]}</div>;
        else content = <ErrorLine>cat: {file || 'missing operand'}: No such file</ErrorLine>;
        break;
      }
      case 'whoami':
        content = <div><p className="text-emerald-300">{personalInfo.name}</p><p className="mt-1 text-slate-400">{personalInfo.role}</p></div>;
        break;
      case 'about': case 'skills': case 'projects': case 'experience': case 'certificates': case 'contact':
        content = renderSection(command);
        break;
      case 'social':
        content = <LinkList items={socialLinks.map((link) => ({ label: link.label, href: link.href }))} />;
        break;
      case 'resume':
        content = <p>Opening <a className="terminal-link" href={personalInfo.resumeUrl} target="_blank" rel="noreferrer">resume.pdf ↗</a></p>;
        window.open(personalInfo.resumeUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'open':
        content = openTarget(args.join(' '));
        break;
      case 'voice':
        content = <Line>Microphone activated. Say a command after permission is granted.</Line>;
        window.setTimeout(startVoice, 0);
        break;
      case 'speak': {
        const speech = args.join(' ') || 'Hello, I am Mahesh Raskar portfolio terminal.';
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(speech));
          content = <Line>Speaking: {speech}</Line>;
        } else content = <ErrorLine>speech synthesis is not supported in this browser</ErrorLine>;
        break;
      }
      case 'date':
        content = <Line>{new Date().toString()}</Line>;
        break;
      case 'uname':
        content = <Line>PortfolioOS mahesh 2.0.0 web x86_64 React/TypeScript</Line>;
        break;
      case 'neofetch':
        content = <NeoFetch />;
        break;
      case 'echo':
        content = <Line>{args.join(' ')}</Line>;
        break;
      case 'history':
        content = <div>{[...history, raw].map((item, index) => <p key={`${item}-${index}`}><span className="mr-4 text-slate-600">{index + 1}</span>{item}</p>)}</div>;
        break;
      case 'sudo':
        content = <ErrorLine>mahesh is already the administrator of this portfolio.</ErrorLine>;
        break;
      default:
        content = <ErrorLine>{command}: command not found. Type 'help' for available commands.</ErrorLine>;
    }
    setEntries((current) => [...current, result(content, raw)]);
  };

  function startVoice() {
    const speechWindow = window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setEntries((current) => [...current, result(<ErrorLine>voice input is unavailable. Use Chrome or Edge and allow microphone access.</ErrorLine>, 'voice')]);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const spoken = event.results[0]?.[0]?.transcript.trim().toLowerCase();
      if (spoken) { setInput(''); run(spoken); }
    };
    recognition.onerror = () => setEntries((current) => [...current, result(<ErrorLine>microphone access failed or no speech was detected</ErrorLine>, 'voice')]);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    run(input);
    setInput('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (next >= 0) { setHistoryIndex(next); setInput(history[history.length - 1 - next]); }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(next >= 0 ? history[history.length - 1 - next] : '');
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const matches = [...commands, ...directories, ...Object.keys(files)].filter((item) => item.startsWith(input.split(/\s+/).at(-1) ?? ''));
      if (matches.length === 1) setInput((current) => `${current.slice(0, current.lastIndexOf(' ') + 1)}${matches[0]}`);
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault(); setEntries([]);
    }
  };

  return (
    <main className="terminal-workspace min-h-screen px-3 py-3 sm:px-6 sm:py-5" onClick={() => inputRef.current?.focus()}>
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-[1580px] flex-col sm:h-[calc(100vh-2.5rem)]">
        <header className="mb-3 flex shrink-0 items-center justify-between border border-white/[0.07] bg-[#07100c]/90 px-4 py-3 shadow-2xl backdrop-blur sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-emerald-400/40 bg-emerald-400/10 text-sm font-bold text-emerald-300">MR</span>
            <div><p className="text-xs font-bold tracking-[0.18em] text-slate-200">MAHESH.DEV</p><p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">interactive portfolio system</p></div>
          </div>
          <div className="hidden items-center gap-6 text-[10px] uppercase tracking-widest text-slate-600 md:flex"><span><b className="text-cyan-300">05</b> projects</span><span><b className="text-amber-300">12</b> credentials</span><span className="text-emerald-400">available for work</span></div>
          <button type="button" onClick={(event) => { event.stopPropagation(); startVoice(); }} disabled={isListening} className={`voice-button px-3 py-2 text-[10px] uppercase tracking-wider ${isListening ? 'listening text-red-300' : 'text-cyan-300'}`}>{isListening ? '● listening' : '◉ speak command'}</button>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden min-h-0 flex-col overflow-hidden border border-white/[0.07] bg-[#07100c]/90 lg:flex">
            <div className="border-b border-white/[0.07] p-5">
              <div className="mb-4 flex items-center gap-3"><span className="relative grid h-11 w-11 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-sm text-emerald-300">$<i className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#07100c] bg-emerald-400" /></span><div><p className="text-xs font-semibold text-slate-200">Mahesh Raskar</p><p className="text-[10px] text-emerald-400">root access</p></div></div>
              <p className="text-[10px] leading-5 text-slate-500">Full-stack developer building AI, data, cloud and web products.</p>
            </div>
            <div className="p-3"><p className="px-2 pb-2 text-[9px] uppercase tracking-[0.2em] text-slate-600">Explore</p>{['about', 'skills', 'projects', 'experience', 'certificates', 'contact'].map((item, index) => <button key={item} onClick={(event) => { event.stopPropagation(); run(item); }} className="group flex w-full items-center gap-3 border-l border-transparent px-3 py-2.5 text-left text-[11px] text-slate-400 transition hover:border-emerald-400 hover:bg-emerald-400/5 hover:text-emerald-300"><span className="text-slate-700 group-hover:text-emerald-500">0{index + 1}</span><span>./{item}</span></button>)}</div>
            <div className="mt-auto border-t border-white/[0.07] p-4 text-[9px] uppercase tracking-widest text-slate-600"><div className="mb-2 flex justify-between"><span>CPU</span><span className="text-emerald-400">12%</span></div><div className="h-px bg-slate-800"><div className="h-px w-[12%] bg-emerald-400" /></div><div className="mb-2 mt-4 flex justify-between"><span>Session</span><span className="text-cyan-300">secure</span></div></div>
          </aside>

          <section className="terminal-window flex min-h-0 flex-col overflow-hidden border border-emerald-400/20 bg-[#040806] shadow-[0_0_80px_rgba(16,185,129,0.08)]">
        <div className="flex shrink-0 items-center border-b border-emerald-400/20 bg-[#0a130e] px-4 py-3">
          <div className="flex gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-300" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></div>
          <p className="mx-auto text-xs text-slate-500">mahesh@portfolio: {cwd} — bash</p>
          <div className="flex items-center gap-3"><span className="hidden text-[10px] text-slate-500 md:block">{clock.toLocaleTimeString()}</span><span className="hidden text-[10px] text-emerald-400 sm:block">● ONLINE</span></div>
        </div>
        <div className="flex shrink-0 items-end gap-1 border-b border-white/[0.06] bg-[#060b08] px-3 pt-2">
          <div className="flex min-w-40 items-center justify-between border-x border-t border-emerald-400/15 bg-[#0a130e] px-3 py-2 text-[9px] text-emerald-300"><span>● terminal</span><span className="text-slate-700">×</span></div>
          <div className="hidden min-w-36 items-center justify-between px-3 py-2 text-[9px] text-slate-600 sm:flex"><span>README.md</span><span>×</span></div>
          <button type="button" className="px-3 py-2 text-[11px] text-slate-600 transition hover:text-emerald-300" aria-label="New terminal">+</button>
        </div>
        <div className="flex shrink-0 items-center justify-between border-b border-emerald-400/10 bg-[#060d09] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-600">
          <div className="flex gap-4"><span><b className="text-emerald-400">OS</b> Portfolio Linux</span><span className="hidden sm:inline"><b className="text-cyan-300">Shell</b> bash</span><span className="hidden md:inline"><b className="text-amber-300">Mode</b> interactive</span></div>
          <span className="text-[9px] text-slate-600">UTF-8</span>
        </div>
        <div ref={outputRef} className="terminal-scroll flex-1 space-y-6 overflow-y-auto p-4 text-xs leading-6 sm:p-6 sm:text-sm" aria-live="polite">
          {entries.map((entry) => <div key={entry.id}>{entry.command ? <Prompt path={entry.path ?? cwd} command={entry.command} /> : null}<div className={entry.command ? 'mt-2' : ''}>{entry.content}</div></div>)}
          <form onSubmit={submit} className="!border-0 !bg-transparent !p-0 !shadow-none">
            <label className="flex items-center gap-2"><span className="shrink-0 text-emerald-400">mahesh@portfolio</span><span className="text-slate-500">:</span><span className="text-cyan-300">{cwd}</span><span className="text-slate-500">$</span><input ref={inputRef} autoFocus value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false} aria-label="Terminal command" className="!min-w-0 flex-1 !border-0 !bg-transparent !p-0 !text-emerald-100 !shadow-none !outline-none !ring-0" /></label>
          </form>
        </div>
        <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-emerald-400/15 bg-[#07100b] p-2 sm:px-4">
          <span className="hidden self-center pr-2 text-[10px] uppercase tracking-widest text-emerald-500 sm:inline">quick.run</span>{['help', 'neofetch', 'about', 'skills', 'projects', 'experience', 'certificates', 'contact', 'voice', 'clear'].map((item) => <button key={item} onClick={() => run(item)} className="shrink-0 border border-emerald-400/20 px-3 py-1.5 text-[11px] text-slate-400 transition hover:border-emerald-400/60 hover:bg-emerald-400/5 hover:text-emerald-300">{item}</button>)}
        </div>
          </section>
        </div>
        <footer className="mt-2 hidden shrink-0 items-center justify-between px-1 text-[9px] uppercase tracking-wider text-slate-700 sm:flex"><span>↑↓ history · tab autocomplete · ctrl+l clear</span><span>React / TypeScript / Voice API</span></footer>
      </div>
    </main>
  );
}

function Prompt({ path, command }: { path: string; command: string }) { return <p><span className="text-emerald-400">mahesh@portfolio</span><span className="text-slate-500">:</span><span className="text-cyan-300">{path}</span><span className="text-slate-500">$</span> <span className="text-slate-200">{command}</span></p>; }
function Line({ children }: { children: ReactNode }) { return <p className="text-slate-300">{children}</p>; }
function ErrorLine({ children }: { children: ReactNode }) { return <p className="text-red-400">bash: {children}</p>; }

function CommandList() {
  const list = [['help', 'show this command guide'], ['ls / cd / pwd / cat', 'browse the portfolio filesystem'], ['about / whoami', 'display profile information'], ['skills', 'list technical skills and levels'], ['projects', 'show projects and source links'], ['experience', 'show work history'], ['certificates', 'show credentials'], ['contact / social', 'show contact and social links'], ['open <name>', 'open github, linkedin, resume, or a project'], ['voice', 'listen for and execute a spoken command'], ['speak <text>', 'read text aloud'], ['neofetch / uname / date', 'system information'], ['history / clear', 'manage the terminal session']];
  return <div className="grid max-w-3xl gap-x-8 gap-y-1 sm:grid-cols-[auto_1fr]">{list.flatMap(([command, description]) => [<span key={`${command}-c`} className="text-amber-300">{command}</span>, <span key={`${command}-d`} className="text-slate-400">{description}</span>])}<span className="mt-3 text-slate-500 sm:col-span-2">Tip: use ↑/↓ for history, Tab to autocomplete, and Ctrl+L to clear.</span></div>;
}

function renderSection(section: string): ReactNode {
  if (section === 'about') return <div className="max-w-5xl space-y-3"><p className="text-xl text-emerald-300">{personalInfo.name}</p><p>{personalInfo.about}</p><p><span className="text-cyan-300">Education:</span> {personalInfo.education}</p><p><span className="text-cyan-300">Objective:</span> {personalInfo.objective}</p></div>;
  if (section === 'skills') return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{skillCategories.map((category) => <div key={category.title}><p className="mb-2 text-cyan-300">./{category.title.toLowerCase().replaceAll(' ', '-')}</p>{category.skills.map((skill) => <p key={skill.name}><span className="inline-block w-44 text-slate-300">{skill.name}</span><span className="text-emerald-400">{'█'.repeat(Math.round(skill.level / 10))}</span> <span className="text-slate-500">{skill.level}%</span></p>)}</div>)}</div>;
  if (section === 'projects') return <div className="grid gap-5 lg:grid-cols-2">{projects.map((project, index) => <div key={project.name} className="border-l border-emerald-400/25 pl-4"><p><span className="text-slate-600">[{String(index + 1).padStart(2, '0')}]</span> <span className="text-emerald-300">{project.name}</span> <span className="text-amber-300">({project.status})</span></p><p className="my-1 text-slate-400">{project.description}</p><p className="text-cyan-300">{project.stack.join(' · ')}</p><div className="mt-2 flex gap-4">{project.githubUrl && <a className="terminal-link" href={project.githubUrl} target="_blank" rel="noreferrer">source ↗</a>}{project.liveUrl && <a className="terminal-link" href={project.liveUrl} target="_blank" rel="noreferrer">live ↗</a>}</div></div>)}</div>;
  if (section === 'experience') return <div className="space-y-6">{experienceItems.map((item) => <div key={item.company} className="border-l border-cyan-400/30 pl-4"><p className="text-emerald-300">{item.position} @ {item.company}</p><p className="text-amber-200">{item.duration} | {item.location}</p>{item.responsibilities.map((line) => <p key={line} className="mt-1 text-slate-400">+ {line}</p>)}</div>)}</div>;
  if (section === 'certificates') return <div className="grid gap-2 md:grid-cols-2">{certifications.map((item, index) => <a key={item.title} href={item.documentUrl} target="_blank" rel="noreferrer" className="terminal-link"><span className="text-slate-600">{String(index + 1).padStart(2, '0')}</span> {item.title} — {item.issuer} ↗</a>)}</div>;
  if (section === 'contact') return <div className="space-y-2"><p><span className="text-cyan-300">email:</span> <a className="terminal-link" href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></p><p><span className="text-cyan-300">location:</span> {personalInfo.location}</p><p className="text-slate-500">Run 'social' for all profiles or 'open email' to write a message.</p></div>;
  return <ErrorLine>{section}: unavailable</ErrorLine>;
}

function LinkList({ items }: { items: { label: string; href: string }[] }) { return <div className="flex flex-col gap-1">{items.map((item) => <a key={item.label} className="terminal-link" href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">{item.label.toLowerCase()} → {item.href}</a>)}</div>; }

function openTarget(targetRaw: string): ReactNode {
  const target = targetRaw.toLowerCase();
  const social = socialLinks.find((item) => item.label.toLowerCase() === target);
  const project = projects.find((item) => item.name.toLowerCase().includes(target));
  const url = target === 'resume' ? personalInfo.resumeUrl : target === 'email' ? `mailto:${personalInfo.email}` : social?.href ?? project?.liveUrl ?? project?.githubUrl;
  if (!target) return <ErrorLine>open: missing target. Try 'open github' or 'open resume'.</ErrorLine>;
  if (!url) return <ErrorLine>open: {target}: target not found</ErrorLine>;
  window.open(url, '_blank', 'noopener,noreferrer');
  return <p>Opening <a href={url} className="terminal-link" target="_blank" rel="noreferrer">{target} ↗</a></p>;
}

function NeoFetch() { return <div className="grid max-w-xl gap-4 sm:grid-cols-[120px_1fr]"><pre className="text-emerald-400">{`   /\\
  /  \\
 / /\\ \\
/_/  \\_\\`}</pre><div><p className="text-emerald-300">mahesh@portfolio</p><p className="text-slate-600">--------------------</p><p><span className="text-cyan-300">OS:</span> PortfolioOS Web</p><p><span className="text-cyan-300">Host:</span> React + TypeScript</p><p><span className="text-cyan-300">Role:</span> {personalInfo.role}</p><p><span className="text-cyan-300">Location:</span> {personalInfo.location}</p><p><span className="text-cyan-300">Projects:</span> {projects.length} featured</p><p><span className="text-cyan-300">Status:</span> open_to_work</p></div></div>; }
