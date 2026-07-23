import { motion } from 'framer-motion';
import { slideUp } from '../../animations/variants';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ id, eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={cn('mb-12 max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}
    >
      <span className="text-sm font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</span>
      <h2 id={id} className="mt-3 font-display text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{description}</p>
      ) : null}
    </motion.div>
  );
}
