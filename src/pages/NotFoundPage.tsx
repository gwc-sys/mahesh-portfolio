import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi2';
import { pageTransition } from '../animations/variants';
import { Container } from '../components/common/Container';

export function NotFoundPage() {
  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="grid min-h-screen place-items-center bg-white pt-20 dark:bg-secondary"
    >
      <Container className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary dark:text-cyan-300">404</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-950 dark:text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
          The page you are looking for does not exist, but the portfolio is one click away.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-blue-600"
        >
          <HiArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back Home
        </a>
      </Container>
    </motion.main>
  );
}

