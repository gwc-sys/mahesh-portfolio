import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { navItems } from '../../data/navigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import type { SectionId } from '../../types';
import { cn } from '../../utils/cn';
import { Container } from '../common/Container';
import { ThemeToggle } from '../common/ThemeToggle';

const sectionIds = navItems.map((item) => item.id);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useScrollSpy(sectionIds as SectionId[]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinkClass = useMemo(
    () => (id: SectionId) =>
      cn(
        'relative rounded-full px-3 py-2 text-sm font-semibold transition',
        activeSection === id
          ? 'text-primary dark:text-cyan-300'
          : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white',
      ),
    [activeSection],
  );

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'border-b border-slate-200/70 bg-white/82 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-secondary/82' : 'bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#home" className="group inline-flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
            M
          </span>
          <span className="text-slate-950 transition group-hover:text-primary dark:text-white dark:group-hover:text-cyan-300">
            Mahesh
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} className={navLinkClass(item.id)}>
              {item.label}
              {activeSection === item.id ? (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary dark:bg-cyan-300"
                />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-300 lg:hidden"
          >
            {isOpen ? <FaXmark className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-secondary/95 lg:hidden"
          >
            <Container className="grid gap-2 py-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-3 text-sm font-semibold transition',
                    activeSection === item.id
                      ? 'bg-blue-50 text-primary dark:bg-cyan-300/10 dark:text-cyan-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

