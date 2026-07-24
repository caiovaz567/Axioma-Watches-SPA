import { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert, CircularProgress, Tooltip, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import emailjs from '@emailjs/browser';
import SectionHeading from './SectionHeading';
import { useScrollReveal, revealSx } from '../hooks/useScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import contactBg from '../assets/contact-bg.jpg';

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

function inputSx(hasError: boolean) {
  return {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 1,
      '& fieldset': { borderColor: hasError ? 'error.main' : 'rgba(201,168,76,0.2)' },
      '&:hover fieldset': { borderColor: hasError ? 'error.main' : 'rgba(201,168,76,0.4)' },
      '&.Mui-focused fieldset': { borderColor: hasError ? 'error.main' : 'primary.main', borderWidth: 1 },
    },
    '& .MuiInputLabel-root': { color: hasError ? 'error.main' : 'text.secondary', fontSize: '0.875rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: hasError ? 'error.main' : 'primary.main' },
    '& .MuiOutlinedInput-input': { color: 'text.primary', fontSize: '0.9rem' },
    '& .MuiFormHelperText-root': { fontSize: '0.75rem', mt: 0.5 },
  };
}

interface FormErrors {
  nome?: string;
  email?: string;
  mensagem?: string;
}

export default function Contact() {
  const { t } = useLanguage();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; type: 'success' | 'error'; msg: string }>({
    open: false, type: 'success', msg: '',
  });
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [formHighlighted, setFormHighlighted] = useState(false);
  // Anti-spam: campo isca que humanos não veem + tempo mínimo de preenchimento.
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLElement>(null);
  const { ref: sectionRef, visible } = useScrollReveal();

  const socials = [
    { icon: <YouTubeIcon sx={{ fontSize: '1.2rem' }} />, label: 'YouTube', handle: '@axiomawatches', href: 'https://www.youtube.com/@axiomawatches', color: '#FF0000' },
    { icon: <InstagramIcon sx={{ fontSize: '1.2rem' }} />, label: 'Instagram', handle: '@axiomawatcheschannel', href: 'https://www.instagram.com/axiomawatcheschannel', color: '#E1306C' },
    { icon: <EmailIcon sx={{ fontSize: '1.2rem' }} />, label: t.contact.emailDirectLabel, handle: 'axiomawatches@gmail.com', href: 'mailto:axiomawatches@gmail.com', color: '#C9A84C' },
  ];

  const validate = (n: string, em: string, msg: string): FormErrors => {
    const errs: FormErrors = {};
    if (!n.trim()) errs.nome = t.contact.validation.nameRequired;
    if (!em.trim()) {
      errs.email = t.contact.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      errs.email = t.contact.validation.emailInvalid;
    }
    if (!msg.trim()) errs.mensagem = t.contact.validation.messageRequired;
    return errs;
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setFormHighlighted(true);
    setTimeout(() => setFormHighlighted(false), 2000);
  };

  const handleCopy = (label: string, value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const validationErrors = validate(nome, email, mensagem);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    // Lê o campo isca direto do DOM no envio — pega robôs que setam .value sem disparar eventos
    const form = formRef.current as HTMLFormElement | null;
    const honeypot = (form?.elements.namedItem('website') as HTMLInputElement | null)?.value;
    if (honeypot || Date.now() - mountedAt.current < 3000) {
      // Robô detectado: finge sucesso sem enviar, para não revelar o filtro
      setSnackbar({ open: true, type: 'success', msg: t.contact.success });
      setNome('');
      setEmail('');
      setMensagem('');
      return;
    }
    setLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: nome, from_email: email, message: mensagem },
        EMAILJS_PUBLIC_KEY,
      );
      setSnackbar({ open: true, type: 'success', msg: t.contact.success });
      setNome('');
      setEmail('');
      setMensagem('');
    } catch {
      setSnackbar({ open: true, type: 'error', msg: t.contact.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="contact" sx={{ backgroundColor: '#0D0E11', borderTop: '1px solid rgba(201,168,76,0.08)', scrollMarginTop: { xs: 72, md: 96 } }}>
      <Box
        ref={sectionRef}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, maxWidth: 1200, mx: 'auto' }}
      >
        <Box
          ref={formRef}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            px: { xs: 4, sm: 6, md: 8, lg: 12 },
            py: { xs: 10, lg: 14 },
            borderRight: { lg: '1px solid rgba(201,168,76,0.08)' },
            outline: formHighlighted ? '1px solid rgba(201,168,76,0.5)' : '1px solid transparent',
            boxShadow: formHighlighted ? '0 0 40px rgba(201,168,76,0.1)' : 'none',
            transition: 'outline 0.4s ease, box-shadow 0.4s ease',
            borderRadius: 1,
          }}
        >
          <SectionHeading
            align="left"
            label={t.contact.label}
            heading={
              <>
                {t.contact.headingLine1}<br />
                <Box component="span" sx={{ color: 'primary.main' }}>{t.contact.headingHighlighted}</Box>
              </>
            }
            visible={visible}
            sx={{ mb: 3 }}
          />

          <Typography variant="body2" sx={{ ...revealSx(visible, 200), color: 'text.secondary', mb: 5, lineHeight: 1.8, maxWidth: 380 }}>
            {t.contact.body}
          </Typography>

          <Box
            component="input"
            type="text"
            name="website"
            defaultValue=""
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            sx={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
          />

          <Box sx={{ ...revealSx(visible, 320), display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
            <TextField
              label={t.contact.namePlaceholder}
              variant="outlined"
              fullWidth
              value={nome}
              onChange={(e) => { setNome(e.target.value); setErrors((prev) => ({ ...prev, nome: undefined })); }}
              error={!!errors.nome}
              helperText={errors.nome}
              sx={inputSx(!!errors.nome)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ visibility: nome ? 'visible' : 'hidden' }}>
                      <IconButton size="small" onClick={() => { setNome(''); setErrors((p) => ({ ...p, nome: undefined })); }}>
                        <ClearIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label={t.contact.emailPlaceholder}
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
              error={!!errors.email}
              helperText={errors.email}
              sx={inputSx(!!errors.email)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ visibility: email ? 'visible' : 'hidden' }}>
                      <IconButton size="small" onClick={() => { setEmail(''); setErrors((p) => ({ ...p, email: undefined })); }}>
                        <ClearIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label={t.contact.messagePlaceholder}
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              value={mensagem}
              onChange={(e) => { setMensagem(e.target.value); setErrors((prev) => ({ ...prev, mensagem: undefined })); }}
              error={!!errors.mensagem}
              helperText={errors.mensagem}
              sx={inputSx(!!errors.mensagem)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ visibility: mensagem ? 'visible' : 'hidden', alignSelf: 'flex-start', mt: 1 }}>
                      <IconButton size="small" onClick={() => { setMensagem(''); setErrors((p) => ({ ...p, mensagem: undefined })); }}>
                        <ClearIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendIcon sx={{ fontSize: '1rem !important' }} />}
            sx={{ ...revealSx(visible, 460), fontSize: '0.75rem', letterSpacing: '0.12em' }}
          >
            {loading ? t.contact.sending : t.contact.send}
          </Button>
        </Box>

        <Box sx={{ px: { xs: 4, sm: 6, md: 8, lg: 10 }, py: { xs: 8, lg: 14 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <Box
            component="img"
            src={contactBg}
            alt=""
            aria-hidden
            loading="lazy"
            sx={{
              ...revealSx(visible, 80),
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: visible ? 0.18 : 0, filter: 'grayscale(40%)', pointerEvents: 'none',
            }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0D0E11 0%, transparent 18%, transparent 82%, #0D0E11 100%)', pointerEvents: 'none', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0E11 0%, transparent 15%, transparent 85%, #0D0E11 100%)', pointerEvents: 'none', zIndex: 0 }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ ...revealSx(visible, 150), color: 'primary.main', fontSize: '0.78rem', letterSpacing: '0.35em', mb: 3, fontFamily: '"Inter", sans-serif' }}>
              {t.contact.socialsLabel}
            </Typography>

            <Typography variant="h4" sx={{ ...revealSx(visible, 250), color: '#EBEBEB', fontSize: { xs: '1.5rem', md: '1.8rem' }, mb: 6 }}>
              {t.contact.socialsHeading}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {socials.map((s, i) => (
                <Box key={s.label} sx={{ ...revealSx(visible, 360 + i * 120), borderBottom: i < socials.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none' }}>
                  <Box
                    component="a"
                    href={s.href}
                    target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    onClick={s.href.startsWith('mailto:') ? handleEmailClick : undefined}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 3, py: 3,
                      textDecoration: 'none', transition: 'all 0.2s', color: 'text.secondary', position: 'relative',
                      '&:hover': { color: s.color, pl: 1 },
                      '&:hover .copy-btn': { opacity: 1 },
                    }}
                  >
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', flexShrink: 0, transition: 'border-color 0.2s, background 0.2s', 'a:hover &': { borderColor: s.color + '60', backgroundColor: s.color + '12' } }}>
                      {s.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#C0C0C0', letterSpacing: '0.06em', lineHeight: 1.2, fontFamily: '"Inter", sans-serif' }}>
                        {s.label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: 'inherit', letterSpacing: '0.02em', mt: 0.3, fontFamily: '"Inter", sans-serif', wordBreak: 'break-all' }}>
                        {s.handle}
                      </Typography>
                    </Box>
                    <Tooltip title={copiedLabel === s.label ? t.contact.copiedTooltip : t.contact.copy} placement="left">
                      <IconButton
                        className="copy-btn"
                        onClick={(e) => handleCopy(s.label, s.handle, e)}
                        size="small"
                        sx={{
                          // Em touch não existe hover: o botão precisa ficar sempre
                          // visível, senão vira um alvo invisível que rouba o toque no link.
                          opacity: { xs: 0.6, md: 0 },
                          '@media (hover: none)': { opacity: 0.6 },
                          transition: 'opacity 0.2s',
                          color: copiedLabel === s.label ? 'success.main' : 'text.secondary',
                          flexShrink: 0,
                          '&:hover': { color: s.color, backgroundColor: s.color + '15' },
                        }}
                      >
                        {copiedLabel === s.label ? <CheckIcon sx={{ fontSize: '1rem' }} /> : <ContentCopyIcon sx={{ fontSize: '1rem' }} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.type} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} sx={{ fontSize: '0.85rem' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
