import { Box, Typography } from '@mui/material';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { ref, visible } = useScrollReveal({ threshold: 0 });
  const { t } = useLanguage();

  return (
    <Box
      id="hero"
      sx={{
        backgroundColor: '#0D0E11',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: { xs: 560, sm: 580, md: 580 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src="/hero-bg.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(0.28) saturate(0.7)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(13,14,17,0.4) 0%, rgba(13,14,17,0.5) 60%, #0D0E11 100%)',
        }}
      />

      <Box
        ref={ref}
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: { xs: 4, sm: 6, md: 8 },
          py: { xs: 10, md: 0 },
          maxWidth: 680,
          width: '100%',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            ...revealSx(visible, 0),
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            lineHeight: 0.95,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: '#EBEBEB',
            mb: 0.2,
          }}
        >
          AXIOMA
        </Typography>

        <Typography
          variant="h1"
          sx={{
            ...revealSx(visible, 80),
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            lineHeight: 0.95,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'primary.main',
            mb: 3.5,
          }}
        >
          WATCHES
        </Typography>

        <Box sx={{ ...revealSx(visible, 180), width: 36, height: '1px', backgroundColor: 'primary.main', opacity: visible ? 0.4 : 0, mb: 3.5 }} />

        <Typography
          sx={{
            ...revealSx(visible, 280),
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            color: 'text.secondary',
            lineHeight: 1.8,
            mb: 1,
          }}
        >
          {t.hero.description}
        </Typography>

        <Box sx={revealSx(visible, 380)}>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontStyle: 'italic',
              fontSize: { xs: '0.88rem', md: '0.9rem' },
              color: 'primary.light',
              lineHeight: 1.8,
              mb: { xs: 6, md: 0 },
              opacity: 0.75,
            }}
          >
            {t.hero.tagline}
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}
