import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ScrollProgress } from './components/common/ScrollProgress';
import { ScrollToTop } from './components/common/ScrollToTop';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Mahesh | Full Stack Developer';
    const timer = window.setTimeout(() => setIsLoading(false), 850);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <ScrollToTop />
    </>
  );
}

