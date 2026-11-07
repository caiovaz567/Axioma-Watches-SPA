import { useEffect, useRef, useState } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Lang } from '../i18n/translations';
import { tokens, font, display, ease, easeCss, gutter, maxWidth } from '../theme';
import { scrollToTarget, setScrollLocked } from '../lib/scroll';
import Icon from './ui/Icon';

const NAV_IDS = ['#about', '#videos', '#parcerias', '#recomendacoes', '#contact'] as const;

function LangToggle({ lang, setLang, id }: { lang: Lang; setLang: (l: Lang) => void; id: string }) {
  return (
    <Box
      role="group"
      aria-label="Idioma / Language"
      sx={{ display: 'flex', p: '3px', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' }}
    >
      {(['pt', 'en'] as const).map((l) => (
        <ButtonBase
          key={l}
          onClick={() => setLang(l)}
          aria-label={l === 'pt' ? 'Português' : 'English'}
          aria-pressed={lang === l}
          sx={{
            position: 'relative',
            minWidth: 42,
            height: 34,
            borderRadius: 999,
            fontFamily: font,
            fontWeight: 600,
            fontSize: '0.78rem',
            color: lang === l ? tokens.ink : tokens.muted,
            transition: 'color .3s',
          }}
        >
          {lang === l && (
            <motion.span
              layoutId={`lang-pill-${id}`}
              transition={{ duration: 0.45, ease }}
              style={{ position: 'absolute', inset: 0, borderRadius: 999, background: tokens.white }}
            />
          )}
          <span style={{ position: 'relative' }}>{l.toUpperCase()}</span>
        </ButtonBase>
      ))}
    </Box>
  );
}

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const clickLock = useRef(false);
  // Trocar o idioma muda a altura dos textos; o navegador corrige a rolagem
  // sozinho e isso parecia "rolar para baixo", escondendo o menu. Logo após a
  // troca, essas mudanças de rolagem são ignoradas.
  const langChangedAt = useRef(0);
  // Ao clicar num item do menu, ele some e não volta durante a rolagem até a
  // seção — senão cobriria o topo dela bem na hora do destaque dourado
  const navHideUntil = useRef(0);
  const changeLang = (l: Lang) => {
    langChangedAt.current = Date.now();
    setHidden(false);
    setLang(l);
  };
  const { scrollY } = useScroll();

  // Esconde ao descer e volta ao subir
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (open) return;
    if (Date.now() < navHideUntil.current) {
      setHidden(true);
      return;
    }
    if (Date.now() - langChangedAt.current < 1200) {
      setHidden(false);
      return;
    }
    if (y < 480) setHidden(false);
    else if (y > prev + 2) setHidden(true);
    else if (y < prev - 2) setHidden(false);
  });

  const navLinks = [
    { label: t.nav.about, id: '#about' },
    { label: t.nav.videos, id: '#videos' },
    { label: t.nav.partnerships, id: '#parcerias' },
    { label: t.nav.recommendations, id: '#recomendacoes' },
    { label: t.nav.contact, id: '#contact' },
  ];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    // As seções são lazy: espera um pouco para elas existirem no DOM
    const timer = window.setTimeout(() => {
      NAV_IDS.forEach((id) => {
        const el = document.querySelector(id);
        if (!el) return;
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !clickLock.current) setActive(id);
          },
          { rootMargin: '-45% 0px -50% 0px' },
        );
        io.observe(el);
        observers.push(io);
      });
    }, 600);
    return () => {
      window.clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setActive(id);
    clickLock.current = true;
    window.setTimeout(() => (clickLock.current = false), 1600);
    if (id !== '#hero') {
      navHideUntil.current = Date.now() + 2200;
      setHidden(true);
    }
    if (open) {
      setOpen(false);
      window.setTimeout(() => scrollToTarget(id), 300);
    } else {
      scrollToTarget(id);
    }
  };

  const solid = scrolled || open;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? '-100%' : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}
      >
        <Box
          sx={{
            backgroundColor: solid ? 'rgba(13,14,17,0.78)' : 'transparent',
            backdropFilter: solid ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: solid ? 'blur(16px)' : 'none',
            borderBottom: '1px solid',
            borderColor: solid ? tokens.hair : 'transparent',
            transition: `background-color .5s ${easeCss}, border-color .5s ${easeCss}`,
          }}
        >
          <Box
            sx={{
              maxWidth,
              mx: 'auto',
              px: gutter,
              height: { xs: 64, md: 76 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            <ButtonBase
              onClick={() => go('#hero')}
              aria-label={t.a11y.home}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                minHeight: 44,
                borderRadius: 999,
                // Clicar/segurar não seleciona nem arrasta a logo
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                transition: `opacity .35s ${easeCss}`,
                // Hover discreto: o logo inteiro só fica um pouco mais apagado
                '@media (hover: hover)': { '&:hover': { opacity: 0.75 } },
                '&:active': { opacity: 0.6 },
              }}
            >
              <Box
                component="img"
                className="logo-img"
                src="/brand/mark-gold.svg"
                alt=""
                draggable={false}
                sx={{ width: 34, height: 34, display: 'block' }}
              />
            </ButtonBase>

            {/* Navegação desktop: a pílula clara desliza até o item ativo */}
            <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <ButtonBase
                    key={link.id}
                    onClick={() => go(link.id)}
                    aria-current={isActive ? 'true' : undefined}
                    sx={{
                      position: 'relative',
                      height: 40,
                      px: { md: 1.5, lg: 2 },
                      borderRadius: 999,
                      fontFamily: font,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: isActive ? tokens.white : 'rgba(232,232,232,0.7)',
                      transition: 'color .3s',
                      '&:hover': { color: tokens.white },
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ duration: 0.5, ease }}
                        style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(255,255,255,0.1)' }}
                      />
                    )}
                    <span style={{ position: 'relative' }}>{link.label}</span>
                  </ButtonBase>
                );
              })}
              <Box sx={{ ml: 1.5 }}>
                <LangToggle lang={lang} setLang={changeLang} id="desk" />
              </Box>
            </Box>

            {/* Botão do menu mobile: duas linhas que viram um X */}
            <ButtonBase
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              sx={{
                display: { xs: 'grid', md: 'none' },
                placeItems: 'center',
                width: 46,
                height: 46,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: tokens.white,
              }}
            >
              <Box sx={{ position: 'relative', width: 18, height: 10 }}>
                {[0, 1].map((n) => (
                  <motion.span
                    key={n}
                    animate={open ? { top: 4.5, rotate: n ? -45 : 45 } : { top: n ? 9 : 0, rotate: 0 }}
                    transition={{ duration: 0.4, ease }}
                    style={{ position: 'absolute', left: 0, right: 0, height: 1.5, borderRadius: 2, background: 'currentColor' }}
                  />
                ))}
              </Box>
            </ButtonBase>
          </Box>
        </Box>
      </motion.header>

      {/* Menu mobile: painel que desce do topo */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1150,
              background: 'rgba(8,9,11,0.96)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <Box component="nav" sx={{ px: gutter, pt: '96px', flex: 1 }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease, delay: 0.05 + i * 0.05 }}
                >
                  <ButtonBase
                    onClick={() => go(link.id)}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      py: 2.25,
                      borderBottom: `1px solid ${tokens.hair}`,
                      color: active === link.id ? tokens.gold : tokens.white,
                    }}
                  >
                    {/* Tamanho que cabe "Recomendações" até em telas de 320px */}
                    <Box component="span" sx={{ ...display, fontSize: 'clamp(1.6rem, 7.5vw, 2rem)', lineHeight: 1.1, minWidth: 0, textAlign: 'left' }}>
                      {link.label}
                    </Box>
                    <Icon name="arrowRight" size={20} style={{ opacity: 0.5, flexShrink: 0 }} />
                  </ButtonBase>
                </motion.div>
              ))}
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ delay: 0.35, duration: 0.5, ease }}
            >
              <Box
                sx={{
                  px: gutter,
                  pt: 3,
                  pb: 'max(28px, env(safe-area-inset-bottom))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <LangToggle lang={lang} setLang={changeLang} id="mob" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[
                    { icon: 'youtube' as const, href: 'https://www.youtube.com/@axiomawatches', label: 'YouTube' },
                    { icon: 'instagram' as const, href: 'https://www.instagram.com/axiomawatcheschannel', label: 'Instagram' },
                  ].map((s) => (
                    <ButtonBase
                      key={s.label}
                      component="a"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', color: tokens.white }}
                    >
                      <Icon name={s.icon} size={20} />
                    </ButtonBase>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
