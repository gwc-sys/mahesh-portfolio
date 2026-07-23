import { AnimatePresence, motion } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-white dark:bg-secondary"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-accent"
            />
            <div className="text-center">
              <p className="font-display text-xl font-extrabold text-slate-950 dark:text-white">Mahesh</p>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Preparing portfolio</p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

