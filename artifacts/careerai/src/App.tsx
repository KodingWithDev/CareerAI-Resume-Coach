import { useRef, useState } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useDownloadResumePdf, useGenerateResume, useSubmitInterviewTurn, type InterviewTurnInput, type InterviewTurnResponse, type ResumeDocument } from '@workspace/api-client-react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, BriefcaseBusiness,
  Check, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert,
  ClipboardCheck, FileText, FileDown, GraduationCap, Hammer, HeartHandshake,
  Home as HomeIcon, Lightbulb, ListChecks, LockKeyhole, Menu, MessageCircle,
  LoaderCircle, PencilLine, RefreshCw, Rocket, ScanSearch, ShieldCheck, Sparkles, Target,
  UploadCloud, UserRound, WandSparkles, X, Brain, Bot, CheckCheck, CircleHelp,
  Mic2, Send, SlidersHorizontal, Trophy, TrendingUp, Volume2,
} from 'lucide-react';

type Profile = {
  fullName: string; email: string; phone: string; location: string; school: string;
  degree: string; graduation: string; skills: string; projects: string;
  experience: string; certifications: string; achievements: string; targetRole: string;
};

const emptyProfile: Profile = {
  fullName: '', email: '', phone: '', location: '', school: '', degree: '',
  graduation: '', skills: '', projects: '', experience: '', certifications: '',
  achievements: '', targetRole: '',
};

const navItems = [
  { href: '/', label: 'Workspace', icon: HomeIcon },
  { href: '/build', label: 'Build resume', icon: Hammer },
  { href: '/check', label: 'Check resume', icon: ScanSearch },
  { href: '/edit', label: 'Edit resume', icon: PencilLine },
  { href: '/interview', label: 'Interview coach', icon: MessageCircle },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={`flex items-center gap-3 ${compact ? 'justify-center' : ''}`} data-testid="link-brand">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-[3px_3px_0_hsl(var(--sidebar))]">
      <Target size={18} strokeWidth={2.5} />
    </span>
    {!compact && <span className="font-display text-[17px] font-bold tracking-[-.04em]">career<span className="text-[hsl(var(--accent))]">ai</span></span>}
  </Link>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="min-h-[100dvh] bg-[hsl(var(--background))] paper-texture">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between">
        <Brand />
        <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-[hsl(var(--sidebar-foreground)/.65)] hover:bg-[hsl(var(--sidebar-accent))] lg:hidden" aria-label="Close navigation" data-testid="button-close-navigation"><X size={19} /></button>
      </div>
      <div className="mt-12">
        <p className="mb-3 px-3 font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.48)]">Your workspace</p>
        <nav className="space-y-1" aria-label="Primary navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? location === '/' : location.startsWith(href);
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] shadow-[inset_3px_0_0_hsl(var(--accent))]' : 'text-[hsl(var(--sidebar-foreground)/.66)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={17} className={active ? 'text-[hsl(var(--accent))]' : 'opacity-70'} /> <span>{label}</span>
              {label === 'Interview coach' && <span className="ml-auto rounded-full bg-[hsl(var(--accent)/.18)] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-[hsl(var(--accent))]">ProSim</span>}
            </Link>;
          })}
        </nav>
      </div>
      <div className="mt-auto">
        <div className="rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.55)] p-4">
          <div className="mb-3 flex items-center gap-2"><HeartHandshake size={17} className="text-[hsl(var(--accent))]" /><span className="font-display text-xs font-semibold">A little reminder</span></div>
          <p className="text-[12px] leading-relaxed text-[hsl(var(--sidebar-foreground)/.63)]">You already have more experience than you think. We’ll help you name it.</p>
        </div>
        <p className="mt-5 px-1 font-mono text-[9px] uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.4)]">Private by default · local prototype</p>
      </div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-[hsl(var(--sidebar)/.56)] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" data-testid="button-navigation-overlay" />}
    <div className="lg:pl-[248px]">
      <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[hsl(var(--border)/.72)] bg-[hsl(var(--background)/.88)] px-5 backdrop-blur-md sm:px-8 lg:px-12">
        <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-[hsl(var(--border))] p-2 text-[hsl(var(--secondary))] lg:hidden" aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={19} /></button>
        <div className="hidden items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] sm:flex"><span className="font-mono text-[10px] uppercase tracking-[.16em]">CareerAI</span><span>/</span><span data-testid="text-current-route">{location === '/' ? 'Workspace' : location.slice(1).replace('-', ' ')}</span></div>
        <div className="ml-auto flex items-center gap-3"><span className="hidden text-right sm:block"><span className="block font-display text-[11px] font-semibold">Your career workspace</span><span className="block text-[10px] text-[hsl(var(--muted-foreground))]">A calm place to get ready</span></span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]" data-testid="avatar-workspace"><UserRound size={17} /></span></div>
      </header>
      <main className="mx-auto w-full max-w-[1260px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">{children}</main>
    </div>
  </div>;
}

function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
    <div className="animate-rise"><p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[hsl(var(--primary))]">{eyebrow}</p><h1 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-[-.055em] text-[hsl(var(--secondary))]">{title}</h1><p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[hsl(var(--muted-foreground))]">{description}</p></div>
    {children}
  </div>;
}

function Home() {
  return <div>
    <section className="relative overflow-hidden rounded-[28px] bg-[hsl(var(--secondary))] px-6 py-9 text-[hsl(var(--secondary-foreground))] shadow-[var(--shadow-soft)] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[32px] border-[hsl(var(--accent)/.14)]" /><div className="absolute right-14 top-16 h-7 w-7 rotate-12 rounded-lg bg-[hsl(var(--accent))] opacity-80 animate-float" />
      <div className="relative max-w-2xl animate-rise"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--secondary-foreground)/.18)] bg-[hsl(var(--secondary-foreground)/.08)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--secondary-foreground)/.72)]"><Sparkles size={12} className="text-[hsl(var(--accent))]" /> Your unfair advantage is your story</div>
        <h1 className="font-display text-[clamp(2.4rem,6vw,5.4rem)] font-bold leading-[.99] tracking-[-.07em]">Make your<br /><span className="text-[hsl(var(--accent))]">next move</span> feel possible.</h1>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[hsl(var(--secondary-foreground)/.68)]">CareerAI helps you turn classes, side projects, and “just figuring it out” into a resume and interview story you can stand behind.</p>
        <div className="mt-8 flex flex-wrap items-center gap-3"><Link href="/build" className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-5 py-3 text-[13px] font-bold text-[hsl(var(--foreground))] transition-transform hover:-translate-y-0.5" data-testid="link-hero-build">Build my resume <ArrowUpRight size={16} /></Link><span className="font-mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--secondary-foreground)/.48)]">No account needed</span></div>
      </div>
      <div className="relative mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-[hsl(var(--secondary-foreground)/.15)] pt-5 sm:absolute sm:bottom-10 sm:right-10 sm:mt-0 sm:w-[285px] sm:border-t-0 sm:pt-0">
        {[['01', 'Get clear', 'Name what you bring'], ['02', 'Get ready', 'Practice with purpose'], ['03', 'Go forward', 'Show up as yourself']].map(([n, t, s]) => <div key={n} className="border-l border-[hsl(var(--secondary-foreground)/.18)] pl-3"><p className="font-mono text-[10px] text-[hsl(var(--accent))]">{n}</p><p className="mt-2 text-[11px] font-semibold">{t}</p><p className="mt-1 text-[10px] leading-snug text-[hsl(var(--secondary-foreground)/.48)]">{s}</p></div>)}
      </div>
    </section>
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      <ActionCard href="/build" number="01" icon={<Hammer size={22} />} title="Build resume" description="Start from what you’ve done, not from a blank page." accent="primary" />
      <ActionCard href="/check" number="02" icon={<ScanSearch size={22} />} title="Check resume" description="Upload a PDF and spot the gaps before a recruiter does." accent="coral" />
      <ActionCard href="/edit" number="03" icon={<PencilLine size={22} />} title="Edit resume" description="Review focused suggestions and make every line earn its place." accent="gold" />
    </section>
    <section className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--muted-foreground))]">The CareerAI approach</p><h2 className="mt-3 font-display text-2xl font-bold tracking-[-.045em] text-[hsl(var(--secondary))]">Confidence is a<br />skill you can practice.</h2></div><div className="rounded-2xl bg-[hsl(var(--accent)/.13)] p-3 text-[hsl(var(--primary))]"><Lightbulb size={21} /></div></div><div className="mt-8 grid gap-5 sm:grid-cols-3">{[['Make it specific', 'Translate “helped out” into what changed because you were there.'], ['Keep it human', 'Your voice is not a liability. It is the part people remember.'], ['Take the next step', 'Small edits become momentum when you can see the path.']].map(([t, d], i) => <div key={t} className="border-t-2 border-[hsl(var(--border))] pt-3"><span className="font-mono text-[10px] text-[hsl(var(--accent))]">0{i + 1}</span><h3 className="mt-2 text-sm font-bold">{t}</h3><p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{d}</p></div>)}</div></div>
      <div className="rounded-3xl bg-[hsl(var(--accent)/.17)] p-6 sm:p-8"><div className="flex h-full flex-col justify-between"><div><div className="flex items-center gap-2 text-[hsl(var(--primary))]"><ShieldCheck size={18} /><span className="font-mono text-[10px] uppercase tracking-[.16em]">A safe starting point</span></div><p className="mt-6 font-display text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-[-.05em] text-[hsl(var(--secondary))]">No judgment.<br />No magic buttons.<br /><span className="text-[hsl(var(--primary))]">Just your next step.</span></p></div><Link href="/interview" className="mt-9 inline-flex items-center gap-2 text-[12px] font-bold text-[hsl(var(--primary))]" data-testid="link-home-interview">See interview coaching <ArrowRight size={15} /></Link></div></div>
    </section>
  </div>;
}

function ActionCard({ href, number, icon, title, description, accent }: { href: string; number: string; icon: React.ReactNode; title: string; description: string; accent: 'primary' | 'coral' | 'gold' }) {
  const colors = { primary: 'bg-[hsl(var(--primary)/.11)] text-[hsl(var(--primary))]', coral: 'bg-[hsl(var(--accent)/.17)] text-[hsl(var(--accent-foreground))]', gold: 'bg-[hsl(43_83%_56%/.2)] text-[hsl(34_55%_25%)]' };
  return <Link href={href} className="group relative min-h-[205px] overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--primary)/.35)] hover:shadow-[var(--shadow-soft)]" data-testid={`card-action-${title.toLowerCase().replaceAll(' ', '-')}`}><span className="absolute right-5 top-5 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{number}</span><span className={`mb-12 grid h-11 w-11 place-items-center rounded-2xl ${colors[accent]}`}>{icon}</span><h2 className="font-display text-xl font-bold tracking-[-.04em] text-[hsl(var(--secondary))]">{title}<ArrowUpRight size={17} className="ml-2 inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></h2><p className="mt-2 max-w-[250px] text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">{description}</p></Link>;
}

function ResumeSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <section className="resume-section" data-testid={`resume-section-${title.toLowerCase()}`}>
    <h3 className="resume-section-title">{title}</h3>
    <div className="resume-section-content">{items.map((item, index) => <p key={`${title}-${index}`} className="resume-entry">{item}</p>)}</div>
  </section>;
}

function ResumePreview({ profile, resume, onEdit, onRegenerate, isRegenerating }: {
  profile: Profile;
  resume: ResumeDocument;
  onEdit: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const contact = [profile.email, profile.phone, profile.location].filter(Boolean).join('  ·  ');
  const downloadPdf = useDownloadResumePdf();
  const handleDownload = async () => {
    try {
      const pdf = await downloadPdf.mutateAsync({
        data: {
          profile: {
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            targetRole: profile.targetRole,
          },
          resume,
        },
      });
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profile.fullName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.alert('We could not create the PDF right now. Please try again.');
    }
  };
  return <section id="resume-preview" className="resume-preview-shell mt-10" data-testid="resume-preview">
    <div className="resume-preview-heading">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--primary))]">Your generated resume</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-[hsl(var(--secondary))]">Ready for your next move.</h2>
      </div>
      <div className="resume-actions flex flex-wrap items-center gap-2">
        <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2.5 text-xs font-bold text-[hsl(var(--secondary))] transition-colors hover:border-[hsl(var(--primary)/.4)]" data-testid="button-edit-resume"><PencilLine size={14} /> Edit</button>
        <button onClick={onRegenerate} disabled={isRegenerating} className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2.5 text-xs font-bold text-[hsl(var(--secondary))] transition-colors hover:border-[hsl(var(--primary)/.4)] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-regenerate-resume">{isRegenerating ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={14} />} Regenerate</button>
        <button onClick={handleDownload} disabled={downloadPdf.isPending} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-3 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-download-resume">{downloadPdf.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <FileDown size={14} />} {downloadPdf.isPending ? 'Creating PDF' : 'Download PDF'}</button>
      </div>
    </div>
    <div className="resume-print-card mt-5 rounded-2xl border border-[hsl(var(--border))] bg-white p-7 text-slate-900 shadow-[var(--shadow-soft)] sm:p-12" data-testid="resume-document">
      <header className="border-b-2 border-slate-900 pb-5 text-center">
        <h1 className="font-display text-3xl font-bold tracking-[-.045em]">{profile.fullName || 'Your Name'}</h1>
        <p className="mt-2 text-xs text-slate-600">{contact || 'Add your contact details in the questionnaire'}</p>
        {profile.targetRole && <p className="mt-3 text-[11px] font-semibold uppercase tracking-[.16em] text-teal-700">{profile.targetRole}</p>}
      </header>
      {resume.summary && <section className="resume-section mt-6" data-testid="resume-section-summary"><h3 className="resume-section-title">Professional Summary</h3><p className="resume-summary">{resume.summary}</p></section>}
      <ResumeSection title="Experience" items={resume.experience} />
      <ResumeSection title="Projects" items={resume.projects} />
      <ResumeSection title="Education" items={resume.education} />
      <ResumeSection title="Skills" items={resume.skills} />
      <ResumeSection title="Certifications" items={resume.certifications} />
      <ResumeSection title="Achievements" items={resume.achievements} />
    </div>
     <p className="resume-edit-note mt-3 text-center text-[11px] text-[hsl(var(--muted-foreground))]">Use Edit to update your story, or download a clean one-page PDF.</p>
  </section>;
}

const steps = [
  { label: 'Basics', icon: UserRound, fields: ['fullName', 'email', 'phone', 'location'] },
  { label: 'Education', icon: GraduationCap, fields: ['school', 'degree', 'graduation'] },
  { label: 'Skills & work', icon: BriefcaseBusiness, fields: ['skills', 'projects', 'experience'] },
  { label: 'Stand out', icon: BadgeCheck, fields: ['certifications', 'achievements', 'targetRole'] },
];

function Build({ profile, setProfile }: { profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>> }) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<ResumeDocument | null>(null);
  const [generationError, setGenerationError] = useState('');
  const generatingRef = useRef(false);
  const generateResume = useGenerateResume();
  const current = steps[step];
  const fieldMeta: Record<string, { label: string; placeholder: string; type?: string; help?: string }> = {
    fullName: { label: 'Full name', placeholder: 'e.g. Maya Thompson' },
    email: { label: 'Email address', placeholder: 'maya@email.com', type: 'email' },
    phone: { label: 'Phone number', placeholder: '(555) 014-2872' },
    location: { label: 'City, state', placeholder: 'Austin, TX' },
    school: { label: 'School or university', placeholder: 'University of Texas at Austin' },
    degree: { label: 'Degree and field of study', placeholder: 'B.S. Information Science' },
    graduation: { label: 'Expected graduation', placeholder: 'May 2026' },
    skills: { label: 'Skills', placeholder: 'Figma, user research, SQL, public speaking', help: 'Separate each skill with a comma.' },
    projects: { label: 'Projects and extracurriculars', placeholder: 'What have you built, organized, researched, or led?', help: 'Class projects count. So do student orgs, freelance work, and side quests.' },
    experience: { label: 'Work experience', placeholder: 'Role, company, dates, and what you accomplished', help: 'Part-time jobs, internships, campus roles, and volunteer work all belong here.' },
    certifications: { label: 'Certifications or courses', placeholder: 'Google Analytics Certificate, Intro to Python' },
    achievements: { label: 'Achievements', placeholder: 'Scholarships, awards, publications, leadership, or moments you are proud of' },
    targetRole: { label: 'What role are you targeting?', placeholder: 'e.g. Product design intern' },
  };
  const isLong = ['skills', 'projects', 'experience', 'achievements'].some((x) => current.fields.includes(x));
  const update = (key: string, value: string) => setProfile((p) => ({ ...p, [key]: value }));
  const generate = async () => {
    if (generatingRef.current) return;
    generatingRef.current = true;
    setGenerationError('');
    try {
      const response = await generateResume.mutateAsync({ data: profile });
      setGeneratedResume(response);
      setSaved(true);
      window.setTimeout(() => document.getElementById('resume-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    } catch (error) {
      const status = typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: unknown }).status
        : undefined;
      setGenerationError(
        status === 429 || status === 500 || status === 502 || status === 503 || status === 504
          ? 'Gemini is temporarily unavailable. Please wait a few seconds and try again.'
          : 'We could not generate your resume right now. Please try again.',
      );
    } finally {
      generatingRef.current = false;
    }
  };
  const next = () => { if (step < steps.length - 1) setStep((s) => s + 1); else void generate(); };
  const edit = () => {
    setGeneratedResume(null);
    setSaved(false);
    setGenerationError('');
    setStep(0);
    window.setTimeout(() => document.getElementById('questionnaire')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };
  const canGenerate = Boolean(profile.fullName.trim() && profile.email.trim() && profile.targetRole.trim());
  return <div>
    <PageIntro eyebrow="Build your story" title="A resume that sounds like you." description="Start with the raw material. We’ll give your experience the structure it deserves." >
      <div className="hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-right sm:block"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Saved locally</p><p className="mt-1 text-sm font-bold text-[hsl(var(--primary))]"><Check size={14} className="mr-1 inline" /> Your progress is safe</p></div>
    </PageIntro>
     <div id="questionnaire" className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="relative"><div className="flex gap-2 overflow-x-auto pb-3 lg:block lg:space-y-2 lg:pb-0">{steps.map((item, i) => { const Icon = item.icon; const active = i === step; const complete = i < step || saved; return <button key={item.label} onClick={() => setStep(i)} className={`group flex min-w-[150px] items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors lg:w-full ${active ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/.6)]'}`} data-testid={`button-step-${item.label.toLowerCase().replaceAll(' ', '-')}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${active ? 'bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]' : complete ? 'bg-[hsl(var(--primary)/.13)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'}`}>{complete && !active ? <Check size={15} /> : <Icon size={15} />}</span><span><span className="block text-xs font-bold">{item.label}</span><span className={`block font-mono text-[9px] uppercase tracking-wide ${active ? 'text-[hsl(var(--secondary-foreground)/.55)]' : 'text-[hsl(var(--muted-foreground)/.7)]'}`}>{i + 1} of {steps.length}</span></span></button>; })}</div><div className="mt-8 hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 lg:block"><p className="font-display text-xs font-bold text-[hsl(var(--secondary))]">Not sure what counts?</p><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">If it took effort, taught you something, or helped someone else, it belongs in your story.</p><div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[hsl(var(--primary))]"><BookOpen size={13} /> Keep going</div></div></div>
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] sm:p-8">
        <div className="mb-8 flex items-start justify-between border-b border-[hsl(var(--border))] pb-6"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Step {step + 1} / {steps.length}</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-[hsl(var(--secondary))]">{current.label === 'Basics' ? 'Let’s start with you.' : current.label === 'Education' ? 'Where have you been learning?' : current.label === 'Skills & work' ? 'What have you made happen?' : 'Give them a reason to remember you.'}</h2></div><span className="rounded-full bg-[hsl(var(--accent)/.16)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[hsl(var(--accent-foreground))]">Local only</span></div>
        <div className={`grid gap-5 ${isLong ? '' : 'sm:grid-cols-2'}`}>{current.fields.map((key) => { const meta = fieldMeta[key]; return <label key={key} className={isLong ? 'block' : 'block'} data-testid={`field-${key}`}><span className="mb-2 block text-[12px] font-bold text-[hsl(var(--secondary))]">{meta.label}{['fullName', 'email', 'targetRole'].includes(key) && <span className="ml-1 text-[hsl(var(--accent))]">*</span>}</span>{isLong ? <textarea value={profile[key as keyof Profile]} onChange={(e) => update(key, e.target.value)} placeholder={meta.placeholder} rows={key === 'experience' || key === 'projects' ? 5 : 3} className="min-h-[92px] w-full resize-y rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-3 text-sm leading-relaxed text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/.62)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.12)]" data-testid={`textarea-${key}`} /> : <input type={meta.type ?? 'text'} value={profile[key as keyof Profile]} onChange={(e) => update(key, e.target.value)} placeholder={meta.placeholder} className="h-12 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/.62)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.12)]" data-testid={`input-${key}`} />}{meta.help && <span className="mt-2 block text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">{meta.help}</span>}</label>; })}</div>
         <div className="mt-9 flex items-center justify-between border-t border-[hsl(var(--border))] pt-6"><button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || generateResume.isPending} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] disabled:cursor-not-allowed disabled:opacity-35" data-testid="button-previous-step"><ChevronLeft size={16} /> Back</button><button onClick={next} disabled={generateResume.isPending || (step === steps.length - 1 && !canGenerate)} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-next-step">{generateResume.isPending ? <><LoaderCircle size={16} className="animate-spin" /> Building your resume</> : <>{step === steps.length - 1 ? 'Build my resume' : 'Continue'} <ChevronRight size={16} /></>}</button></div>
         {step === steps.length - 1 && !canGenerate && <p className="mt-3 text-right text-[11px] text-[hsl(var(--muted-foreground))]">Add your name, email, and target role to generate your resume.</p>}
          {generationError && <div className="mt-5 flex items-center gap-3 rounded-xl bg-[hsl(var(--destructive)/.1)] px-4 py-3 text-xs font-semibold text-[hsl(var(--destructive))]" role="alert" data-testid="status-generation-error"><CircleAlert size={16} className="shrink-0" /><span className="flex-1">{generationError}</span><button onClick={() => void generate()} disabled={generateResume.isPending} className="shrink-0 rounded-lg border border-[hsl(var(--destructive)/.25)] px-2.5 py-1.5 text-[11px] font-bold transition-colors hover:bg-[hsl(var(--destructive)/.1)] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-retry-generation">{generateResume.isPending ? 'Retrying…' : 'Try again'}</button></div>}
         {saved && !generationError && !generatedResume && <div className="mt-5 flex items-center gap-2 rounded-xl bg-[hsl(var(--primary)/.1)] px-4 py-3 text-xs font-semibold text-[hsl(var(--primary))]" data-testid="status-profile-saved"><CheckCircle2 size={16} /> Your story is saved locally. You can keep refining it anytime.</div>}
      </div>
    </div>
     {generatedResume && <ResumePreview profile={profile} resume={generatedResume} onEdit={edit} onRegenerate={generate} isRegenerating={generateResume.isPending} />}
  </div>;
}

function CheckResume() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return <div><PageIntro eyebrow="Check your resume" title="Know what’s working before you hit send." description="Bring your current PDF. We’ll make space for a sharper first impression — when the AI review is connected." /><div className="grid gap-6 lg:grid-cols-[1fr_340px]">
    <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] sm:p-8"><div className="mb-7"><h2 className="font-display text-xl font-bold tracking-[-.04em] text-[hsl(var(--secondary))]">Your resume, in context</h2><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">A target role helps future feedback become specific.</p></div>
      <label className={`group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 text-center transition-colors ${file ? 'border-[hsl(var(--primary)/.55)] bg-[hsl(var(--primary)/.06)]' : 'border-[hsl(var(--input))] bg-[hsl(var(--background))] hover:border-[hsl(var(--primary)/.5)]'}`} data-testid="dropzone-resume"><input type="file" accept=".pdf,application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} data-testid="input-resume-file" />{file ? <><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--primary)/.14)] text-[hsl(var(--primary))]"><FileText size={23} /></span><p className="mt-3 text-sm font-bold text-[hsl(var(--secondary))]" data-testid="text-uploaded-file">{file.name}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Ready to check · click to replace</p></> : <><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent)/.16)] text-[hsl(var(--accent-foreground))]"><UploadCloud size={23} /></span><p className="mt-3 text-sm font-bold text-[hsl(var(--secondary))]">Drop your PDF here</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">or browse from your device · PDF only</p></>}</label>
      <div className="mt-6 grid gap-5 sm:grid-cols-2"><label><span className="mb-2 block text-[12px] font-bold text-[hsl(var(--secondary))]">Target role <span className="text-[hsl(var(--accent))]">*</span></span><input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Marketing coordinator" className="h-12 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 text-sm placeholder:text-[hsl(var(--muted-foreground)/.62)] focus:border-[hsl(var(--primary))] focus:outline-none" data-testid="input-check-target-role" /></label><div className="flex items-end"><div className="flex w-full items-center gap-2 rounded-xl bg-[hsl(var(--muted)/.65)] px-4 py-3 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]"><LockKeyhole size={14} className="shrink-0 text-[hsl(var(--primary))]" /> Your file stays in this local prototype.</div></div></div>
      <label className="mt-5 block"><span className="mb-2 block text-[12px] font-bold text-[hsl(var(--secondary))]">Job description <span className="font-normal text-[hsl(var(--muted-foreground))]">(optional)</span></span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Paste the job description to compare your story with what they need..." className="w-full resize-y rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-3 text-sm leading-relaxed placeholder:text-[hsl(var(--muted-foreground)/.62)] focus:border-[hsl(var(--primary))] focus:outline-none" data-testid="textarea-job-description" /></label>
      <div className="mt-7 flex flex-col items-start gap-3 border-t border-[hsl(var(--border))] pt-6"><button onClick={() => setSubmitted(true)} disabled={!file || !role} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-submit-check">Check my resume <ArrowRight size={16} /></button>{submitted && <p className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]" data-testid="status-check-submitted"><CircleAlert size={15} /> AI checking will be available soon. Your details are saved for this session.</p>}</div>
    </div>
    <div className="rounded-3xl bg-[hsl(var(--secondary))] p-6 text-[hsl(var(--secondary-foreground))]"><div className="flex items-center gap-2 text-[hsl(var(--accent))]"><ClipboardCheck size={18} /><span className="font-mono text-[10px] uppercase tracking-[.16em]">What a check will look at</span></div><ul className="mt-7 space-y-5">{[['Signal', 'Does your opening make your direction clear?'], ['Evidence', 'Do your bullets show what changed because of your work?'], ['Fit', 'Does your language connect to the role you want?']].map(([t, d]) => <li key={t} className="flex gap-3"><span className="mt-0.5 text-[hsl(var(--accent))]"><Check size={15} /></span><span><strong className="block text-sm">{t}</strong><span className="mt-1 block text-xs leading-relaxed text-[hsl(var(--secondary-foreground)/.58)]">{d}</span></span></li>)}</ul><div className="mt-10 border-t border-[hsl(var(--secondary-foreground)/.15)] pt-5"><p className="text-xs leading-relaxed text-[hsl(var(--secondary-foreground)/.58)]">A score is not a verdict. It’s a useful place to begin.</p></div></div>
  </div></div>;
}

function EditResume() {
  const [generated, setGenerated] = useState(false);
  const suggestions = [
    { icon: Target, tag: 'CLARITY', title: 'Lead with the direction you want', body: 'Your summary could make the connection between your coursework and product marketing more obvious.' },
    { icon: Rocket, tag: 'IMPACT', title: 'Give the campaign a pulse', body: 'Swap “helped with social media” for the audience you reached, the rhythm you kept, or the result you learned from.' },
    { icon: ListChecks, tag: 'EVIDENCE', title: 'Bring your campus role forward', body: 'Being treasurer is proof of trust and systems thinking. It deserves more than one line.' },
  ];
  return <div><PageIntro eyebrow="Edit your resume" title="Small edits. A much clearer you." description="Review the kinds of notes CareerAI will make on your resume. The live AI editor is the next piece we’re building." ><span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent)/.18)] px-3 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--accent-foreground))]"><WandSparkles size={13} /> AI editor coming soon</span></PageIntro>
    <div className="grid gap-7 lg:grid-cols-[1fr_350px]"><div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] sm:p-8"><div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-5"><div><p className="font-mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Sample review</p><h2 className="mt-2 font-display text-xl font-bold tracking-[-.04em] text-[hsl(var(--secondary))]">Maya Thompson</h2><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Product marketing intern · Austin, TX</p></div><span className="rounded-xl bg-[hsl(var(--primary)/.11)] px-3 py-2 text-center"><span className="block font-display text-xl font-bold text-[hsl(var(--primary))]">3</span><span className="font-mono text-[9px] uppercase tracking-wide text-[hsl(var(--primary))]">notes</span></span></div><div className="mt-7 space-y-4">{suggestions.map(({ icon: Icon, tag, title, body }, i) => <article key={tag} className="group flex gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.62)] p-4 transition-colors hover:border-[hsl(var(--accent)/.55)]" data-testid={`card-suggestion-${i}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--accent)/.16)] text-[hsl(var(--accent-foreground))]"><Icon size={17} /></span><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[9px] font-semibold tracking-[.14em] text-[hsl(var(--accent-foreground))]">{tag}</span><span className="h-1 w-1 rounded-full bg-[hsl(var(--border))]" /><span className="font-mono text-[9px] text-[hsl(var(--muted-foreground))]">suggestion {i + 1}</span></div><h3 className="mt-2 text-sm font-bold text-[hsl(var(--secondary))]">{title}</h3><p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{body}</p></div></article>)}</div></div>
      <aside className="h-fit rounded-3xl bg-[hsl(var(--secondary))] p-6 text-[hsl(var(--secondary-foreground))]"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"><Sparkles size={20} /></div><h2 className="mt-6 font-display text-xl font-bold tracking-[-.045em]">Ready for the rewrite?</h2><p className="mt-3 text-xs leading-relaxed text-[hsl(var(--secondary-foreground)/.6)]">When connected, CareerAI will apply the suggestions while keeping your voice intact.</p><button onClick={() => setGenerated(true)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-xs font-bold text-[hsl(var(--foreground))] transition-transform hover:-translate-y-0.5" data-testid="button-generate-improved">Generate improved resume <ArrowUpRight size={15} /></button><p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[.12em] text-[hsl(var(--secondary-foreground)/.42)]">Not yet connected to AI</p>{generated && <div className="mt-5 rounded-xl border border-[hsl(var(--secondary-foreground)/.15)] bg-[hsl(var(--secondary-foreground)/.07)] p-3 text-xs leading-relaxed text-[hsl(var(--secondary-foreground)/.72)]" data-testid="status-generation-coming-soon"><CheckCircle2 size={14} className="mr-1 inline text-[hsl(var(--accent))]" /> We saved your intent. Generation is coming soon.</div>}</aside>
    </div>
  </div>;
}

function CatAvatar({ state }: { state: 'idle' | 'listening' | 'thinking' | 'speaking' }) {
  return <div className="prosim-cat-wrap" data-state={state}>
    <div className="prosim-cat-glow" />
    <svg className="prosim-cat" viewBox="0 0 420 500" role="img" aria-label="VibeCat, a blue cat in a formal blazer">
      <defs>
        <linearGradient id="catFur" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#6cd9ee" /><stop offset="1" stopColor="#2488c5" /></linearGradient>
        <linearGradient id="catBlazer" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#1e355e" /><stop offset="1" stopColor="#101b39" /></linearGradient>
        <filter id="catShadow"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#071229" floodOpacity=".45" /></filter>
      </defs>
      <ellipse cx="210" cy="472" rx="142" ry="18" fill="#071229" opacity=".52" />
      <g className="prosim-cat-body" filter="url(#catShadow)">
        <path d="M88 472c4-94 34-143 122-151 88 8 118 57 122 151Z" fill="url(#catBlazer)" />
        <path d="M162 326h96l-15 64h-66Z" fill="#f8fafc" />
        <path d="m210 351 21 45-21 22-21-22Z" fill="#e35a62" />
        <path d="M189 382h42l-8 48h-26Z" fill="#f0c3c2" />
        <path d="m92 471 66-117 43 31-35 87Zm236 0-66-117-43 31 35 87Z" fill="#192d53" />
        <path d="m207 391 3 31 3-31 28 8-31 42-31-42Z" fill="#294678" />
        <path d="M175 450h70" stroke="#3c5886" strokeWidth="3" opacity=".65" />
        <g className="prosim-cat-head">
          <path d="M103 152 119 44l79 74c10-3 20-4 31-4s21 1 31 4l79-74 16 108v89c0 76-56 112-126 112s-126-36-126-112Z" fill="url(#catFur)" />
          <path d="M119 74 113 133l57-17Z" fill="#48b7db" />
          <path d="m301 74 6 59-57-17Z" fill="#48b7db" />
          <path d="M122 183c7-50 42-76 88-76s81 26 88 76c5 35-4 93-88 108-84-15-93-73-88-108Z" fill="#58c3e3" />
          <ellipse cx="169" cy="186" rx="31" ry="35" fill="#eaf8fb" />
          <ellipse cx="251" cy="186" rx="31" ry="35" fill="#eaf8fb" />
          <ellipse className="prosim-cat-eye" cx="175" cy="191" rx="10" ry="18" fill="#10233f" />
          <ellipse className="prosim-cat-eye" cx="245" cy="191" rx="10" ry="18" fill="#10233f" />
          <path d="M191 235q19 15 38 0" fill="none" stroke="#10233f" strokeLinecap="round" strokeWidth="5" />
          <path d="M210 214v19" stroke="#10233f" strokeLinecap="round" strokeWidth="4" />
          <path d="M125 225 65 211M125 240 61 245M295 225l60-14M295 240l64 5" stroke="#d8f4f7" strokeLinecap="round" strokeWidth="3" opacity=".7" />
          <path className="prosim-cat-ear" d="M117 104 123 66l45 42" fill="none" stroke="#d8f4f7" strokeLinecap="round" strokeWidth="5" />
          <path className="prosim-cat-ear" d="m303 104-6-38-45 42" fill="none" stroke="#d8f4f7" strokeLinecap="round" strokeWidth="5" />
        </g>
      </g>
    </svg>
    <div className="prosim-cat-status"><span className="prosim-status-dot" /> {state === 'thinking' ? 'Thinking…' : state === 'listening' ? 'Listening' : state === 'speaking' ? 'Speaking' : 'Ready to practice'}</div>
  </div>;
}

function ScoreBar({ label, value, tone = 'teal' }: { label: string; value: number; tone?: 'teal' | 'coral' | 'gold' }) {
  const toneClass = tone === 'coral' ? 'bg-[hsl(var(--accent))]' : tone === 'gold' ? 'bg-[hsl(43_83%_56%)]' : 'bg-[hsl(var(--primary))]';
  return <div>
    <div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="font-semibold text-[hsl(var(--secondary-foreground)/.68)]">{label}</span><span className="font-mono text-[10px] text-[hsl(var(--secondary-foreground)/.92)]">{value}</span></div>
    <div className="h-1.5 overflow-hidden rounded-full bg-[hsl(var(--secondary-foreground)/.12)]"><div className={`h-full rounded-full transition-all duration-700 ${toneClass}`} style={{ width: `${value}%` }} /></div>
  </div>;
}

function FeedbackCard({ feedback }: { feedback: InterviewTurnResponse['feedback'] }) {
  return <section className="mt-5 rounded-2xl border border-[hsl(var(--primary)/.24)] bg-[hsl(var(--primary)/.06)] p-5" data-testid="prosim-feedback">
    <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[hsl(var(--primary)/.15)] text-[hsl(var(--primary))]"><Bot size={16} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">VibeCat feedback</p><h3 className="text-sm font-bold text-[hsl(var(--secondary))]">Here’s the useful stuff</h3></div></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]"><CheckCheck size={13} /> What landed</p><p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{feedback.good}</p></div>
      <div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--accent-foreground))]"><TrendingUp size={13} /> Try changing</p><p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{feedback.change}</p></div>
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] p-3 sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--secondary))]">A more interview-ready version</p><p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--secondary))]">“{feedback.professionalAlternative}”</p></div>
    </div>
    <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-relaxed text-[hsl(var(--primary))]"><Sparkles size={14} className="mt-0.5 shrink-0" /> {feedback.encouragement}</p>
  </section>;
}

function PerformanceReport({ report, learningPlan }: { report: InterviewTurnResponse['report']; learningPlan: string[] }) {
  const items = [
    ['Technical Knowledge', report.technicalKnowledge, Brain],
    ['Communication', report.communication, MessageCircle],
    ['Answer Relevance', report.answerRelevance, Target],
    ['Problem Solving', report.problemSolving, SlidersHorizontal],
    ['Clarity', report.clarity, CheckCheck],
  ] as const;
  return <section className="mt-6 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] sm:p-8" data-testid="prosim-performance-report">
    <div className="flex flex-col justify-between gap-4 border-b border-[hsl(var(--border))] pb-6 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Interview performance report</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-[hsl(var(--secondary))]">You made it through. Now make it useful.</h2></div><span className="inline-flex items-center gap-2 self-start rounded-full bg-[hsl(var(--accent)/.15)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent-foreground))]"><Trophy size={13} /> Practice complete</span></div>
    <div className="mt-6 grid gap-3 md:grid-cols-2">{items.map(([label, item, Icon]) => <article key={label} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.6)] p-4"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"><Icon size={17} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-[hsl(var(--secondary))]">{label}</h3><span className="font-display text-xl font-bold text-[hsl(var(--primary))]">{item.score}</span></div><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{item.explanation}</p><p className="mt-2 text-[11px] font-semibold leading-relaxed text-[hsl(var(--secondary))]">Next move: {item.suggestion}</p></div></div></article>)}</div>
    <div className="mt-6 rounded-2xl bg-[hsl(var(--secondary))] p-5 text-[hsl(var(--secondary-foreground))]"><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--accent))]"><BookOpen size={13} /> Personalized learning plan</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{learningPlan.map((item, i) => <li key={`${item}-${i}`} className="flex gap-2 text-xs leading-relaxed text-[hsl(var(--secondary-foreground)/.72)]"><span className="font-mono text-[10px] text-[hsl(var(--accent))]">0{i + 1}</span>{item}</li>)}</ul></div>
  </section>;
}

function Interview({ profile }: { profile: Profile }) {
  const maxQuestions = 5;
  const submitTurn = useSubmitInterviewTurn();
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [role, setRole] = useState(profile.targetRole || '');
  const [interviewType, setInterviewType] = useState<InterviewTurnInput['interviewType']>('Mixed');
  const [jobDescription, setJobDescription] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('Warm-up');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<InterviewTurnInput['history']>([]);
  const [feedback, setFeedback] = useState<InterviewTurnResponse['feedback'] | null>(null);
  const [scores, setScores] = useState<InterviewTurnResponse['scores']>({ technical: 0, communication: 0, relevance: 0, problemSolving: 0, clarity: 0 });
  const [report, setReport] = useState<InterviewTurnResponse['report'] | null>(null);
  const [learningPlan, setLearningPlan] = useState<string[]>([]);
  const [error, setError] = useState('');
  const displayRole = role.trim() || 'Software Developer';
  const profileContext: InterviewTurnInput['profile'] = {
    fullName: profile.fullName,
    targetRole: displayRole,
    school: profile.school,
    degree: profile.degree,
    skills: profile.skills,
    projects: profile.projects,
    experience: profile.experience,
    certifications: profile.certifications,
    achievements: profile.achievements,
  };
  const startInterview = () => {
    setQuestion(interviewType === 'Technical'
      ? `Walk me through a technical project you’ve worked on that is relevant to ${displayRole}. What was the hardest part?`
      : interviewType === 'Behavioral'
        ? 'Tell me about a time you had to figure something out without having all the answers.'
        : `Tell me about a project or experience that makes you a strong fit for ${displayRole}.`);
    setQuestionType('Warm-up');
    setStarted(true);
    setComplete(false);
    setError('');
  };
  const endInterview = () => {
    setStarted(false);
    setComplete(false);
    setQuestion('');
    setAnswer('');
    setFeedback(null);
    setHistory([]);
    setQuestionNumber(1);
    setReport(null);
    setLearningPlan([]);
    setScores({ technical: 0, communication: 0, relevance: 0, problemSolving: 0, clarity: 0 });
  };
  const submit = async () => {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer || submitTurn.isPending) return;
    setError('');
    try {
      const response = await submitTurn.mutateAsync({
        data: {
          targetRole: displayRole,
          interviewType,
          questionNumber,
          maxQuestions,
          currentQuestion: question,
          answer: trimmedAnswer,
          jobDescription,
          profile: profileContext,
          history,
        },
      });
      setFeedback(response.feedback);
      setScores(response.scores);
      setHistory((items) => [...items, { question, answer: trimmedAnswer }].slice(-maxQuestions));
      setAnswer('');
      if (response.isComplete) {
        setComplete(true);
        setReport(response.report);
        setLearningPlan(response.learningPlan);
      } else {
        setQuestion(response.nextQuestion);
        setQuestionType(response.questionType || 'Follow-up');
        setQuestionNumber((number) => number + 1);
      }
    } catch (requestError) {
      const status = typeof requestError === 'object' && requestError !== null && 'status' in requestError ? (requestError as { status?: unknown }).status : undefined;
      setError(status === 503 ? 'Gemini is not connected yet. Add a GEMINI_API_KEY to the API server to enable live interview analysis.' : 'VibeCat could not analyze that answer. Please try again in a moment.');
    }
  };
  const catState = submitTurn.isPending ? 'thinking' : answer.trim() ? 'listening' : 'idle';

  if (!started) {
    return <div>
      <PageIntro eyebrow="ProSim · Professional Interview Simulator" title="Practice like it’s real. Keep sounding like you." description="VibeCat asks adaptive follow-ups, gives kind and specific feedback, and helps you turn your own words into stronger interview answers." />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="relative overflow-hidden rounded-3xl bg-[hsl(var(--secondary))] p-6 text-[hsl(var(--secondary-foreground))] shadow-[var(--shadow-soft)] sm:p-9">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[26px] border-[hsl(var(--accent)/.13)]" />
          <div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.1)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--accent))]"><Bot size={13} /> Meet VibeCat</span><h2 className="mt-7 max-w-lg font-display text-[clamp(2rem,5vw,3.8rem)] font-bold leading-[1.03] tracking-[-.06em]">Your practice room,<br /><span className="text-[hsl(var(--accent))]">minus the judgment.</span></h2><p className="mt-5 max-w-md text-sm leading-relaxed text-[hsl(var(--secondary-foreground)/.64)]">Casual answer? Hinglish? Brain buffering? VibeCat gets the intent first, then helps you level up without deleting your personality.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{[['01', 'Adaptive', 'Follow-ups use your last answer'], ['02', 'Specific', 'Feedback you can actually use'], ['03', 'Respectful', 'Your voice stays yours']].map(([n, t, d]) => <div key={n} className="border-l border-[hsl(var(--secondary-foreground)/.18)] pl-3"><span className="font-mono text-[10px] text-[hsl(var(--accent))]">{n}</span><p className="mt-2 text-xs font-bold">{t}</p><p className="mt-1 text-[10px] leading-relaxed text-[hsl(var(--secondary-foreground)/.5)]">{d}</p></div>)}</div></div>
        </section>
        <section className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] pb-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary)/.11)] text-[hsl(var(--primary))]"><SlidersHorizontal size={18} /></span><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Set your room</p><h2 className="font-display text-lg font-bold text-[hsl(var(--secondary))]">A little context first</h2></div></div>
          <label className="mt-5 block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--secondary))]">Target role</span><input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend developer intern" className="h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/.58)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.12)]" data-testid="input-prosim-role" /></label>
          <label className="mt-4 block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--secondary))]">Interview type</span><select value={interviewType} onChange={(e) => setInterviewType(e.target.value as InterviewTurnInput['interviewType'])} className="h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:outline-none" data-testid="select-prosim-type"><option>Mixed</option><option>Behavioral</option><option>Technical</option></select></label>
          <label className="mt-4 block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-[.1em] text-[hsl(var(--secondary))]">Job description <span className="font-normal text-[hsl(var(--muted-foreground))]">(optional)</span></span><textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} placeholder="Paste the role description so follow-ups feel relevant..." className="w-full resize-y rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm leading-relaxed text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/.58)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.12)]" data-testid="textarea-prosim-job-description" /></label>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-[hsl(var(--muted)/.65)] p-3 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]"><FileText size={14} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" /> {profile.projects || profile.experience ? 'Your CareerAI resume details will be used as interview context.' : 'Add your story in Build resume first for more personalized prompts.'}</div>
          <button onClick={startInterview} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3.5 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5" data-testid="button-start-interview"><Mic2 size={16} /> Start ProSim</button>
        </section>
      </div>
    </div>;
  }

  return <div>
    <PageIntro eyebrow="ProSim · Live practice room" title={complete ? 'You did the reps. Let’s use them.' : 'Stay in the moment. VibeCat has you.'} description={complete ? 'Here’s the honest, useful version of how your interview came across.' : 'Answer naturally. The next question will react to what you actually say.'}>
      <button onClick={endInterview} className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2.5 text-xs font-bold text-[hsl(var(--secondary))] transition-colors hover:border-[hsl(var(--accent)/.6)]" data-testid="button-end-interview-top"><ArrowLeft size={14} /> Exit room</button>
    </PageIntro>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <section className="prosim-room relative overflow-hidden rounded-3xl p-4 shadow-[var(--shadow-soft)] sm:p-7" data-testid="prosim-room">
          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] text-white/55"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" /> Live room</div>
          <div className="relative z-10 mx-auto max-w-[620px]">
            <CatAvatar state={complete ? 'idle' : question ? (submitTurn.isPending ? 'thinking' : 'speaking') : catState} />
            <div className="prosim-speech-bubble relative mx-auto -mt-2 max-w-xl rounded-2xl border border-white/10 bg-white/[.08] p-4 text-center text-sm leading-relaxed text-white/90 sm:p-5"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.18em] text-[hsl(var(--accent))]">AI interviewer · {questionType}</span>{complete ? 'Nice work. Let’s look at what you can take into your next answer.' : question}</div>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-semibold text-white/45"><Volume2 size={13} /> VibeCat is keeping the conversation adaptive</div>
          </div>
          <div className="prosim-desk absolute bottom-0 left-0 right-0 h-10" />
        </section>
        {!complete && <section className="mt-5 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Your answer</p><h2 className="mt-2 font-display text-xl font-bold tracking-[-.04em] text-[hsl(var(--secondary))]">Take your time. Real over perfect.</h2></div><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{answer.length}/12000</span></div><textarea value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void submit(); }} rows={7} placeholder="Type how you would actually answer… casual is okay." className="mt-5 min-h-[170px] w-full resize-y rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-4 text-sm leading-relaxed text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/.58)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.12)]" data-testid="textarea-prosim-answer" /><div className="mt-4 flex flex-col-reverse gap-3 border-t border-[hsl(var(--border))] pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[11px] text-[hsl(var(--muted-foreground))]">Tip: press <kbd className="rounded border border-[hsl(var(--border))] px-1.5 py-0.5 font-mono text-[10px]">⌘/Ctrl + Enter</kbd> to submit.</p><div className="flex gap-2"><button onClick={endInterview} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] px-4 py-3 text-xs font-bold text-[hsl(var(--secondary))] transition-colors hover:border-[hsl(var(--accent)/.55)]" data-testid="button-end-interview"><X size={15} /> End interview</button><button onClick={() => void submit()} disabled={!answer.trim() || submitTurn.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45" data-testid="button-submit-answer">{submitTurn.isPending ? <><LoaderCircle size={15} className="animate-spin" /> VibeCat is thinking</> : <><Send size={15} /> Submit answer</>}</button></div></div></section>}
        {feedback && <FeedbackCard feedback={feedback} />}
        {error && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-xs leading-relaxed text-[hsl(var(--destructive))]" role="alert" data-testid="status-prosim-error"><CircleAlert size={16} className="mt-0.5 shrink-0" /><span className="flex-1">{error}</span><button onClick={() => void submit()} disabled={!answer.trim() || submitTurn.isPending} className="shrink-0 rounded-lg border border-current/30 px-2 py-1 text-[10px] font-bold">Retry</button></div>}
        {complete && report && <><PerformanceReport report={report} learningPlan={learningPlan} /><button onClick={endInterview} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-practice-again"><RefreshCw size={15} /> Practice again</button></>}
      </div>
      <aside className="h-fit rounded-3xl bg-[hsl(var(--secondary))] p-5 text-[hsl(var(--secondary-foreground))] shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-[hsl(var(--secondary-foreground)/.14)] pb-5"><div><p className="font-mono text-[9px] uppercase tracking-[.17em] text-[hsl(var(--accent))]">Interview info</p><h2 className="mt-2 font-display text-lg font-bold">{displayRole}</h2></div><span className="rounded-xl bg-[hsl(var(--accent)/.14)] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[hsl(var(--accent))]">{interviewType}</span></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[hsl(var(--secondary-foreground)/.07)] p-3"><p className="font-mono text-[9px] uppercase tracking-[.12em] text-white/45">Question</p><p className="mt-1 font-display text-xl font-bold">{complete ? maxQuestions : questionNumber} <span className="font-mono text-xs font-normal text-white/45">/ {maxQuestions}</span></p></div><div className="rounded-2xl bg-[hsl(var(--secondary-foreground)/.07)] p-3"><p className="font-mono text-[9px] uppercase tracking-[.12em] text-white/45">Mode</p><p className="mt-1 text-sm font-bold">{complete ? 'Report' : 'Adaptive'}</p></div></div>
        <div className="mt-6"><div className="mb-4 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[hsl(var(--accent)/.15)] text-[hsl(var(--accent))]"><TrendingUp size={14} /></span><p className="font-mono text-[10px] uppercase tracking-[.15em] text-white/65">Current performance</p></div><div className="space-y-4"><ScoreBar label="Technical" value={scores.technical} /><ScoreBar label="Communication" value={scores.communication} tone="coral" /><ScoreBar label="Relevance" value={scores.relevance} tone="gold" /><ScoreBar label="Problem solving" value={scores.problemSolving} /><ScoreBar label="Clarity" value={scores.clarity} tone="coral" /></div></div>
        {history.length > 0 && <div className="mt-6 border-t border-[hsl(var(--secondary-foreground)/.14)] pt-5"><p className="font-mono text-[9px] uppercase tracking-[.15em] text-white/45">Topics VibeCat heard</p><div className="mt-3 flex flex-wrap gap-1.5">{(feedback ? history.flatMap((item) => item.answer.split(/\s+/).filter((word) => word.length > 5).slice(0, 3)) : []).slice(0, 6).map((topic, i) => <span key={`${topic}-${i}`} className="rounded-full bg-white/[.08] px-2 py-1 text-[10px] text-white/65">{topic.replace(/[,.!?]/g, '')}</span>)}</div></div>}
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-[hsl(var(--secondary-foreground)/.12)] p-3 text-[10px] leading-relaxed text-white/50"><CircleHelp size={14} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" /> This is practice, not a hiring prediction. Use the feedback as a next step, not a verdict.</div>
      </aside>
    </div>
  </div>;
}

function NotFound() { return <div className="mx-auto max-w-xl py-20 text-center"><p className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--primary))]">404</p><h1 className="mt-4 font-display text-4xl font-bold">This page took a wrong turn.</h1><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))]" data-testid="link-back-home"><ArrowLeft size={15} /> Back to workspace</Link></div>; }

function Router() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  return <Shell><Switch><Route path="/" component={Home} /><Route path="/build"><Build profile={profile} setProfile={setProfile} /></Route><Route path="/check" component={CheckResume} /><Route path="/edit" component={EditResume} /><Route path="/interview"><Interview profile={profile} /></Route><Route component={NotFound} /></Switch></Shell>;
}

function App() { return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>; }

export default App;
