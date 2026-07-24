import { Box, Typography, IconButton, Divider } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(201,168,76,0.15)',
        backgroundColor: '#0A0B0E',
        py: 5,
        px: { xs: 3, md: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'primary.main',
              letterSpacing: '0.1em',
            }}
          >
            AXIOMA WATCHES
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.5 }}>
            {t.footer.by}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(201,168,76,0.15)' }} />

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: '0.8rem', maxWidth: 320, textAlign: 'center' }}
        >
          {t.footer.tagline}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(201,168,76,0.15)' }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            href="https://www.youtube.com/@axiomawatches"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: '#FF0000', backgroundColor: 'rgba(255,0,0,0.08)' } }}
          >
            <YouTubeIcon />
          </IconButton>
          <IconButton
            href="https://www.instagram.com/axiomawatcheschannel"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: '#E1306C', backgroundColor: 'rgba(225,48,108,0.08)' } }}
          >
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mt: 4, mb: 3, borderColor: 'rgba(201,168,76,0.08)' }} />

      <Typography
        variant="body2"
        sx={{ textAlign: 'center', color: 'text.secondary', opacity: 0.4, fontSize: '0.75rem' }}
      >
        © {new Date().getFullYear()} Axioma Watches — Claudio Vaz. {t.footer.rights}
      </Typography>
    </Box>
  );
}
