import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useVideoConfig } from '../hooks/useVideoConfig';
import { useLanguage } from '../contexts/LanguageContext';

export default function Videos() {
  const { ref, visible } = useScrollReveal();
  const { videoId } = useVideoConfig();
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);

  return (
    <Box
      id="videos"
      sx={{
        py: { xs: 8, md: 10 },
        px: { xs: 2, md: 4 },
        backgroundColor: '#0D0E11',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        scrollMarginTop: { xs: 72, md: 96 },
      }}
    >
      <Box ref={ref} sx={{ maxWidth: 1200, mx: 'auto', ...revealSx(visible) }}>
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Typography
            sx={{
              ...revealSx(visible, 0),
              color: 'primary.main',
              fontSize: '0.78rem',
              letterSpacing: '0.35em',
              mb: 2,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {t.videos.label}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              ...revealSx(visible, 100),
              fontSize: { xs: '2rem', md: '2.6rem' },
              color: '#EBEBEB',
              lineHeight: 1.2,
            }}
          >
            {t.videos.heading}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              ...revealSx(visible, 200),
              color: 'text.secondary',
              mt: 2,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            {t.videos.subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.15)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            cursor: playing ? 'default' : 'pointer',
            backgroundColor: '#111',
          }}
          onClick={() => !playing && setPlaying(true)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (!playing && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setPlaying(true);
            }
          }}
          role={playing ? undefined : 'button'}
          tabIndex={playing ? undefined : 0}
          aria-label={playing ? undefined : t.videos.heading}
        >
          {playing ? (
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Axioma Watches"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <>
              <Box
                component="img"
                src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                alt="Axioma Watches"
                sx={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.75)',
                  transition: 'filter 0.3s',
                  '&:hover': { filter: 'brightness(0.6)' },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 64, md: 80 },
                    height: { xs: 64, md: 80 },
                    borderRadius: '50%',
                    backgroundColor: 'rgba(201,168,76,0.92)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
                    transition: 'transform 0.2s, background-color 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(201,168,76,1)',
                    },
                  }}
                >
                  <PlayArrowIcon sx={{ color: '#0D0E11', fontSize: { xs: '2.2rem', md: '2.8rem' } }} />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
