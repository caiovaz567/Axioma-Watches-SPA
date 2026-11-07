import { Box } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { tokens, eyebrow, gutter, maxWidth } from '../theme';
import Icon from './ui/Icon';

const linkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  minHeight: 38,
  color: 'rgba(232,232,232,0.75)',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'color .3s',
  '&:hover': { color: tokens.gold },
};

export default function Footer() {
  const { t } = useLanguage();

  const socials = [
    { icon: 'youtube' as const, label: 'YouTube', href: 'https://www.youtube.com/@axiomawatches' },
    { icon: 'instagram' as const, label: 'Instagram', href: 'https://www.instagram.com/axiomawatcheschannel' },
    { icon: 'mail' as const, label: 'axiomawatches@gmail.com', href: 'mailto:axiomawatches@gmail.com' },
  ];

  return (
    <Box component="footer" sx={{ backgroundColor: tokens.inkDeep, borderTop: `1px solid ${tokens.hair}`, overflow: 'hidden' }}>
      <Box sx={{ maxWidth, mx: 'auto', px: gutter, pt: { xs: 9, md: 12 } }}>
        {/* Só frase + redes: a navegação já está no menu do topo */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: { xs: 5, md: 4 } }}>
          <Box sx={{ maxWidth: 380 }}>
            <Box sx={{ fontWeight: 600, fontSize: { xs: '1.4rem', md: '1.6rem' }, lineHeight: 1.3, letterSpacing: '-0.02em', color: tokens.white }}>
              {t.footer.tagline}
            </Box>
            <Box sx={{ ...eyebrow, color: tokens.gold, mt: 2 }}>{t.footer.by}</Box>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ ...eyebrow, color: tokens.faint, mb: 1.5 }}>{t.footer.followTitle}</Box>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {socials.map((s) => (
                <li key={s.label}>
                  <Box
                    component="a"
                    href={s.href}
                    target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    sx={{ ...linkSx, overflowWrap: 'anywhere' }}
                  >
                    <Icon name={s.icon} size={17} />
                    {s.label}
                  </Box>
                </li>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          data-fab-avoid
          sx={{
            mt: { xs: 7, md: 9 },
            py: 3,
            pb: { xs: 'max(24px, env(safe-area-inset-bottom))', md: 3 },
            borderTop: `1px solid ${tokens.hair}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            fontSize: '0.85rem',
            color: tokens.faint,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 3 } }}>
            <span>© {new Date().getFullYear()} Axioma Watches · Claudio Vaz</span>
            <span>{t.footer.rights}</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
