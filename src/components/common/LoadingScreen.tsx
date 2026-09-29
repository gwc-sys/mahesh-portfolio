import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface LoadingScreenProps { isLoading: boolean; onComplete: () => void; }

const steps = [
  'INCOMING HTTP REQUEST DETECTED ...',
  'PORTFOLIO SERVICE WAKING UP ...',
  'ALLOCATING CREATIVE RESOURCES ...',
  'SERVICE READY — ALL SYSTEMS ACTIVE',
];

const asciiLogo = String.raw` __  __    _    _   _ _____ ____  _   _
|  \/  |  / \  | | | | ____/ ___|| | | |
| |\/| | / _ \ | |_| |  _| \___ \| |_| |
| |  | |/ ___ \|  _  | |___ ___) |  _  |
|_|  |_/_/   \_\_| |_|_____|____/|_| |_|`;

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [visibleSteps, setVisibleSteps] = useState(1);
  const startTime = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!isLoading) return;
    const timers = [
      window.setTimeout(() => setVisibleSteps(2), 700),
      window.setTimeout(() => setVisibleSteps(3), 1450),
      window.setTimeout(() => setVisibleSteps(4), 2450),
      window.setTimeout(onComplete, 3350),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [isLoading, onComplete]);

  const timestamp = (offset: number) =>
    new Date(startTime + offset).toLocaleTimeString('en-GB', { hour12: false });

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.section role="status" aria-live="polite" aria-label="Starting Mahesh's portfolio"
          initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.01, transition: { duration: 0.55, ease: 'easeInOut' } }}
          className="boot-screen">
          <div className="boot-grid" aria-hidden="true" />
          <header className="boot-brand">
            <span className="boot-mark" aria-hidden="true"><i /><i /></span>
            <span>Mahesh<span className="boot-brand-dot">.</span></span>
          </header>

          <div className="boot-console">
            <div className="boot-log">
              {steps.slice(0, Math.min(visibleSteps, 2)).map((step, index) => (
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <time>{timestamp(index * 700)}</time>{step}
                </motion.p>
              ))}
            </div>
            <motion.div className="ascii-frame" initial={{ opacity: 0 }}
              animate={{ opacity: visibleSteps >= 2 ? 1 : 0 }} transition={{ duration: 0.3 }} aria-label="Mahesh">
              <pre>{asciiLogo}</pre><span>FULL-STACK DEVELOPER</span>
            </motion.div>
            <div className="boot-log boot-log-bottom">
              {steps.slice(2, visibleSteps).map((step, index) => (
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <time>{timestamp(1400 + index * 900)}</time>
                  <strong className={index === 1 ? 'ready' : ''}>{step}</strong>
                  {index === 0 && <span className="boot-cursor" aria-hidden="true" />}
                </motion.p>
              ))}
            </div>
          </div>

          <button className="boot-enter" type="button" onClick={onComplete}>
            ENTER PORTFOLIO <span aria-hidden="true">→</span>
          </button>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
