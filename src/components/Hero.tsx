import { Box, Typography, Button } from '@mui/material';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

const scrollToSection = (id: string) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  const { ref, visible } = useScrollReveal({ threshold: 0 });
  const { t } = useLanguage();

  return (
    <Box
      id="hero"
      sx={{
        backgroundColor: '#0D0E11',
        overflow: 'hidden',
        position: 'relative',
        minHeight: { xs: '86svh', md: '80svh' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src="/hero-bg.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        className="hero-bg-img"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '70% center',
          filter: 'brightness(0.34) saturate(0.75)',
          transformOrigin: 'center',
          animation: 'kenBurns 26s ease-in-out infinite alternate',
        }}
      />

      {/* Escurecimento pesado à esquerda para ancorar o texto */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(100deg, rgba(13,14,17,0.94) 0%, rgba(13,14,17,0.72) 40%, rgba(13,14,17,0.2) 78%, rgba(13,14,17,0.05) 100%), linear-gradient(to bottom, rgba(13,14,17,0.5) 0%, transparent 25%, transparent 70%, #0D0E11 100%)',
        }}
      />

      {/* Texto vertical decorativo na lateral direita */}
      <Typography
        aria-hidden
        sx={{
          position: 'absolute',
          right: { md: 28, lg: 40 },
          top: '50%',
          display: { xs: 'none', md: 'block' },
          transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl',
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.62rem',
          letterSpacing: '0.5em',
          color: 'rgba(201,168,76,0.4)',
          userSelect: 'none',
          zIndex: 2,
        }}
      >
        AXIOMA WATCHES
      </Typography>

      <Box
        ref={ref}
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 4, sm: 6, md: 10 },
          pt: { xs: '96px', md: '110px' },
          pb: { xs: '72px', md: '88px' },
        }}
      >
        {/* Kicker */}
        <Typography
          sx={{
            ...revealSx(visible, 0),
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            color: 'primary.main',
            fontWeight: 600,
            mb: { xs: 4, md: 5 },
          }}
        >
          {t.hero.kicker.toUpperCase()}
        </Typography>

        {/* Lockup empilhado à esquerda */}
        <Typography
          variant="h1"
          sx={{
            ...revealSx(visible, 100),
            fontFamily: '"Playfair Display", "Georgia", serif',
            fontWeight: 700,
            fontSize: { xs: '4.2rem', sm: '6.5rem', md: '8.5rem', lg: '9.5rem' },
            lineHeight: 0.92,
            color: '#F4F2ED',
            textShadow: '0 4px 60px rgba(0,0,0,0.6)',
          }}
        >
          AXIOMA
        </Typography>
        <Typography
          component="p"
          sx={{
            ...revealSx(visible, 200),
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.7rem' },
            letterSpacing: { xs: '0.5em', md: '0.66em' },
            color: 'primary.main',
            mt: { xs: 1.5, md: 2 },
            mb: { xs: 4, md: 5 },
          }}
        >
          WATCHES
        </Typography>

        <Typography
          sx={{
            ...revealSx(visible, 300),
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: '0.92rem', md: '1rem' },
            color: 'text.secondary',
            lineHeight: 1.9,
            maxWidth: 520,
            mb: 1.5,
          }}
        >
          {t.hero.description}
        </Typography>

        <Typography
          sx={{
            ...revealSx(visible, 380),
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'italic',
            fontSize: { xs: '0.85rem', md: '0.9rem' },
            color: 'primary.light',
            lineHeight: 1.8,
            opacity: 0.75,
            mb: { xs: 5, md: 6 },
            maxWidth: 520,
          }}
        >
          {t.hero.tagline}
        </Typography>

        <Box sx={{ ...revealSx(visible, 460), display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            href="https://www.youtube.com/@axiomawatches"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontSize: '0.72rem', letterSpacing: '0.15em', px: 4, py: 1.5 }}
          >
            {t.hero.ctaPrimary}
          </Button>
          <Button
            variant="outlined"
            onClick={() => scrollToSection('#recomendacoes')}
            sx={{ fontSize: '0.72rem', letterSpacing: '0.15em', px: 4, py: 1.5 }}
          >
            {t.hero.ctaSecondary}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
