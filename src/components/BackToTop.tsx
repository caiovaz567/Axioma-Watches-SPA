import { useRef, useState } from 'react';
import { ButtonBase, Tooltip } from '@mui/material';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { scrollToTarget } from '../lib/scroll';
import { tokens, ease, easeCss } from '../theme';
import Icon from './ui/Icon';

const SIZE = 52;
const MARGIN = 16;

/**
 * Elementos marcados com [data-fab-avoid] (setas dos carrosséis, botão de
 * enviar, rodapé) não podem ficar cobertos. Se algum deles passa pela área
 * do botão, ele se esconde e volta quando a área fica livre.
 */
function coversSomething() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const zone = { left: vw - MARGIN - SIZE - 8, right: vw, top: vh - MARGIN - SIZE - 8, bottom: vh };
  for (const el of document.querySelectorAll('[data-fab-avoid]')) {
    const r = el.getBoundingClientRect();
    if (r.right > zone.left && r.left < zone.right && r.bottom > zone.top && r.top < zone.bottom) return true;
  }
  return false;
}

/** Voltar ao topo. O anel em volta mostra quanto da página já foi lida. */
export default function BackToTop() {
  const { t } = useLanguage();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [visible, setVisible] = useState(false);

  // No máximo uma medição por quadro, por mais eventos de rolagem que cheguem
  const pending = useRef(false);
  useMotionValueEvent(scrollY, 'change', () => {
    if (pending.current) return;
    pending.current = true;
    requestAnimationFrame(() => {
      pending.current = false;
      setVisible(window.scrollY > 1200 && !coversSomething());
    });
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.35, ease }}
          style={{ position: 'fixed', right: MARGIN, bottom: `max(${MARGIN}px, env(safe-area-inset-bottom))`, zIndex: 1100 }}
        >
          <Tooltip title={t.backToTop} placement="left">
            <ButtonBase
              onClick={() => scrollToTarget(0)}
              aria-label={t.backToTop}
              sx={{
                position: 'relative',
                width: SIZE,
                height: SIZE,
                borderRadius: '50%',
                color: tokens.white,
                backgroundColor: 'rgba(13,14,17,0.85)',
                transition: `background-color .4s ${easeCss}, color .4s`,
                '& .btt-icon': { transition: `transform .5s ${easeCss}` },
                '@media (hover: hover)': {
                  '&:hover': { backgroundColor: tokens.gold, color: tokens.ink },
                  '&:hover .btt-icon': { transform: 'translateY(-3px)' },
                },
              }}
            >
              <svg width={SIZE} height={SIZE} viewBox="0 0 52 52" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} aria-hidden>
                <circle cx="26" cy="26" r="25" fill="none" stroke={tokens.hair} strokeWidth="1" />
                <motion.circle cx="26" cy="26" r="25" fill="none" stroke={tokens.gold} strokeWidth="1.5" style={{ pathLength: progress }} />
              </svg>
              <Icon name="arrowUp" size={18} className="btt-icon" />
            </ButtonBase>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
