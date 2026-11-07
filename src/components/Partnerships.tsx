import { Box } from '@mui/material';
import Carousel from './ui/Carousel';
import CouponChip from './ui/CouponChip';
import Icon from './ui/Icon';
import { Section, Container, Heading } from './ui/Section';
import { Reveal } from './ui/motion';
import { useLanguage } from '../contexts/LanguageContext';
import { tokens, display, easeCss, radius } from '../theme';
import impalaImg from '../assets/banner-empresa-1170x305.jpg';
import terranovaImg from '../assets/d86c3fa9-b022-4d13-91d7-b2246a746426_logo-azul-jpg.jpg';
import roueImg from '../assets/roue_logo.svg';

interface Partnership {
  name: string;
  description: string;
  descriptionEn?: string;
  videoUrl: string;
  videoId: string;
  websiteUrl: string;
  coupon: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  imageBg?: string;
}

const PARTNERSHIPS: Partnership[] = [
  {
    name: 'Relojoaria Impala',
    description: 'Com 50 anos de história, a Relojoaria IMPALA é referência em relojoaria no Brasil, unindo tradição, curadoria criteriosa e uma experiência de compra cinco estrelas. Trabalhando com as principais marcas e acreditando que um relógio vai além de marcar o tempo: ele carrega identidade, história e propósito. O compromisso da IMPALA é oferecer conhecimento, confiança e excelência em cada detalhe — da escolha do relógio ao pós-venda!',
    descriptionEn: 'With 50 years of history, Relojoaria IMPALA is a benchmark in watchmaking in Brazil, combining tradition, careful curation, and a five-star shopping experience. Working with the leading brands and believing that a watch goes beyond telling time: it carries identity, history, and purpose. IMPALA is committed to offering knowledge, trust, and excellence in every detail — from choosing the watch to after-sales service!',
    videoUrl: 'https://youtu.be/Zhbrgj9DH_4',
    videoId: 'Zhbrgj9DH_4',
    websiteUrl: 'https://www.relojoariaimpala.com.br/',
    coupon: 'axioma',
    imageUrl: impalaImg,
    imageFit: 'contain',
    imageBg: '#000',
  },
  {
    name: 'Terranova Watches',
    description: 'Autenticidade, brasilidade e pertencimento. Terra Nova é uma marca brasileira de relógios que escolhe olhar para o Brasil com profundidade, acreditando na riqueza cultural do país não como imagem pronta, mas como campo de exploração contínua. A Terra Nova desenvolve relógios autorais, com design inédito e engenharia confiável, pensados para representar o Brasil real: plural, sofisticado e em constante movimento. Alguns são os relógios que trazem consigo uma história, mas poucos são os que nos ajudam a contar a nossa.',
    descriptionEn: 'Authenticity, Brazilianness, and belonging. Terra Nova is a Brazilian watch brand that chooses to look deeply at Brazil, believing in the country’s cultural richness not as a finished image, but as a field of continuous exploration. Terra Nova develops original watches with unique design and reliable engineering, created to represent the real Brazil: plural, sophisticated, and in constant motion. Some watches carry a story with them, but few help us tell our own.',
    videoUrl: 'https://youtu.be/BWQ7Jckc_ok',
    videoId: 'BWQ7Jckc_ok',
    websiteUrl: 'https://terranovawatches.com/',
    coupon: 'axioma',
    imageUrl: terranovaImg,
    imageFit: 'contain',
    imageBg: '#fff',
  },
  {
    name: 'Roue Watch',
    description: 'Inspirada pela era mais bela dos relógios, a marca traduz esse espírito de design neo-vintage e acabamento contemporâneo, guiados por proporção, autenticidade e movimento. Mais do que medir o tempo, é sobre viver o instante com estilo e presença.',
    descriptionEn: 'Inspired by the most beautiful era of watches, the brand translates that spirit into neo-vintage design and contemporary finishing, guided by proportion, authenticity, and movement. More than measuring time, it is about living the moment with style and presence.',
    videoUrl: 'https://youtu.be/RJU5YsRYHcQ',
    videoId: 'RJU5YsRYHcQ',
    websiteUrl: 'https://rouewatch.com.br/',
    coupon: 'axioma',
    imageUrl: roueImg,
    imageFit: 'contain',
    imageBg: '#111',
  },
];

function PartnerSlide({ p }: { p: Partnership }) {
  const { t, lang } = useLanguage();
  const description = lang === 'en' && p.descriptionEn ? p.descriptionEn : p.description;
  const thumbnail = p.imageUrl ?? (p.videoId ? `https://img.youtube.com/vi/${p.videoId}/maxresdefault.jpg` : '');

  return (
    <Box
      component="article"
      sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' },
        borderRadius: radius.media,
        overflow: 'hidden',
        backgroundColor: tokens.paper,
      }}
    >
      {/* Arte grande da marca; a camada interna anda em parallax ao arrastar */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: { xs: '4 / 3', md: 'auto' }, minHeight: { md: 380 }, backgroundColor: p.imageBg ?? '#000' }}>
        <Box data-parallax sx={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '120%' }}>
          {thumbnail && (
            <Box
              component="img"
              src={thumbnail}
              alt={p.name}
              loading="lazy"
              draggable={false}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: p.imageFit ?? 'cover',
                p: p.imageFit === 'contain' ? { xs: '6% 12%', md: '10%' } : 0,
              }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box component="h3" sx={{ ...display, m: 0, fontSize: { xs: '2rem', md: '2.8rem' }, color: tokens.white }}>
          {p.name}
        </Box>
        <Box
          component="p"
          sx={{
            m: 0,
            mt: 2,
            mb: 4,
            maxWidth: 760,
            color: tokens.muted,
            fontSize: { xs: '1rem', md: '1.08rem' },
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: { xs: 5, md: 4 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
          {p.coupon && (
            <CouponChip
              code={p.coupon.toUpperCase()}
              label={t.partnerships.couponLabel}
              copiedLabel={t.partnerships.copied}
              tooltip={t.partnerships.tooltipCopy}
              sx={{ minHeight: 46 }}
            />
          )}
          <Box
            component="a"
            href={p.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              minHeight: 46,
              px: 2.5,
              borderRadius: 999,
              backgroundColor: tokens.white,
              color: tokens.ink,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: `background-color .3s`,
              '& svg': { transition: `transform .45s ${easeCss}` },
              '@media (hover: hover)': {
                '&:hover': { backgroundColor: tokens.gold },
                '&:hover svg': { transform: 'translate(2px,-2px)' },
              },
            }}
          >
            {t.partnerships.visitSite}
            <Icon name="arrowUpRight" size={16} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Partnerships() {
  const { t } = useLanguage();

  return (
    <Section id="parcerias">
      <Container>
        <Heading
          label={t.partnerships.label}
          title={`${t.partnerships.headingPart1} ${t.partnerships.headingPart2}`}
          highlight={t.partnerships.headingPart2}
          lead={t.partnerships.subtitle}
        />
        <Reveal delay={0.1}>
          <Carousel label={t.nav.partnerships} slideWidth={{ xs: '88%', sm: '82%', md: '74%', lg: '66%' }} autoplayMs={6000}>
            {PARTNERSHIPS.map((p) => (
              <PartnerSlide key={p.name} p={p} />
            ))}
          </Carousel>
        </Reveal>
      </Container>
    </Section>
  );
}
