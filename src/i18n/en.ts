import type { Translations } from './translations';

const en: Translations = {
  nav: {
    about: 'About',
    videos: 'Videos',
    partnerships: 'Partnerships',
    recommendations: 'Recommendations',
    contact: 'Contact',
  },
  hero: {
    description: 'A space dedicated to fine watchmaking and constant sharing of content related to the hobby.',
    tagline: 'Always adding value. Keeping truth in all information presented.',
  },
  about: {
    label: 'ABOUT THE CHANNEL',
    headingLine1: 'The',
    headingHighlighted: 'Axioma Watches Universe',
    body: 'Created by Claudio Vaz, Axioma Watches is a channel dedicated to the world of watchmaking — where watches are not just timepieces, but stories, friendships, and connections.',
    imgAlt: 'Wristwatch at sunset',
    pillars: [
      {
        title: 'True Information',
        description: 'Commitment to accuracy and honesty in all reviews, analyses, and information presented on the channel.',
      },
      {
        title: 'Always Adding Value',
        description: 'Every video is crafted to bring real value to watch enthusiasts, whether beginners or experienced collectors.',
      },
    ],
  },
  videos: {
    label: 'LATEST VIDEOS',
    heading: 'Check out the latest content from the channel',
    subtitle: 'New videos every week — reviews, analyses, and more about the world of watchmaking.',
  },
  recommendations: {
    label: 'RECOMMENDATIONS',
    heading: 'Watches recommended',
    subtitle: 'A personal curation of watches that are worth every penny — tested, approved, and recommended with transparency alongside our partners.',
    badge: 'RECOMMENDED',
    visitStore: 'VIEW IN STORE',
    couponLabel: 'COUPON',
    copied: 'COPIED!',
    tooltipCopy: 'Tap to copy coupon',
    tooltipCopied: 'Coupon copied!',
  },
  promo: {
    instagram: {
      title: 'Promotion and Partnership',
      description: 'Reach an audience passionate about fine watchmaking. The channel promotes brands, stores, and launches on Instagram with a negotiable fee based on the project.',
      button: 'Contact on Instagram',
    },
    youtube: {
      title: 'Reviews and Content',
      description: 'Detailed technical reviews, comparisons, and product presentations on the YouTube channel. Legitimate, informative content for enthusiasts, collectors, and industry professionals. Negotiable fee.',
      button: 'Visit the Channel',
    },
  },
  partnerships: {
    label: 'PARTNERSHIPS',
    headingPart1: 'Completed',
    headingPart2: 'Projects',
    subtitle: 'Partnerships with brands in the segment — use the exclusive coupon to enjoy special conditions.',
    couponLabel: 'COUPON',
    copied: 'COPIED!',
    watchVideo: 'WATCH THE VIDEO',
    visitSite: 'VISIT SITE',
    tooltipCopy: 'Tap to copy the coupon',
    tooltipCopied: 'Coupon copied!',
  },
  contact: {
    label: 'CONTACT',
    headingLine1: 'Talk to the',
    headingHighlighted: 'Channel',
    body: "Have a question, content suggestion, or anything related to fine watchmaking? Fill out the form, send your message, and we'll get back to you shortly!",
    namePlaceholder: 'Name',
    emailPlaceholder: 'Your e-mail',
    messagePlaceholder: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    socialsLabel: 'SOCIAL MEDIA',
    socialsHeading: 'Follow Us',
    emailDirectLabel: 'Direct e-mail',
    copy: 'Copy',
    copiedTooltip: 'Copied!',
    success: 'Message sent successfully!',
    error: 'Error sending. Please try again or use the direct email.',
    validation: {
      nameRequired: 'Please enter your name.',
      emailRequired: 'Please enter your email.',
      emailInvalid: 'Please enter a valid email.',
      messageRequired: 'Please write your message.',
    },
  },
  footer: {
    by: 'By Claudio Vaz',
    tagline: 'A space dedicated to fine watchmaking, always.',
  },
  backToTop: 'Back to top',
};

export default en;
