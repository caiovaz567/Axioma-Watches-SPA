import { createTheme } from '@mui/material/styles';

/**
 * Paleta da marca (mantida desde o site original) + tokens.
 * Os componentes importam daqui em vez de repetir hex/rgba soltos.
 */
export const tokens = {
  ink: '#0D0E11',
  inkDeep: '#08090B',
  paper: '#151820',
  paperHi: '#1C2029',
  gold: '#C9A84C',
  goldLight: '#E8C96A',
  goldDark: '#9A7A2E',
  steel: '#8EAFC2',
  white: '#F5F5F3',
  text: '#E8E8E8',
  muted: '#A0A8B4',
  faint: 'rgba(232,232,232,0.5)',
  hair: 'rgba(232,232,232,0.12)',
  goldA: (a: number) => `rgba(201,168,76,${a})`,
  inkA: (a: number) => `rgba(13,14,17,${a})`,
} as const;

/** Uma família só (Archivo, sem serifa). Títulos usam a versão levemente mais larga. */
export const font = '"Archivo", "Helvetica Neue", Arial, sans-serif';

/** Título grande: pesado, apertado, um pouco expandido — cara de marca esportiva */
export const display = {
  fontFamily: font,
  fontWeight: 700,
  fontStretch: '108%',
  letterSpacing: '-0.035em',
  lineHeight: 0.95,
} as const;

/** Rótulo pequeno acima dos títulos */
export const eyebrow = {
  fontFamily: font,
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  lineHeight: 1.4,
};

/** Curva de desaceleração usada em todas as animações */
export const ease = [0.16, 1, 0.3, 1] as const;
export const easeCss = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** Margem lateral do site — 20px no celular */
export const gutter = { xs: 2.5, sm: 4, md: 5, lg: 6 } as const;
export const maxWidth = 1440;
export const radius = { card: '20px', media: '24px' } as const;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: tokens.gold, light: tokens.goldLight, dark: tokens.goldDark, contrastText: tokens.ink },
    secondary: { main: tokens.steel },
    background: { default: tokens.ink, paper: tokens.paper },
    text: { primary: tokens.text, secondary: tokens.muted },
    divider: tokens.hair,
    success: { main: '#7FB685' },
    error: { main: '#E07A6B' },
  },
  typography: {
    fontFamily: font,
    button: { fontFamily: font, fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: tokens.ink } } },
    // Sem a "ondinha" do Material: cada botão já tem seu próprio retorno de hover/toque
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontFamily: font, fontSize: '0.75rem', fontWeight: 500, backgroundColor: tokens.white, color: tokens.ink, borderRadius: 8, padding: '6px 10px' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'filled', fullWidth: true } },
    MuiFilledInput: {
      defaultProps: { disableUnderline: true },
      styleOverrides: {
        root: {
          fontFamily: font,
          borderRadius: 14,
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'border-color .25s, background-color .25s',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.07)' },
          '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.07)', borderColor: tokens.gold },
          '&.Mui-error': { borderColor: '#E07A6B' },
        },
        input: { color: tokens.white, fontSize: '1rem' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: font, color: tokens.muted, '&.Mui-focused': { color: tokens.gold } },
      },
    },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: font, fontSize: '0.8rem', marginLeft: 4 } } },
    MuiAlert: { styleOverrides: { root: { fontFamily: font, borderRadius: 12, alignItems: 'center' } } },
  },
});

export default theme;
