import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/common/LoadingScreen';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const location = useLocation();
  const [isBooting, setIsBooting] = useState(true);
  const finishBoot = useCallback(() => setIsBooting(false), []);

  useEffect(() => {
    document.title = 'Mahesh Raskar | Full-Stack Developer';
  }, [location.pathname]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        target?.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo({ top: 0 });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <>
      <LoadingScreen isLoading={isBooting} onComplete={finishBoot} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

