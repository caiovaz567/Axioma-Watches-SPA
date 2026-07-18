import { Box, Typography } from '@mui/material';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import aboutImg from '../assets/about.jpg';

export default function About() {
  const { ref, visible } = useScrollReveal();
  const { t } = useLanguage();
  const { pillars } = t.about;

  return (
    <Box id="about" sx={{ backgroundColor: '#0D0E11', overflow: 'hidden' }}>
      <Box
        ref={ref}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          minHeight: { lg: '80vh' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 300, md: 420, lg: 'auto' },
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={aboutImg}
            loading="lazy"
            alt={t.about.imgAlt}
            sx={{
              ...revealSx(visible, 0),
              position: { xs: 'relative', lg: 'absolute' },
              width: '100%',
              height: { xs: 300, md: 420, lg: '100%' },
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: 'brightness(0.65) saturate(0.9)',
            }}
          />
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '40%',
              background: 'linear-gradient(to right, transparent, #0D0E11)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: { xs: '50%', lg: '30%' },
              background: 'linear-gradient(to top, #0D0E11, transparent)',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 4, sm: 6, md: 8, lg: 10 },
            py: { xs: 8, lg: 12 },
          }}
        >
          <Typography
            sx={{
              ...revealSx(visible, 120),
              color: 'primary.main',
              fontSize: '0.78rem',
              letterSpacing: '0.35em',
              mb: 3,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {t.about.label}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              ...revealSx(visible, 220),
              fontSize: { xs: '2rem', md: '2.6rem' },
              lineHeight: 1.2,
              mb: 3,
              color: '#EBEBEB',
            }}
          >
            {t.about.headingLine1}<br />
            <Box component="span" sx={{ color: 'primary.main' }}>{t.about.headingHighlighted}</Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              ...revealSx(visible, 340),
              color: 'text.secondary',
              lineHeight: 1.9,
              mb: 6,
              maxWidth: 440,
              fontSize: '0.97rem',
            }}
          >
            {t.about.body.split('Claudio Vaz').map((part, i) =>
              i === 0 ? part : (
                <span key={i}>
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>Claudio Vaz</Box>
                  {part}
                </span>
              )
            )}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pillars.map((p, i) => (
              <Box key={p.title} sx={{ ...revealSx(visible, 460 + i * 120), display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontSize: '0.78rem',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    opacity: 0.5,
                    mt: 0.4,
                    minWidth: 24,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box sx={{ borderLeft: '1px solid rgba(201,168,76,0.2)', pl: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#EBEBEB',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      mb: 0.8,
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {p.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.87rem' }}
                  >
                    {p.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
