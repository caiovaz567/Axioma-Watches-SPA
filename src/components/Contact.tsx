import { useRef, useState } from 'react';
import { Box, TextField, Snackbar, Alert, CircularProgress, Tooltip, ButtonBase } from '@mui/material';
import { motion } from 'motion/react';
import emailjs from '@emailjs/browser';
import { Section, Container, Heading } from './ui/Section';
import { Reveal } from './ui/motion';
import Cta from './ui/Cta';
import Icon from './ui/Icon';
import type { IconName } from './ui/Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { copyText } from '../lib/clipboard';
import { scrollToTarget } from '../lib/scroll';
import { tokens, ease, easeCss, radius } from '../theme';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

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
    open: false,
    type: 'success',
    msg: '',
  });
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [formPulse, setFormPulse] = useState(0);
  // Anti-spam: campo isca que humanos não veem + tempo mínimo de preenchimento.
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const socials: { icon: IconName; label: string; handle: string; href: string }[] = [
    { icon: 'youtube', label: 'YouTube', handle: '@axiomawatches', href: 'https://www.youtube.com/@axiomawatches' },
    { icon: 'instagram', label: 'Instagram', handle: '@axiomawatcheschannel', href: 'https://www.instagram.com/axiomawatcheschannel' },
    { icon: 'mail', label: t.contact.emailDirectLabel, handle: 'axiomawatches@gmail.com', href: 'mailto:axiomawatches@gmail.com' },
  ];

  const validate = (n: string, em: string, msg: string): FormErrors => {
    const errs: FormErrors = {};
    if (!n.trim()) errs.nome = t.contact.validation.nameRequired;
    if (!em.trim()) errs.email = t.contact.validation.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errs.email = t.contact.validation.emailInvalid;
    if (!msg.trim()) errs.mensagem = t.contact.validation.messageRequired;
    return errs;
  };

  // O e-mail direto leva ao formulário (que entrega no mesmo lugar) e dá um "pulso" nele
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) scrollToTarget(formRef.current);
    setFormPulse((n) => n + 1);
  };

  const handleCopy = (label: string, value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(null), 2000);
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setMensagem('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(nome, email, mensagem);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    // Lê o campo isca direto do DOM no envio — pega robôs que setam .value sem disparar eventos
    const honeypot = (formRef.current?.elements.namedItem('website') as HTMLInputElement | null)?.value;
    if (honeypot || Date.now() - mountedAt.current < 3000) {
      // Robô detectado: finge sucesso sem enviar, para não revelar o filtro
      setSnackbar({ open: true, type: 'success', msg: t.contact.success });
      resetForm();
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
      resetForm();
    } catch {
      setSnackbar({ open: true, type: 'error', msg: t.contact.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact">
      <Container>
        <Heading
          label={t.contact.label}
          title={`${t.contact.headingLine1} ${t.contact.headingHighlighted}`}
          highlight={t.contact.headingHighlighted}
          lead={t.contact.body}
        />

        {/* Duas colunas da mesma altura: redes (esquerda) e formulário (direita) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
          <Reveal style={{ display: 'flex' }}>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 1.5, md: 2 },
                borderRadius: radius.media,
                backgroundColor: tokens.paper,
              }}
            >
              <Box sx={{ px: { xs: 1.5, md: 2 }, pt: { xs: 1.5, md: 2 }, pb: 1, fontSize: '0.85rem', fontWeight: 600, color: tokens.muted }}>
                {t.contact.socialsHeading}
              </Box>
              {socials.map((s, i) => {
                const isMail = s.href.startsWith('mailto:');
                const copied = copiedLabel === s.label;
                return (
                  <Box
                    key={s.label}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      pr: 1,
                      position: 'relative',
                      borderRadius: '16px',
                      // Divisória reta entre as linhas (borda + cantos arredondados entortaria as pontas)
                      '&::before': i
                        ? { content: '""', position: 'absolute', top: 0, left: 16, right: 16, height: '1px', backgroundColor: tokens.hair }
                        : undefined,
                      transition: 'background-color .3s',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
                    }}
                  >
                    <Box
                      component="a"
                      href={s.href}
                      target={isMail ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      onClick={isMail ? handleEmailClick : undefined}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, sm: 2 },
                        px: { xs: 1, md: 2 },
                        py: 2.5,
                        color: tokens.white,
                        textDecoration: 'none',
                        '& .s-icon': { transition: `transform .5s ${easeCss}` },
                        '@media (hover: hover)': { '&:hover .s-icon': { transform: 'scale(1.08)' } },
                      }}
                    >
                      <Box
                        className="s-icon"
                        sx={{
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          flexShrink: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: tokens.goldA(0.14),
                          color: tokens.gold,
                        }}
                      >
                        <Icon name={s.icon} size={22} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ fontSize: '0.82rem', color: tokens.muted }}>{s.label}</Box>
                        <Box sx={{ fontWeight: 600, fontSize: { xs: 'clamp(0.78rem, 3.75vw, 0.9rem)', sm: '1rem', md: '1.08rem' }, overflowWrap: 'anywhere' }}>{s.handle}</Box>
                      </Box>
                    </Box>
                    <Tooltip title={copied ? t.contact.copiedTooltip : t.contact.copy} placement="left">
                      <ButtonBase
                        onClick={(e) => handleCopy(s.label, s.handle, e)}
                        aria-label={`${t.contact.copy} ${s.handle}`}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          flexShrink: 0,
                          color: copied ? 'success.main' : tokens.faint,
                          transition: 'color .3s, background-color .3s',
                          '&:hover': { color: copied ? 'success.main' : tokens.white, backgroundColor: 'rgba(255,255,255,0.06)' },
                        }}
                      >
                        <Icon name={copied ? 'check' : 'copy'} size={18} />
                      </ButtonBase>
                    </Tooltip>
                  </Box>
                );
              })}
            </Box>
          </Reveal>

          <Reveal delay={0.1} style={{ display: 'flex' }}>
            <Box sx={{ flex: 1, position: 'relative', p: { xs: 2.5, sm: 4, md: 5 }, borderRadius: radius.media, backgroundColor: tokens.paper }}>
              {/* Pulso dourado quando o usuário clica em "e-mail direto" */}
              <motion.div
                key={formPulse}
                aria-hidden
                initial={{ opacity: formPulse ? 1 : 0 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.8, ease, delay: 0.7 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 24,
                  boxShadow: `0 0 0 2px ${tokens.gold}, 0 0 60px ${tokens.goldA(0.18)}`,
                  pointerEvents: 'none',
                }}
              />
              <Box
                component="form"
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', scrollMarginTop: { xs: 96, md: 120 } }}
              >
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

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label={t.contact.namePlaceholder}
                    name="nome"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      setErrors((p) => ({ ...p, nome: undefined }));
                    }}
                    error={!!errors.nome}
                    helperText={errors.nome}
                  />
                  <TextField
                    label={t.contact.emailPlaceholder}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Box>
                <TextField
                  label={t.contact.messagePlaceholder}
                  name="mensagem"
                  multiline
                  minRows={5}
                  value={mensagem}
                  onChange={(e) => {
                    setMensagem(e.target.value);
                    setErrors((p) => ({ ...p, mensagem: undefined }));
                  }}
                  error={!!errors.mensagem}
                  helperText={errors.mensagem}
                  // Ocupa a sobra de altura: o cartão do formulário fica do tamanho do das redes
                  sx={{ mt: 2, flex: 1, '& .MuiFilledInput-root': { height: '100%', alignItems: 'flex-start' } }}
                />

                <Box data-fab-avoid sx={{ mt: 3 }}>
                <Cta
                  type="submit"
                  size="lg"
                  disabled={loading}
                  icon={loading ? null : 'arrowRight'}
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                    {loading && <CircularProgress size={16} color="inherit" />}
                    {loading ? t.contact.sending : t.contact.send}
                  </Box>
                </Cta>
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.type} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Section>
  );
}
