import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import impalaImg from '../assets/banner-empresa-1170x305.jpg';
import terranovaImg from '../assets/d86c3fa9-b022-4d13-91d7-b2246a746426_logo-azul-jpg.jpg';
import roueImg from '../assets/roue_logo.svg';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

interface Partnership {
  name: string;
  description: string;
  descriptionEn?: string;
  videoUrl: string;
  videoId: string;
  websiteUrl: string;
  coupon: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  imageBg?: string;
}

const PARTNERSHIPS: Partnership[] = [
  {
    name: 'Relojoaria Impala',
    description: 'Review completo do relógio SPINNAKER modelo SP-5068-03 HULL — Uma marca Inglesa que produz modelos inspirados em elementos marinhos e náuticos.',
    videoUrl: 'https://youtu.be/Zhbrgj9DH_4',
    videoId: 'Zhbrgj9DH_4',
    websiteUrl: 'https://www.relojoariaimpala.com.br/',
    coupon: 'axioma',
    imageUrl: impalaImg,
    imageFit: 'contain',
    imageBg: '#000',
  },
  {
    name: 'Terranova Watches',
    description: 'Conteúdo especial em parceria com a Terranova Watches — Uma Micro Brand que despontou no cenário nacional em 2024 e vem conquistando o coração dos amantes da boa relojoaria.',
    videoUrl: 'https://youtu.be/BWQ7Jckc_ok',
    videoId: 'BWQ7Jckc_ok',
    websiteUrl: 'https://terranovawatches.com/',
    coupon: 'axioma',
    imageUrl: terranovaImg,
    imageFit: 'contain',
    imageBg: '#fff',
  },
  {
    name: 'Roue Watch',
    description: 'Parceria com a Roue Watch — marca brasileira de relógios que une design contemporâneo e qualidade artesanal, conquistando cada vez mais entusiastas da relojoaria nacional.',
    videoUrl: 'https://youtu.be/RJU5YsRYHcQ',
    videoId: 'RJU5YsRYHcQ',
    websiteUrl: 'https://rouewatch.com.br/',
    coupon: 'axioma',
    imageUrl: roueImg,
    imageFit: 'contain',
    imageBg: '#111',
  },
];

function PartnershipCard({ p }: { p: Partnership }) {
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t, lang } = useLanguage();
  const description = lang === 'en' && p.descriptionEn ? p.descriptionEn : p.description;
  const thumbnail = p.imageUrl ?? (p.videoId ? `https://img.youtube.com/vi/${p.videoId}/maxresdefault.jpg` : '');

  const handleCopy = () => {
    if (!p.coupon) return;
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = p.coupon;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(p.coupon).catch(fallback);
    } else {
      fallback();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Video area */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16/9',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: p.imageBg ?? '#000',
          flexShrink: 0,
        }}
      >
        {playing ? (
          <>
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${p.videoId}?autoplay=1&rel=0`}
              title={p.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
            <Box
              onClick={() => setPlaying(false)}
              role="button"
              aria-label="Fechar vídeo"
              sx={{
                position: 'absolute', top: 8, right: 8,
                width: 32, height: 32, borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 2,
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' },
              }}
            >
              <CloseIcon sx={{ fontSize: '1rem', color: '#fff' }} />
            </Box>
          </>
        ) : (
          <>
            {thumbnail && (
              <Box
                component="img"
                src={thumbnail}
                alt={p.name}
                sx={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: p.imageFit ?? 'cover',
                  objectPosition: 'center',
                  backgroundColor: p.imageBg ?? 'transparent',
                  ...(p.imageFit === 'contain' && { padding: '20px' }),
                  transition: 'transform 0.45s ease, filter 0.45s ease',
                  transformOrigin: 'center',
                  '.partnership-card:hover &': { transform: 'scale(1.04)', filter: 'brightness(0.75)' },
                }}
              />
            )}
            <Box
              className="partnership-card"
              onClick={() => setPlaying(true)}
              role="button"
              aria-label={`Reproduzir vídeo ${p.name}`}
              sx={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                '&:hover .play-btn': { transform: 'scale(1.1)' },
              }}
            >
              <Box
                className="play-btn"
                sx={{
                  width: 56, height: 56, borderRadius: '50%',
                  backgroundColor: 'rgba(201,168,76,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s',
                }}
              >
                <PlayArrowIcon sx={{ color: '#0D0E11', fontSize: '1.9rem' }} />
              </Box>
            </Box>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.8), transparent)' }} />
          </>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', flex: 1, px: 0.5 }}>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: '#EBEBEB',
            mb: 1,
          }}
        >
          {p.name}
        </Typography>

        <Box sx={{ flex: 1, minHeight: '4.5rem' }}>
          {description && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', lineHeight: 1.75, fontSize: '0.875rem', mb: 2.5 }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {p.coupon && (
          <Tooltip
            title={copied ? t.partnerships.tooltipCopied : t.partnerships.tooltipCopy}
            placement="top"
          >
            <Box
              onClick={handleCopy}
              role="button"
              aria-label={`Copiar cupom ${p.coupon}`}
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 1.75, py: 1,
                borderRadius: '6px', mb: 2.5, alignSelf: 'flex-start',
                border: '1px solid',
                borderColor: copied ? 'success.main' : 'rgba(201,168,76,0.4)',
                backgroundColor: copied ? 'rgba(76,175,80,0.08)' : 'rgba(201,168,76,0.04)',
                cursor: 'pointer', userSelect: 'none',
                transition: 'border-color 0.2s, background-color 0.2s, transform 0.1s',
                minHeight: 40,
                '&:hover': {
                  borderColor: copied ? 'success.main' : 'primary.main',
                  backgroundColor: copied ? 'rgba(76,175,80,0.12)' : 'rgba(201,168,76,0.08)',
                },
                '&:active': { transform: 'scale(0.97)' },
              }}
            >
              {copied ? (
                <>
                  <CheckIcon sx={{ fontSize: '0.85rem', color: 'success.main' }} />
                  <Typography sx={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'success.main', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                    {t.partnerships.copied}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'text.secondary', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                    {t.partnerships.couponLabel}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', letterSpacing: '0.2em', color: 'primary.main', fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                    {p.coupon.toUpperCase()}
                  </Typography>
                  <ContentCopyIcon sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }} />
                </>
              )}
            </Box>
          </Tooltip>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <Box
            component="a" href={p.videoUrl} target="_blank" rel="noopener noreferrer"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              color: 'primary.main', textDecoration: 'none',
              fontSize: '0.7rem', letterSpacing: '0.15em',
              fontFamily: '"Inter", sans-serif', fontWeight: 500,
              borderBottom: '1px solid rgba(201,168,76,0.3)', pb: 0.5,
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: '0.9rem' }} />
            {t.partnerships.watchVideo}
          </Box>
          <Box
            component="a" href={p.websiteUrl} target="_blank" rel="noopener noreferrer"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              color: 'text.secondary', textDecoration: 'none',
              fontSize: '0.7rem', letterSpacing: '0.15em',
              fontFamily: '"Inter", sans-serif', fontWeight: 500,
              borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 0.5,
              transition: 'color 0.2s, border-color 0.2s',
              '&:hover': { color: '#EBEBEB', borderColor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <OpenInNewIcon sx={{ fontSize: '0.85rem' }} />
            {t.partnerships.visitSite}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const arrowSx = (enabled: boolean) => ({
  flexShrink: 0,
  display: { xs: 'none', md: 'flex' },
  color: enabled ? 'primary.main' : 'rgba(255,255,255,0.15)',
  border: '1px solid',
  borderColor: enabled ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)',
  borderRadius: '50%',
  width: 44,
  height: 44,
  transition: 'all 0.2s',
  '&:hover:not(:disabled)': {
    borderColor: 'primary.main',
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
});

export default function Partnerships() {
  const { ref, visible } = useScrollReveal();
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(updateScrollState);
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth : el.clientWidth, behavior: 'smooth' });
  };

  return (
    <Box
      id="parcerias"
      sx={{
        backgroundColor: '#0D0E11',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        py: { xs: 10, md: 14 },
      }}
    >
      <Box ref={ref} sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 4, sm: 6, md: 6 } }}>

        <Box sx={{ mb: { xs: 8, md: 10 }, textAlign: 'center' }}>
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
            {t.partnerships.label}
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
            {t.partnerships.headingPart1}{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>{t.partnerships.headingPart2}</Box>
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
            {t.partnerships.subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            ...revealSx(visible, 300),
            display: 'flex',
            alignItems: 'center',
            gap: { md: 2 },
          }}
        >
          <IconButton onClick={() => scroll('left')} disabled={!canScrollLeft} sx={arrowSx(canScrollLeft)}>
            <ChevronLeftIcon />
          </IconButton>

          <Box sx={{ overflow: 'hidden', flex: 1, mx: { xs: -4, sm: -6, md: 0 } }}>
            <Box
              ref={trackRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                px: { xs: 4, sm: 6, md: 0 },
                scrollPaddingLeft: { xs: '32px', sm: '48px', md: '0px' },
              }}
            >
              {PARTNERSHIPS.map((p, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '85%', sm: '50%', md: '50%' },
                    scrollSnapAlign: 'start',
                    px: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <PartnershipCard p={p} />
                </Box>
              ))}
            </Box>
          </Box>

          <IconButton onClick={() => scroll('right')} disabled={!canScrollRight} sx={arrowSx(canScrollRight)}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

      </Box>
    </Box>
  );
}
