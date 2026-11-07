import { useRef } from 'react';
import { Box } from '@mui/material';
import { motion, useScroll, useTransform } from 'motion/react';
import { Container, Heading } from './ui/Section';
import { cssScrollFx } from '../lib/scroll';
import { Reveal } from './ui/motion';
import Icon from './ui/Icon';
import type { IconName } from './ui/Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { tokens, display, eyebrow, easeCss, radius } from '../theme';
import DialArt from './art/DialArt';

interface Panel {
  icon: IconName;
  platform: string;
  title: string;
  description: string;
  button: string;
  href: string;
}

/**
 * Divulgação para marcas: foto grande de ponta a ponta ao fundo e as duas
 * ofertas como painéis iguais de vidro fosco por cima.
 */
export default function Promo() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const panels: Panel[] = [
    {
      icon: 'youtube',
      platform: 'YouTube',
      title: t.promo.youtube.title,
      description: t.promo.youtube.description,
      button: t.promo.youtube.button,
      href: 'https://www.youtube.com/@axiomawatches',
    },
    {
      icon: 'instagram',
      platform: 'Instagram',
      title: t.promo.instagram.title,
      description: t.promo.instagram.description,
      button: t.promo.instagram.button,
      href: 'https://www.instagram.com/axiomawatcheschannel',
    },
  ];

  return (
    <Box
      ref={ref}
      component="section"
      id="divulgacao"
      className="sd-promo"
      sx={{ position: 'relative', overflow: 'hidden', backgroundColor: tokens.ink, py: { xs: 12, md: 18 } }}
    >
      {/* Mostrador gigante desenhado em vetor (nítido em qualquer tela), com parallax leve */}
      <motion.div
        aria-hidden
        className={cssScrollFx ? 'sd-promo-bg' : undefined}
        style={{ position: 'absolute', inset: '-12% 0', willChange: 'transform', ...(cssScrollFx ? {} : { y: bgY }) }}
      >
        <DialArt
          sx={{
            position: 'absolute',
            top: '50%',
            width: { xs: '150vw', md: '92vw', lg: '78vw' },
            right: { xs: '-75vw', md: '-30vw', lg: '-20vw' },
            transform: 'translateY(-50%)',
            opacity: 0.9,
          }}
        />
      </motion.div>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${tokens.ink} 0%, ${tokens.inkA(0.55)} 18%, ${tokens.inkA(0.35)} 50%, ${tokens.inkA(0.75)} 85%, ${tokens.ink} 100%)`,
        }}
      />

      <Container sx={{ position: 'relative' }}>
        <Heading label={t.promo.label} title={t.promo.heading} highlight="Axioma" lead={t.promo.subtitle} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 3 } }}>
          {panels.map((p, i) => (
            <Reveal key={p.platform} delay={i * 0.12} style={{ display: 'flex' }}>
              <Box
                component="a"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: { md: 400 },
                  p: { xs: 3, md: 5 },
                  borderRadius: radius.media,
                  color: tokens.white,
                  textDecoration: 'none',
                  backgroundColor: 'rgba(13,14,17,0.5)',
                  backdropFilter: 'blur(20px) saturate(1.2)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  transition: `background-color .5s ${easeCss}, border-color .5s ${easeCss}`,
                  '& .pr-arrow': { transition: `transform .5s ${easeCss}, background-color .4s, color .4s` },
                  '@media (hover: hover)': {
                    '&:hover': { backgroundColor: 'rgba(13,14,17,0.65)', borderColor: tokens.goldA(0.6) },
                    '&:hover .pr-arrow': { transform: 'rotate(45deg)', backgroundColor: tokens.gold },
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ ...eyebrow, display: 'flex', alignItems: 'center', gap: 1, color: tokens.gold }}>
                    <Icon name={p.icon} size={20} />
                    {p.platform}
                  </Box>
                  <Box
                    className="pr-arrow"
                    sx={{
                      width: { xs: 46, md: 54 },
                      height: { xs: 46, md: 54 },
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: tokens.white,
                      color: tokens.ink,
                    }}
                  >
                    <Icon name="arrowUpRight" size={20} />
                  </Box>
                </Box>

                <Box sx={{ mt: { xs: 5, md: 'auto' }, pt: { md: 6 } }}>
                  <Box component="h3" sx={{ ...display, m: 0, fontSize: { xs: '2.1rem', md: 'clamp(2.4rem, 3.4vw, 3.2rem)' } }}>
                    {p.title}
                  </Box>
                  <Box component="p" sx={{ m: 0, mt: 2, maxWidth: 480, fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.6, color: 'rgba(245,245,243,0.78)' }}>
                    {p.description}
                  </Box>
                  <Box sx={{ mt: 3, fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    {p.button}
                    <Icon name="arrowRight" size={18} />
                  </Box>
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
