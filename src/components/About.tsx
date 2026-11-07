import { Box } from '@mui/material';
import { motion } from 'motion/react';
import { Section, Container, Heading } from './ui/Section';
import { Reveal } from './ui/motion';
import { useLanguage } from '../contexts/LanguageContext';
import { tokens, display, ease, radius } from '../theme';
import aboutImg from '../assets/about.jpg';

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

export default function About() {
  const { t } = useLanguage();
  const [before, after] = t.about.body.split('Claudio Vaz');

  return (
    <Section id="about">
      <Container>
        <Heading
          label={t.about.label}
          title={`${t.about.headingLine1} ${t.about.headingHighlighted}`}
          highlight={t.about.headingHighlighted}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 2, alignItems: 'stretch' }}>
          {/* Cartão com a foto de fundo escurecida e a frase do Claudio por cima.
              A foto tem 900px: neste tamanho ela não é esticada e fica nítida. */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            viewport={VIEWPORT}
            transition={{ duration: 1.3, ease }}
            style={{ display: 'flex' }}
          >
            <Box
              component="figure"
              sx={{
                m: 0,
                position: 'relative',
                flex: 1,
                minHeight: { xs: 460, md: 560 },
                overflow: 'hidden',
                borderRadius: radius.media,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <motion.img
                src={aboutImg}
                alt={t.about.imgAlt}
                loading="lazy"
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 1.8, ease }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', display: 'block' }}
              />
              {/* Escurece de baixo para cima: o texto fica legível, o relógio e o sol continuam visíveis */}
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, ${tokens.inkA(0.1)} 0%, ${tokens.inkA(0.25)} 35%, ${tokens.inkA(0.88)} 72%, ${tokens.inkA(0.96)} 100%)`,
                }}
              />
              <Box component="figcaption" sx={{ position: 'relative', p: { xs: 3, md: 5 } }}>
                <Reveal delay={0.4}>
                  <Box aria-hidden sx={{ ...display, fontSize: { xs: '4rem', md: '5.5rem' }, color: tokens.gold, lineHeight: 0.6, mb: { xs: 1.5, md: 2 } }}>
                    “
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      fontWeight: 500,
                      fontSize: { xs: '1.3rem', md: '1.75rem' },
                      lineHeight: 1.32,
                      letterSpacing: '-0.02em',
                      color: tokens.white,
                      maxWidth: 640,
                    }}
                  >
                    {before}
                    {after !== undefined && (
                      <>
                        <Box component="span" sx={{ color: tokens.gold }}>Claudio Vaz</Box>
                        {after}
                      </>
                    )}
                  </Box>
                </Reveal>
              </Box>
            </Box>
          </motion.div>

          {/* Os dois pilares dividem a altura do cartão da foto */}
          <Box sx={{ display: 'grid', gridTemplateRows: { md: '1fr 1fr' }, gap: 2 }}>
            {t.about.pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.15 + i * 0.1} style={{ display: 'flex' }}>
                <Box
                  sx={{
                    flex: 1,
                    p: { xs: 3, md: 4 },
                    borderRadius: radius.media,
                    backgroundColor: tokens.paper,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 3,
                  }}
                >
                  <Box sx={{ ...display, fontSize: { xs: '2.6rem', md: '3.4rem' }, color: tokens.gold, lineHeight: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </Box>
                  <Box>
                    <Box component="h3" sx={{ m: 0, mb: 1, fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.35rem' }, color: tokens.white }}>
                      {p.title}
                    </Box>
                    <Box component="p" sx={{ m: 0, color: tokens.muted, fontSize: '1rem', lineHeight: 1.6 }}>
                      {p.description}
                    </Box>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
