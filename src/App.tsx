import { Suspense, lazy, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import theme from './theme';
import { LanguageProvider } from './contexts/LanguageContext';
import { initSmoothScroll } from './lib/scroll';
import Header from './components/Header';
import Hero from './components/Hero';

const Promo = lazy(() => import('./components/Promo'));
const About = lazy(() => import('./components/About'));
const Videos = lazy(() => import('./components/Videos'));
const Partnerships = lazy(() => import('./components/Partnerships'));
const Recommendations = lazy(() => import('./components/Recommendations'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const BackToTop = lazy(() => import('./components/BackToTop'));

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <ThemeProvider theme={theme}>
      {/* "user": respeita o "reduzir movimento" do sistema em todas as animações */}
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <CssBaseline />
          <Box sx={{ overflowX: 'clip' }}>
            <Header />
            <main>
              <Hero />
              <Suspense fallback={null}>
                <Promo />
                <About />
                <Videos />
                <Partnerships />
                <Recommendations />
                <Contact />
              </Suspense>
            </main>
            <Suspense fallback={null}>
              <Footer />
              <BackToTop />
            </Suspense>
          </Box>
          <Analytics />
          <SpeedInsights />
        </LanguageProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
