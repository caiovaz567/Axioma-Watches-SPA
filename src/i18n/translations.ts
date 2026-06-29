import pt_BR from './pt_BR';
import en from './en';

export type Lang = 'pt' | 'en';

export interface Translations {
  nav: {
    about: string;
    videos: string;
    partnerships: string;
    recommendations: string;
    contact: string;
  };
  hero: {
    description: string;
    tagline: string;
  };
  about: {
    label: string;
    headingLine1: string;
    headingHighlighted: string;
    body: string;
    imgAlt: string;
    pillars: Array<{ title: string; description: string }>;
  };
  videos: {
    label: string;
    heading: string;
    subtitle: string;
  };
  recommendations: {
    label: string;
    heading: string;
    subtitle: string;
    badge: string;
    visitStore: string;
    couponLabel: string;
    copied: string;
    tooltipCopy: string;
    tooltipCopied: string;
  };
  promo: {
    instagram: { title: string; description: string; button: string };
    youtube: { title: string; description: string; button: string };
  };
  partnerships: {
    label: string;
    headingPart1: string;
    headingPart2: string;
    subtitle: string;
    couponLabel: string;
    copied: string;
    watchVideo: string;
    visitSite: string;
    tooltipCopy: string;
    tooltipCopied: string;
  };
  contact: {
    label: string;
    headingLine1: string;
    headingHighlighted: string;
    body: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    socialsLabel: string;
    socialsHeading: string;
    emailDirectLabel: string;
    copy: string;
    copiedTooltip: string;
    success: string;
    error: string;
    validation: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      messageRequired: string;
    };
  };
  footer: {
    by: string;
    tagline: string;
  };
  backToTop: string;
}

const translations: Record<Lang, Translations> = { pt: pt_BR, en };

export default translations;
