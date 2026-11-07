import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens, font } from '../../theme';

/**
 * Mostrador de relógio de mergulho desenhado em vetor (SVG + gradientes CSS).
 * Substitui a foto de fundo da Divulgação: não tem resolução, fica nítido em
 * qualquer tela. O ponteiro de segundos gira de verdade (animação CSS, roda
 * na placa de vídeo; desligada com "reduzir movimento").
 */

const C = 500; // centro do desenho (viewBox 1000x1000)

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
};

function Bezel() {
  const els = [];
  // Números do bezel a cada 10 minutos (de cabeça para baixo na metade de baixo, como no real)
  for (const m of [10, 20, 30, 40, 50]) {
    const a = m * 6;
    const p = polar(468, a);
    els.push(
      <text
        key={`n${m}`}
        x={p.x}
        y={p.y}
        transform={`rotate(${a} ${p.x} ${p.y})`}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={font}
        fontWeight={700}
        fontSize={44}
        letterSpacing={-1}
        fill="#E9E4D6"
        opacity={0.88}
      >
        {m}
      </text>,
    );
  }
  // Traços: cada minuto nos primeiros 15, depois a cada 5 (onde não há número)
  for (let m = 1; m < 60; m++) {
    const isNum = m % 10 === 0;
    if (isNum) continue;
    if (m > 15 && m % 5 !== 0) continue;
    const five = m % 5 === 0;
    const r0 = five ? 448 : 458;
    const p0 = polar(r0, m * 6);
    const p1 = polar(488, m * 6);
    els.push(
      <line key={`t${m}`} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#E9E4D6" strokeOpacity={0.8} strokeWidth={five ? 9 : 4} />,
    );
  }
  return (
    <g>
      <circle cx={C} cy={C} r={496} fill="url(#bezelCeramic)" />
      <circle cx={C} cy={C} r={496} fill="none" stroke="#3A3F4B" strokeWidth={3} />
      <circle cx={C} cy={C} r={441} fill="none" stroke={tokens.gold} strokeOpacity={0.35} strokeWidth={2} />
      {els}
      {/* Triângulo do 12 com o ponto de lume */}
      <path d={`M${C - 30},${10} L${C + 30},${10} L${C},${62} Z`} fill="#E9E4D6" opacity={0.92} />
      <circle cx={C} cy={30} r={9} fill={tokens.gold} />
    </g>
  );
}

function Dial() {
  const idx = [];
  for (let h = 1; h <= 12; h++) {
    const a = h * 30;
    const wide = h % 3 === 0;
    const w = wide ? 30 : 22;
    const make = (dx: number, key: string) => (
      <g key={key} transform={`rotate(${a} ${C} ${C})`}>
        <rect x={C - w / 2 + dx} y={C - 398} width={w} height={70} rx={3} fill="url(#indexGold)" />
        <rect x={C - w / 2 + dx + 6} y={C - 390} width={w - 12} height={54} rx={2} fill="#EDE8DA" opacity={0.85} />
      </g>
    );
    if (h === 12) {
      idx.push(make(-19, 'i12a'), make(19, 'i12b'));
    } else {
      idx.push(make(0, `i${h}`));
    }
  }
  // Trilho de minutos
  const track = [];
  for (let m = 0; m < 60; m++) {
    if (m % 5 === 0) continue;
    const p0 = polar(412, m * 6);
    const p1 = polar(426, m * 6);
    track.push(<line key={m} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#E9E4D6" strokeOpacity={0.45} strokeWidth={2.5} />);
  }
  return (
    <g>
      {track}
      {idx}
      <text x={C} y={262} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={36} letterSpacing={9} fill="#EDE8DA">
        AXIOMA
      </text>
      <text x={C} y={296} textAnchor="middle" fontFamily={font} fontWeight={500} fontSize={15} letterSpacing={6} fill={tokens.gold}>
        AUTOMATIC
      </text>
      <text x={C} y={712} textAnchor="middle" fontFamily={font} fontWeight={500} fontSize={15} letterSpacing={5} fill="#EDE8DA" opacity={0.7}>
        300m / 1000ft
      </text>
    </g>
  );
}

function Hands() {
  // Ponteiros dauphine facetados (metade clara, metade escura), marcando 10:09
  const dauphine = (len: number, wide: number, at: number, key: string) => (
    <g key={key} transform={`rotate(${at} ${C} ${C})`} filter="url(#handShadow)">
      <path d={`M${C},${C - len} L${C - wide},${C - len * 0.2} L${C},${C + 34} Z`} fill={tokens.goldLight} />
      <path d={`M${C},${C - len} L${C + wide},${C - len * 0.2} L${C},${C + 34} Z`} fill={tokens.goldDark} />
      <path d={`M${C},${C - len + 26} L${C - wide * 0.35},${C - len * 0.3} L${C + wide * 0.35},${C - len * 0.3} Z`} fill="#EDE8DA" opacity={0.85} />
    </g>
  );
  return (
    <g>
      {dauphine(232, 15, 304.5, 'h')}
      {dauphine(372, 11, 54, 'm')}
      <g className="dial-seconds" filter="url(#handShadow)">
        <rect x={C - 2} y={C - 400} width={4} height={460} fill={tokens.gold} />
        <circle cx={C} cy={C - 330} r={11} fill="#0E1118" stroke={tokens.gold} strokeWidth={4} />
        <circle cx={C} cy={C + 48} r={15} fill={tokens.gold} />
      </g>
      <circle cx={C} cy={C} r={17} fill={tokens.gold} />
      <circle cx={C} cy={C} r={6} fill="#0E1118" />
    </g>
  );
}

export default function DialArt({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box aria-hidden sx={[{ position: 'relative', aspectRatio: '1 / 1', borderRadius: '50%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {/* Mostrador "sunburst": raios finos + brilho que muda com o ângulo */}
      <Box
        sx={{
          position: 'absolute',
          inset: '6.4%',
          borderRadius: '50%',
          background: [
            'conic-gradient(from 210deg, rgba(255,255,255,0.13), rgba(255,255,255,0) 22%, rgba(255,255,255,0.07) 48%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.13))',
            'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.05) 0deg 0.45deg, rgba(255,255,255,0) 0.45deg 0.9deg)',
            'radial-gradient(circle at 50% 50%, #1C2538 0%, #121828 50%, #0A0D15 100%)',
          ].join(', '),
        }}
      />
      <Box component="svg" viewBox="0 0 1000 1000" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="bezelCeramic" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#262B36" />
            <stop offset="70%" stopColor="#14171E" />
            <stop offset="100%" stopColor="#0B0D12" />
          </radialGradient>
          <linearGradient id="indexGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={tokens.goldLight} />
            <stop offset="50%" stopColor={tokens.goldLight} />
            <stop offset="50.1%" stopColor={tokens.goldDark} />
            <stop offset="100%" stopColor={tokens.goldDark} />
          </linearGradient>
          <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.55" />
          </filter>
          <radialGradient id="glass" cx="30%" cy="22%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.09" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Bezel por baixo, mostrador (camada CSS) aparece pelo "furo" */}
        <mask id="bezelHole">
          <rect width="1000" height="1000" fill="#fff" />
          <circle cx={C} cy={C} r={436} fill="#000" />
        </mask>
        <g mask="url(#bezelHole)">
          <Bezel />
        </g>
        <Dial />
        <Hands />
        <circle cx={C} cy={C} r={436} fill="url(#glass)" />
      </Box>
    </Box>
  );
}
