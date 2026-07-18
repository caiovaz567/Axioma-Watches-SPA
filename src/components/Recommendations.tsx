import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Chip, Typography, Skeleton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Carousel from './Carousel';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecommendations } from '../hooks/useRecommendations';
import type { Watch } from '../hooks/useRecommendations';
import { useOgImage } from '../hooks/useOgImage';

function GalleryItem({ w }: { w: Watch }) {
  const imageUrl = useOgImage(w.storeUrl, w.imageUrl);
  const { t, lang } = useLanguage();
  const description = lang === 'en' && w.descriptionEn ? w.descriptionEn : w.description;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!w.coupon) return;
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = w.coupon!;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(w.coupon).catch(fallback);
    } else {
      fallback();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {copied && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 32 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: 'rgba(13,14,17,0.96)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '8px',
            px: 3,
            pt: 1.5,
            pb: 1.25,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 1 }}>
            <CheckIcon sx={{ fontSize: '0.8rem', color: 'success.main' }} />
            <Typography sx={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'primary.main', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
              {t.recommendations.copied}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              backgroundColor: 'primary.main',
              '@keyframes countdownBar': {
                from: { width: '100%' },
                to: { width: '0%' },
              },
              animation: 'countdownBar 2.5s linear forwards',
            }}
          />
        </Box>
      )}

      <Box
        component={w.storeUrl ? 'a' : 'div'}
        href={w.storeUrl || undefined}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'block',
          position: 'relative',
          aspectRatio: '1/1',
          textDecoration: 'none',
          clipPath: 'inset(0 round 8px)',
          willChange: 'transform',
          '@media (hover: hover)': {
            '&:hover .watch-img': {
              transform: 'scale(1.05)',
              filter: 'brightness(0.80)',
            },
          },
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            className="watch-img"
            src={imageUrl}
            alt={w.model}
            loading="lazy"
            decoding="async"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              backgroundColor: '#f5f4f2',
              transition: 'transform 0.45s ease, filter 0.45s ease',
              transformOrigin: 'center',
            }}
          />
        ) : (
          <Box
            className="watch-img"
            sx={{
              position: 'absolute',
              inset: 0,
              background: w.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.45s ease, filter 0.45s ease',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '3.5rem',
                color: 'rgba(201,168,76,0.15)',
                fontWeight: 700,
                userSelect: 'none',
              }}
            >
              ◷
            </Typography>
          </Box>
        )}

        {w.coupon && (
          <Tooltip
            title={copied ? t.recommendations.tooltipCopied : t.recommendations.tooltipCopy}
            placement="top"
          >
            <Box
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopy(); }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Copiar cupom ${w.coupon}`}
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.6,
                borderRadius: '4px',
                backgroundColor: 'rgba(0,0,0,0.72)',
                border: '1px solid rgba(201,168,76,0.5)',
                backdropFilter: 'blur(6px)',
                zIndex: 2,
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'rgba(201,168,76,0.9)' },
              }}
            >
              <Typography sx={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                {t.recommendations.couponLabel}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: copied ? 'success.main' : 'primary.main', fontFamily: '"Inter", sans-serif', fontWeight: 700, transition: 'color 0.2s' }}>
                {w.coupon.toUpperCase()}
              </Typography>
              {copied
                ? <CheckIcon sx={{ fontSize: '0.65rem', color: 'success.main' }} />
                : <ContentCopyIcon sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }} />
              }
            </Box>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ mt: 2, px: 0.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            color: 'primary.main',
            fontWeight: 600,
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {w.brand.toUpperCase()}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#EBEBEB',
            lineHeight: 1.3,
            mb: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {w.model}
        </Typography>
        {/* Altura rígida (4 linhas, sem flex) para o botão nunca mudar de posição */}
        <Box sx={{ height: '6rem', overflow: 'hidden' }}>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.88rem',
                lineHeight: 1.7,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        <Box
          component="a"
          href={w.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.75,
            mt: 1.5,
            color: 'primary.main',
            textDecoration: 'none',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '6px',
            py: 1.5,
            minHeight: 48,
            backgroundColor: 'rgba(201,168,76,0.04)',
            transition: 'border-color 0.2s, background-color 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(201,168,76,0.1)',
            },
          }}
        >
          {t.recommendations.visitStore}
          <OpenInNewIcon sx={{ fontSize: '0.8rem' }} />
        </Box>
      </Box>
    </Box>
  );
}

function GalleryItemSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        sx={{
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
          aspectRatio: '1/1',
          width: '100%',
          height: 'auto',
        }}
      />
      <Box sx={{ mt: 2, px: 0.5 }}>
        <Skeleton width="35%" height={12} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 0.75 }} />
        <Skeleton width="65%" height={18} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />
        <Skeleton width="90%" height={13} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 0.5 }} />
        <Skeleton width="75%" height={13} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />
        <Skeleton width="40%" height={13} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
      </Box>
    </Box>
  );
}

const PARTNER_NAMES: Record<string, string> = {
  'terranovawatches.com': 'Terra Nova',
  'relojoariaimpala.com.br': 'Impala',
  'rouewatch.com.br': 'ROUE',
  'valliwatches.com.br': 'Valli',
};

function partnerOf(w: Watch): string {
  try {
    const host = new URL(w.storeUrl).hostname.replace(/^www\./, '');
    if (PARTNER_NAMES[host]) return PARTNER_NAMES[host];
    const label = host.split('.')[0];
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return w.brand.split('-')[0].trim();
  }
}

const filterChipSx = (active: boolean) => ({
  flexShrink: 0,
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.65rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  height: 34,
  borderRadius: '17px',
  px: 0.5,
  color: active ? 'primary.main' : 'rgba(255,255,255,0.55)',
  borderColor: active ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.15)',
  backgroundColor: active ? 'rgba(201,168,76,0.08)' : 'transparent',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: active ? 'primary.main' : 'rgba(255,255,255,0.35)',
    backgroundColor: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
  },
});

export default function Recommendations() {
  const { ref, visible } = useScrollReveal();
  const { t } = useLanguage();
  const { watches, loading } = useRecommendations();
  // brandFilter destaca o chip na hora; appliedFilter troca a lista depois do
  // fade-out, para a transição ser suave em vez de piscar.
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<number | undefined>(undefined);

  const changeFilter = (next: string | null) => {
    if (next === brandFilter) return;
    setBrandFilter(next);
    setFading(true);
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => {
      setAppliedFilter(next);
      setFading(false);
    }, 120);
  };

  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  const brands = useMemo(() => {
    const seen = new Set<string>();
    for (const w of watches) {
      const name = partnerOf(w);
      if (name) seen.add(name);
    }
    return Array.from(seen);
  }, [watches]);

  const filtered = useMemo(
    () => (appliedFilter === null ? watches : watches.filter((w) => partnerOf(w) === appliedFilter)),
    [watches, appliedFilter]
  );

  const chipRowRef = useRef<HTMLDivElement>(null);
  const [chipHint, setChipHint] = useState({ left: false, right: false });
  const updateChipHint = useCallback(() => {
    const el = chipRowRef.current;
    if (!el) return;
    setChipHint({
      left: el.scrollLeft > 1,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
    });
  }, []);

  useEffect(() => {
    updateChipHint();
    window.addEventListener('resize', updateChipHint);
    return () => window.removeEventListener('resize', updateChipHint);
  }, [brands, loading, updateChipHint]);

  return (
    <Box
      id="recomendacoes"
      sx={{
        backgroundColor: '#0D0E11',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        py: { xs: 10, md: 14 },
        scrollMarginTop: { xs: 72, md: 96 },
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
            {t.recommendations.label}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              ...revealSx(visible, 60),
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: '2rem', md: '2.6rem' },
              fontWeight: 700,
              color: '#EBEBEB',
              lineHeight: 1.2,
              mt: 1.5,
              mb: 2,
            }}
          >
            {t.recommendations.heading}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              ...revealSx(visible, 100),
              color: 'text.secondary',
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            {t.recommendations.subtitle}
          </Typography>
        </Box>

        {!loading && brands.length >= 2 && (
          <Box
            sx={{
              ...revealSx(visible, 150),
              position: 'relative',
              mb: { xs: 4, md: 5 },
              mx: { xs: -4, sm: -6, md: 'auto' },
              maxWidth: { md: 900 },
            }}
          >
          <Box
            ref={chipRowRef}
            onScroll={updateChipHint}
            sx={{
              px: { xs: 4, sm: 6, md: 0 },
              display: 'flex',
              gap: 1.25,
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              overflowX: { xs: 'auto', md: 'visible' },
              justifyContent: { xs: 'flex-start', md: 'center' },
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Chip
              label={t.recommendations.filterAll}
              variant="outlined"
              clickable
              onClick={() => changeFilter(null)}
              sx={filterChipSx(brandFilter === null)}
            />
            {brands.map((brand) => (
              <Chip
                key={brand}
                label={brand}
                variant="outlined"
                clickable
                onClick={() => changeFilter(brandFilter === brand ? null : brand)}
                sx={filterChipSx(brandFilter === brand)}
              />
            ))}
          </Box>

          {([
            ['left', chipHint.left, 'to right'],
            ['right', chipHint.right, 'to left'],
          ] as const).map(([side, on, dir]) => (
            <Box
              key={side}
              sx={{
                position: 'absolute',
                [side]: 0,
                top: 0,
                bottom: 0,
                width: 56,
                pointerEvents: 'none',
                background: `linear-gradient(${dir}, #0D0E11 30%, rgba(13,14,17,0))`,
                opacity: on ? 1 : 0,
                transition: 'opacity 0.25s',
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
              }}
            >
              {side === 'left' ? (
                <ChevronLeftIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              ) : (
                <ChevronRightIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              )}
            </Box>
          ))}
          </Box>
        )}

        {!loading && watches.length === 0 && (
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              py: 8,
              px: 4,
            }}
          >
            {t.recommendations.loadError}
          </Typography>
        )}

        {(loading || watches.length > 0) && (
        <Box sx={revealSx(visible, 200)}>
        <Box sx={{ opacity: fading ? 0 : 1, transition: 'opacity 120ms ease' }}>
        <Carousel resetToken={appliedFilter}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Box
                  key={i}
                  data-carousel-item
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '100%', sm: '50%', md: 'calc(33.333%)' },
                    scrollSnapAlign: 'start',
                    px: 1.5,
                  }}
                >
                  <GalleryItemSkeleton />
                </Box>
              ))
            : filtered.map((w) => (
                <Box
                  key={`${w.model}-${w.storeUrl}`}
                  data-carousel-item
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '100%', sm: '50%', md: 'calc(33.333%)' },
                    scrollSnapAlign: 'start',
                    px: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <GalleryItem w={w} />
                </Box>
              ))
          }
        </Carousel>
        </Box>
        </Box>
        )}
      </Box>
    </Box>
  );
}
