import { useMemo, useState } from 'react';
import { Box, ButtonBase, Skeleton } from '@mui/material';
import { motion } from 'motion/react';
import Carousel from './ui/Carousel';
import CouponChip from './ui/CouponChip';
import Icon from './ui/Icon';
import { Section, Container, Heading } from './ui/Section';
import { Reveal } from './ui/motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecommendations } from '../hooks/useRecommendations';
import type { Watch } from '../hooks/useRecommendations';
import { useOgImage } from '../hooks/useOgImage';
import { tokens, font, ease, easeCss, radius } from '../theme';

const SLIDE_WIDTH = {
  xs: '84%',
  sm: 'calc((100% - 14px) / 2)',
  md: 'calc((100% - 48px) / 3)',
  lg: 'calc((100% - 72px) / 4)',
};

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

function WatchCard({ w, index }: { w: Watch; index: number }) {
  const imageUrl = useOgImage(w.storeUrl, w.imageUrl);
  const { t, lang } = useLanguage();
  const description = lang === 'en' && w.descriptionEn ? w.descriptionEn : w.description;

  return (
    <motion.article
      // Recebe "hidden"/"show" do bloco em volta do carrossel
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: Math.min(index, 3) * 0.1 } },
      }}
      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: radius.card,
          overflow: 'hidden',
          backgroundColor: tokens.paper,
        }}
      >
        {/* Cupom é irmão do link, não filho: botão dentro de <a> é HTML inválido */}
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
            backgroundColor: '#EFEDE8',
            '& .w-img': { transition: `transform 1.2s ${easeCss}` },
            '@media (hover: hover)': { '&:hover .w-img': { transform: 'scale(1.05)' } },
          }}
        >
          <Box
            component={w.storeUrl ? 'a' : 'div'}
            href={w.storeUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${w.brand} ${w.model}`}
            draggable={false}
            sx={{ position: 'absolute', inset: 0, display: 'block' }}
          >
            <Box data-parallax sx={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '120%' }}>
              {imageUrl ? (
                <Box
                  component="img"
                  className="w-img"
                  src={imageUrl}
                  alt={w.model}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box className="w-img" sx={{ width: '100%', height: '100%', background: w.gradient }} />
              )}
            </Box>
          </Box>

          {w.coupon && (
            <Box sx={{ position: 'absolute', left: 12, top: 12, zIndex: 2 }}>
              <CouponChip
                tone="overlay"
                code={w.coupon.toUpperCase()}
                label={t.recommendations.couponLabel}
                copiedLabel={t.recommendations.copied}
                tooltip={t.recommendations.tooltipCopy}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box sx={{ fontSize: '0.85rem', fontWeight: 600, color: tokens.gold, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {w.brand}
          </Box>
          <Box
            component="h3"
            sx={{
              m: 0,
              mt: 0.5,
              fontWeight: 700,
              fontStretch: '105%',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.45rem', md: '1.6rem' },
              lineHeight: 1.15,
              color: tokens.white,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {w.model}
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              mt: 1.25,
              mb: 3,
              color: tokens.muted,
              fontSize: '0.95rem',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Box>

          {w.storeUrl && (
            <Box
              component="a"
              href={w.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              sx={{
                mt: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 50,
                pl: 2.5,
                pr: 0.75,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.07)',
                color: tokens.white,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: `background-color .35s ${easeCss}, color .35s`,
                '& .w-go': { transition: `transform .45s ${easeCss}` },
                '@media (hover: hover)': {
                  '&:hover': { backgroundColor: tokens.gold, color: tokens.ink },
                  '&:hover .w-go': { transform: 'rotate(45deg)' },
                },
              }}
            >
              {t.recommendations.visitStore}
              <Box className="w-go" sx={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: tokens.white, color: tokens.ink }}>
                <Icon name="arrowUpRight" size={16} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </motion.article>
  );
}

function CardSkeleton() {
  const bg = { bgcolor: 'rgba(255,255,255,0.06)' };
  return (
    <Box sx={{ borderRadius: radius.card, overflow: 'hidden', backgroundColor: tokens.paper }}>
      <Skeleton variant="rectangular" sx={{ ...bg, aspectRatio: '1 / 1', height: 'auto', width: '100%' }} />
      <Box sx={{ p: 3 }}>
        <Skeleton width="35%" height={18} sx={bg} />
        <Skeleton width="70%" height={34} sx={bg} />
        <Skeleton width="95%" height={18} sx={{ ...bg, mt: 1 }} />
        <Skeleton width="80%" height={18} sx={bg} />
      </Box>
    </Box>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={active}
      sx={{
        position: 'relative',
        flexShrink: 0,
        height: 44,
        px: 2.5,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.07)',
        fontFamily: font,
        fontWeight: 600,
        fontSize: '0.95rem',
        color: active ? tokens.ink : 'rgba(232,232,232,0.8)',
        transition: `color .4s ${easeCss}, background-color .3s`,
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)', color: active ? tokens.ink : tokens.white },
      }}
    >
      {active && (
        <motion.span
          layoutId="rec-filter-pill"
          transition={{ duration: 0.5, ease }}
          style={{ position: 'absolute', inset: 0, borderRadius: 999, background: tokens.gold }}
        />
      )}
      <span style={{ position: 'relative' }}>{label}</span>
    </ButtonBase>
  );
}

export default function Recommendations() {
  const { t } = useLanguage();
  const { watches, loading } = useRecommendations();
  const [filter, setFilter] = useState<string | null>(null);

  const brands = useMemo(() => Array.from(new Set(watches.map(partnerOf).filter(Boolean))), [watches]);
  const filtered = useMemo(
    () => (filter === null ? watches : watches.filter((w) => partnerOf(w) === filter)),
    [watches, filter],
  );

  return (
    <Section id="recomendacoes" sx={{ backgroundColor: tokens.inkDeep }}>
      <Container>
        <Heading wide label={t.recommendations.label} title={t.recommendations.heading} lead={t.recommendations.subtitle} sx={{ mb: { xs: 5, md: 5 } }} />

        {!loading && brands.length >= 2 && (
          <Reveal y={16}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: { xs: 3, md: 2 },
                // No celular a fileira rola de lado e encosta nas bordas da tela
                overflowX: 'auto',
                mx: { xs: -2.5, sm: -4, md: 0 },
                px: { xs: 2.5, sm: 4, md: 0 },
                py: '2px',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <FilterChip label={t.recommendations.filterAll} active={filter === null} onClick={() => setFilter(null)} />
              {brands.map((b) => (
                <FilterChip key={b} label={b} active={filter === b} onClick={() => setFilter(filter === b ? null : b)} />
              ))}
            </Box>
          </Reveal>
        )}

        {!loading && watches.length === 0 && (
          <Box sx={{ py: 8, color: tokens.muted, fontSize: '1.05rem', maxWidth: 520 }}>{t.recommendations.loadError}</Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', gap: { xs: '14px', md: '24px' }, overflow: 'hidden' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} sx={{ flex: '0 0 auto', width: SLIDE_WIDTH }}>
                <CardSkeleton />
              </Box>
            ))}
          </Box>
        )}

        {!loading && filtered.length > 0 && (
          // A entrada é disparada pela seção (não por cada card): todos animam juntos
          // uma vez, e os que estão fora da tela já chegam prontos quando arrastados.
          // Trocar o filtro remonta tudo e a cascata toca de novo.
          <motion.div key={filter ?? '__all'} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <Carousel label={t.recommendations.heading} slideWidth={SLIDE_WIDTH} autoplayMs={5000}>
              {filtered.map((w, i) => (
                <WatchCard key={`${w.model}-${w.storeUrl}`} w={w} index={i} />
              ))}
            </Carousel>
          </motion.div>
        )}
      </Container>
    </Section>
  );
}
