import { HiArrowUp } from 'react-icons/hi2';
import { navItems } from '../../data/navigation';
import { personalInfo, socialLinks } from '../../data/personal';
import { scrollToTop } from '../../utils/scroll';
import { Container } from '../common/Container';
import { SocialLinks } from '../common/SocialLinks';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-white/10 dark:bg-secondary">
      <Container className="grid gap-8 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
        <div>
          <a href="#home" className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">
            {personalInfo.name}
          </a>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            AI, data, and full-stack engineering portfolio built with React, TypeScript, Tailwind CSS, Framer Motion,
            and EmailJS.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-primary dark:text-slate-300 dark:hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:justify-end">
          <SocialLinks links={socialLinks} />
          <button
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-primary dark:bg-white dark:text-secondary dark:hover:bg-cyan-300"
          >
            <HiArrowUp className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </Container>

      <Container className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <p>Copyright {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
      </Container>
    </footer>
  );
}

