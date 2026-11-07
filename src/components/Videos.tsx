import { useRef, useState } from 'react';
import { cssScrollFx } from '../lib/scroll';
import { Box } from '@mui/material';
import { motion, useScroll, useTransform } from 'motion/react';
import { Section, Container, Heading } from './ui/Section';
import Icon from './ui/Icon';
import { useVideoConfig } from '../hooks/useVideoConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { tokens, easeCss, eyebrow, gutter, maxWidth } from '../theme';

export default function Videos() {
  const { videoId } = useVideoConfig();
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // O vídeo cresce de 86% até o tamanho total conforme chega ao meio da tela
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);

  // maxres é 16:9 e nítido, mas nem todo vídeo tem. Quando não tem, o YouTube
  // responde 404 com o placeholder cinza 120x90 no corpo — a imagem "carrega"
  // normalmente e onError nunca dispara. Por isso a checagem é pelo tamanho real.
  const [thumb, setThumb] = useState({ id: videoId, hiRes: true });
  if (thumb.id !== videoId) setThumb({ id: videoId, hiRes: true });
  const setHiRes = (hiRes: boolean) => setThumb({ id: videoId, hiRes });
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/${thumb.hiRes ? 'maxresdefault' : 'sddefault'}.jpg`;

  return (
    <Section id="videos" sx={{ backgroundColor: tokens.inkDeep }}>
      <Container>
        <Heading label={t.videos.label} title={t.videos.heading} lead={t.videos.subtitle} align="center" />
      </Container>

      {/* Mais largo que o texto: no celular encosta nas bordas da tela */}
      {/* Largura limitada pela altura da tela no computador: título + vídeo cabem numa tela */}
      <Box
        sx={{
          maxWidth: { xs: maxWidth, md: `min(${maxWidth}px, calc((100svh - 500px) * 16 / 9 + 96px))` },
          minWidth: { md: 'min(100%, 720px)' },
          mx: 'auto',
          px: { xs: 0, sm: gutter.sm, md: gutter.md, lg: gutter.lg },
        }}
      >
        <motion.div
          ref={frameRef}
          className={cssScrollFx ? 'sd-video' : undefined}
          style={{ willChange: 'transform', ...(cssScrollFx ? {} : { scale }) }}
        >
          <Box
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
            sx={{
              position: 'relative',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              borderRadius: { xs: 0, sm: '24px' },
              backgroundColor: '#000',
              cursor: playing ? 'default' : 'pointer',
              '& .v-thumb': { transition: `transform 1.4s ${easeCss}` },
              '& .v-play': { transition: `transform .6s ${easeCss}` },
              '@media (hover: hover)': {
                '&:hover .v-thumb': { transform: 'scale(1.04)' },
                '&:hover .v-play': { transform: 'scale(1.1)' },
              },
            }}
          >
            {playing ? (
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Axioma Watches"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            ) : (
              <>
                <Box
                  component="img"
                  className="v-thumb"
                  src={thumbUrl}
                  loading="lazy"
                  onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    // 120px de largura = placeholder cinza do YouTube, não a capa real
                    if (e.currentTarget.naturalWidth <= 121) setHiRes(false);
                  }}
                  onError={() => setHiRes(false)}
                  alt=""
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${tokens.inkA(0.15)} 0%, ${tokens.inkA(0.45)} 100%)` }} />

                <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                  <Box
                    className="v-play"
                    sx={{
                      width: { xs: 72, md: 112 },
                      height: { xs: 72, md: 112 },
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      backdropFilter: 'blur(14px)',
                      border: '1px solid rgba(255,255,255,0.35)',
                      display: 'grid',
                      placeItems: 'center',
                      color: tokens.white,
                      pl: '4px',
                    }}
                  >
                    <Icon name="play" size={30} />
                  </Box>
                </Box>

                <Box
                  sx={{
                    ...eyebrow,
                    position: 'absolute',
                    left: { xs: 16, md: 28 },
                    bottom: { xs: 14, md: 24 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: tokens.white,
                    fontSize: { xs: '0.68rem', md: '0.78rem' },
                  }}
                >
                  <Icon name="youtube" size={18} />
                  @axiomawatches
                </Box>
              </>
            )}
          </Box>
        </motion.div>
      </Box>
    </Section>
  );
}
