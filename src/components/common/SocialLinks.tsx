import { motion } from 'framer-motion';
import type { SocialLink } from '../../types';
import { cn } from '../../utils/cn';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            aria-label={link.label}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-300"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.a>
        );
      })}
    </div>
  );
}

