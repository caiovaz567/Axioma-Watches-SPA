import { useState } from 'react';
import { Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SectionHeading from './SectionHeading';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useVideoConfig } from '../hooks/useVideoConfig';
import { useLanguage } from '../contexts/LanguageContext';

export default function Videos() {
  const { ref, visible } = useScrollReveal();
  const { videoId } = useVideoConfig();
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  // maxres é 16:9 e nítido, mas nem todo vídeo tem. Quando não tem, o YouTube
  // responde 404 com o placeholder cinza 120x90 no corpo — a imagem "carrega"
  // normalmente e onError nunca dispara. Por isso a checagem é pelo tamanho real.
  const [thumb, setThumb] = useState({ id: videoId, hiRes: true });
  // Troca de vídeo reinicia a tentativa em alta resolução
  if (thumb.id !== videoId) setThumb({ id: videoId, hiRes: true });
  const setHiRes = (hiRes: boolean) => setThumb({ id: videoId, hiRes });
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/${thumb.hiRes ? 'maxresdefault' : 'sddefault'}.jpg`;

  return (
    <Box
      id="videos"
      sx={{
        py: { xs: 10, md: 14 },
        px: { xs: 4, sm: 6, md: 6 },
        backgroundColor: '#0D0E11',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        scrollMarginTop: { xs: 72, md: 96 },
      }}
    >
      <Box ref={ref} sx={{ maxWidth: 1200, mx: 'auto', ...revealSx(visible) }}>
        <SectionHeading
          label={t.videos.label}
          heading={t.videos.heading}
          subtitle={t.videos.subtitle}
          visible={visible}
          sx={{ mb: { xs: 8, md: 10 } }}
        />
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
            // O overlay do play cobre a thumbnail inteira, então quem comanda os
            // dois efeitos de hover é o container — senão a imagem nunca é hovered.
            '@media (hover: hover)': {
              '&:hover .video-thumb': { filter: 'brightness(0.55)' },
              '&:hover .video-play': { transform: 'scale(1.1)', backgroundColor: 'rgba(201,168,76,1)' },
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: 3,
            },
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
                className="video-thumb"
                src={thumbUrl}
                onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  // 120px de largura = placeholder cinza do YouTube, não a capa real
                  if (e.currentTarget.naturalWidth <= 121) setHiRes(false);
                }}
                onError={() => setHiRes(false)}
                alt="Axioma Watches"
                sx={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.75)',
                  transition: 'filter 0.3s',
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
                  className="video-play"
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
