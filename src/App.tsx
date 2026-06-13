import { Suspense, lazy } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import theme from './theme';
import { LanguageProvider } from './contexts/LanguageContext';
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
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
      <CssBaseline />
      <Box sx={{ overflowX: 'hidden' }}>
        <Header />
        <Box sx={{ pt: { xs: '56px', sm: '64px' } }} />
        <Hero />
        <Suspense fallback={null}>
          <Promo />
          <About />
          <Videos />
          <Partnerships />
          <Recommendations />
          <Contact />
          <Footer />
          <BackToTop />
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </Box>
      </LanguageProvider>
    </ThemeProvider>
  );
}
