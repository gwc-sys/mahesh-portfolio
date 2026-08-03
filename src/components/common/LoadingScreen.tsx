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
          className="fixed inset-0 z-[100] grid place-items-center bg-[#030605]"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="text-center">
              <p className="font-mono text-sm text-emerald-400"><span className="text-slate-600">$</span> initializing portfolio...</p>
              <motion.div initial={{ width: 0 }} animate={{ width: 240 }} transition={{ duration: 0.75 }} className="mt-4 h-1 bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              <p className="mt-3 text-xs text-slate-500">loading modules <span className="animate-pulse">_</span></p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

