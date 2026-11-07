import { useRef } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { tokens, display, ease, gutter, maxWidth } from '../theme';
import { scrollToTarget, cssScrollFx } from '../lib/scroll';
import Cta from './ui/Cta';
import Icon from './ui/Icon';
import { Words } from './ui/motion';

export default function Hero() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Ao rolar: a foto anda mais devagar que a página e o texto sobe e some.
  // Onde o navegador suporta (cssScrollFx), isso roda em CSS nativo (classes
  // .sd-hero-*) e estes valores em JS ficam só como alternativa.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay },
  });

  return (
    <Box
      ref={ref}
      component="section"
      id="hero"
      className="sd-hero"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: tokens.ink,
        height: { xs: '100svh', md: '100vh' },
        minHeight: { xs: 640, md: 680 },
      }}
    >
      {/* Foto de ponta a ponta: entra com um zoom-out e depois faz parallax */}
      {/* will-change é obrigatório aqui: sem ele o Safari redesenha a foto inteira a cada quadro da rolagem */}
      <motion.div
        aria-hidden
        className={cssScrollFx ? 'sd-hero-bg' : undefined}
        style={{ position: 'absolute', inset: 0, willChange: 'transform', ...(cssScrollFx ? {} : { y: bgY }) }}
      >
        {/* A foto tem 1400px. Em telas bem largas ela deixaria de ir de ponta a
            ponta (seria esticada quase 2x e ficaria borrada): ocupa o lado
            direito na proporção dela, perto do tamanho real, e se dissolve no
            preto à esquerda e embaixo. Abaixo de 1900px fica como sempre. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            // Celular: foto só nos 2/3 de cima, para o relógio aparecer inteiro e o
            // texto ficar sobre o fundo escuro de baixo
            bottom: { xs: '32%', sm: 0 },
            '@media (min-width: 1900px)': {
              left: 'auto',
              bottom: 'auto',
              width: 'min(64vw, 1560px)',
              aspectRatio: '1400 / 923',
              top: '50%',
              transform: 'translateY(-54%)',
            },
          }}
        >
          {/* Caixa que corta a foto: ela entra com zoom (começa 15% maior) e sem
              corte vazava como um quadrado. Nas telas largas fica 3px para dentro
              da camada que escurece, para a borda da imagem nunca aparecer como linha. */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              '& img': { objectPosition: { xs: '76% 55%', sm: '68% 45%' } },
              '@media (min-width: 1900px)': { inset: '3px' },
            }}
          >
          <motion.img
            src="/hero-bg-soft.jpg"
            alt=""
            fetchPriority="high"
            // A foto já vem escurecida e levemente desfocada no próprio arquivo
            // (hero-bg-soft.jpg). Filtro CSS em foto grande que se mexe dava tranco no iPhone.
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          </Box>
          {/* Bordas que se dissolvem no fundo: embaixo no celular; em volta nas telas largas */}
          <Box
            sx={{
              display: { xs: 'block', sm: 'none' },
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(0deg, ${tokens.ink} 0%, ${tokens.inkA(0.6)} 22%, ${tokens.inkA(0)} 50%)`,
              '@media (min-width: 1900px)': {
                display: 'block',
                position: 'absolute',
                inset: 0,
                background: [
                  `linear-gradient(90deg, ${tokens.ink} 0%, ${tokens.inkA(0.85)} 12%, ${tokens.inkA(0)} 45%)`,
                  `linear-gradient(0deg, ${tokens.ink} 0%, ${tokens.inkA(0)} 30%)`,
                  `linear-gradient(180deg, ${tokens.ink} 0%, ${tokens.inkA(0)} 22%)`,
                  `linear-gradient(270deg, ${tokens.inkA(0.6)} 0%, ${tokens.inkA(0)} 12%)`,
                ].join(', '),
              },
            }}
          />
        </Box>
      </motion.div>

      {/* Só escurece onde tem texto (embaixo e na esquerda) — o relógio fica nítido */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: `linear-gradient(180deg, ${tokens.inkA(0.6)} 0%, ${tokens.inkA(0.2)} 18%, ${tokens.inkA(0.3)} 45%, ${tokens.inkA(0.85)} 66%, ${tokens.ink} 100%)`,
            md: `linear-gradient(180deg, ${tokens.inkA(0.45)} 0%, transparent 20%, transparent 50%, ${tokens.inkA(0.8)} 85%, ${tokens.ink} 100%), linear-gradient(90deg, ${tokens.inkA(0.55)} 0%, transparent 55%)`,
          },
        }}
      />

      <motion.div
        className={cssScrollFx ? 'sd-hero-text' : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          willChange: 'transform, opacity',
          ...(cssScrollFx ? {} : { y: textY, opacity: textOpacity }),
        }}
      >
        <Box
          sx={{
            height: '100%',
            maxWidth,
            mx: 'auto',
            px: gutter,
            // Celular: tudo embaixo (não sobra espaço). Telas maiores: bloco mais
            // para o meio, sem o vazio grande acima do título
            pt: { md: '96px' },
            pb: { xs: 5, md: 10 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'flex-end', md: 'center' },
          }}
        >

          <Box
            component="h1"
            sx={{
              ...display,
              m: 0,
              color: tokens.white,
              fontSize: { xs: 'clamp(3.6rem, 19vw, 6rem)', sm: '7.5rem', md: 'clamp(7.5rem, 12vw, 12rem)' },
              lineHeight: 0.88,
              letterSpacing: '-0.05em',
            }}
          >
            <Box component="span" sx={{ display: 'block' }}>
              <Words text="Axioma" immediate delay={0.4} />
            </Box>
            <Box component="span" sx={{ display: 'block', color: tokens.gold }}>
              <Words text="Watches" immediate delay={0.5} />
            </Box>
          </Box>

          <Box
            sx={{
              // Descrição e botões num bloco só, à esquerda, um embaixo do outro
              mt: { xs: 3.5, md: 5 },
              display: 'grid',
              maxWidth: 600,
              gap: { xs: 3.5, md: 4 },
            }}
          >
            <motion.div {...fadeUp(0.8)}>
              <Box component="p" sx={{ m: 0, color: 'rgba(245,245,243,0.88)', fontSize: { xs: '1.05rem', md: '1.25rem' }, lineHeight: 1.5 }}>
                {t.hero.description}
              </Box>
              {/* A segunda frase sai no celular (já aparece no "Sobre" e no rodapé) */}
              <Box component="p" sx={{ display: { xs: 'none', sm: 'block' }, m: 0, mt: 1.5, color: tokens.muted, fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.5 }}>
                {t.hero.tagline}
              </Box>
            </motion.div>

            <motion.div {...fadeUp(0.95)}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                <Cta href="https://www.youtube.com/@axiomawatches" external icon="arrowUpRight" size="lg" sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, justifyContent: { xs: 'space-between', sm: 'center' } }}>
                  {t.hero.ctaPrimary}
                </Cta>
                <Cta variant="ghost" size="lg" onClick={() => scrollToTarget('#recomendacoes')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  {t.hero.ctaSecondary}
                </Cta>
                {/* No celular, o segundo botão vira um link leve: dois botões grandes empilhados pesavam */}
                <ButtonBase
                  onClick={() => scrollToTarget('#recomendacoes')}
                  sx={{
                    display: { xs: 'inline-flex', sm: 'none' },
                    alignItems: 'center',
                    gap: 1,
                    minHeight: 44,
                    mx: 'auto',
                    color: tokens.white,
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:active': { opacity: 0.6 },
                  }}
                >
                  {t.hero.ctaSecondary}
                  <Icon name="arrowRight" size={18} />
                </ButtonBase>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
