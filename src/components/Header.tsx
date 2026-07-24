import { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Drawer, List, ListItemButton, ButtonBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import axiomaLogo from '../assets/axioma-logo-128.png';
import { useLanguage } from '../contexts/LanguageContext';
import type { Lang } from '../i18n/translations';

const NAV_IDS = ['#about', '#videos', '#parcerias', '#recomendacoes', '#contact'] as const;

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, userSelect: 'none' }}>
      {(['pt', 'en'] as const).map((l) => (
        <ButtonBase
          key={l}
          onClick={() => setLang(l)}
          aria-label={l === 'pt' ? 'Português' : 'English'}
          aria-pressed={lang === l}
          sx={{
            px: 1.5,
            py: 0.4,
            borderRadius: '4px',
            border: '1px solid',
            borderColor: lang === l ? 'primary.main' : 'rgba(201,168,76,0.2)',
            backgroundColor: lang === l ? 'rgba(201,168,76,0.1)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minWidth: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(201,168,76,0.06)',
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              fontWeight: 600,
              color: lang === l ? 'primary.main' : 'rgba(200,200,200,0.4)',
              transition: 'color 0.2s',
            }}
          >
            {l.toUpperCase()}
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);
  const isScrolling = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.about, id: '#about' },
    { label: t.nav.videos, id: '#videos' },
    { label: t.nav.partnerships, id: '#parcerias' },
    { label: t.nav.recommendations, id: '#recomendacoes' },
    { label: t.nav.contact, id: '#contact' },
  ];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_IDS.forEach((id) => {
      const el = document.querySelector(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrolling.current) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setDrawerOpen(false);
    isScrolling.current = true;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);

    setTimeout(() => {
      const el = document.querySelector(id);
      if (!el) return;
      const headerHeight = window.innerWidth < 600 ? 56 : 64;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });

      setTimeout(() => {
        const prev = document.querySelector('.section-highlight-overlay');
        if (prev) prev.remove();
        if (getComputedStyle(el).position === 'static') {
          (el as HTMLElement).style.position = 'relative';
        }
        const overlay = document.createElement('div');
        overlay.className = 'section-highlight-overlay';
        el.appendChild(overlay);
        setTimeout(() => overlay.remove(), 2300);
      }, 700);
    }, 300);

    scrollTimer.current = setTimeout(() => {
      isScrolling.current = false;
    }, 1200);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? 'rgba(13,14,17,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid',
          borderBottomColor: scrolled ? 'rgba(201,168,76,0.18)' : 'transparent',
          boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.45)' : 'none',
          transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, minHeight: { xs: 56, sm: 64 } }}>

          <ButtonBase
            onClick={() => scrollTo('#hero')}
            aria-label={t.a11y.home}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', userSelect: 'none' }}
          >
            <Box
              component="img"
              src={axiomaLogo}
              alt="Axioma Watches"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                flexShrink: 0,
                border: '1px solid rgba(201,168,76,0.4)',
                display: 'block',
              }}
            />
            <Typography
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                color: '#C8C8C8',
                fontWeight: 600,
              }}
            >
              AXIOMA WATCHES
            </Typography>
          </ButtonBase>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <ButtonBase key={link.id} onClick={() => scrollTo(link.id)} sx={{ position: 'relative', cursor: 'pointer', userSelect: 'none', pb: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.72rem',
                      letterSpacing: '0.18em',
                      color: isActive ? 'primary.main' : 'rgba(200,200,200,0.7)',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {link.label.toUpperCase()}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: 'primary.main',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                      transformOrigin: 'center',
                    }}
                  />
                </ButtonBase>
              );
            })}
            <LangToggle lang={lang} setLang={setLang} />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5 }}>
            <LangToggle lang={lang} setLang={setLang} />
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'rgba(201,168,76,0.8)', p: 0.75 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 240,
              backgroundColor: '#0D0E11',
              borderLeft: '1px solid rgba(201,168,76,0.12)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'rgba(201,168,76,0.6)', '&:hover': { color: 'primary.main', backgroundColor: 'rgba(201,168,76,0.06)' } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List disablePadding sx={{ pt: 1 }}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <ListItemButton
                key={link.id}
                onClick={() => scrollTo(link.id)}
                sx={{
                  py: 2,
                  px: 3,
                  borderLeft: isActive ? '2px solid' : '2px solid transparent',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  transition: 'border-color 0.3s, background-color 0.2s',
                  '&:hover': { backgroundColor: 'rgba(201,168,76,0.05)' },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    color: isActive ? 'primary.main' : 'rgba(200,200,200,0.75)',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label.toUpperCase()}
                </Typography>
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
