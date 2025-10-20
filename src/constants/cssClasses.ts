/**
 * Centralized CSS class name constants to avoid duplication
 * and improve maintainability across components.
 */

export const CSS_CLASSES = {
  // Layout
  APP: 'app',
  CONTENT_WRAPPER: 'lectures-wrapper', // Generic name used for multiple sections
  CONTENT_CONTAINER: 'lectures-container',
  CONTENT_INNER: 'lectures-content-inner',
  CONTENT: 'lectures-content',

  // Components
  SPEECH_BUBBLE: 'speech-bubble',
  SPEECH_BUBBLE_BOTTOM: 'bottom',
  BOTTOM_SECTION: 'bottom-section',
  PRICE: 'price',

  // Buttons
  CONTACT_BUTTON: 'contact-button',
  PORTFOLIO_BUTTON: 'portfolio-button',
  PORTFOLIO_BUTTON_MOBILE: 'portfolio-button-mobile',
  BACK_BUTTON: 'lectures-back-button',
  HOME_BUTTON: 'lectures-home-button',

  // Desktop/Mobile variants
  DESKTOP: 'lectures-desktop',
  MOBILE: 'lectures-mobile',
  PROJECTS_DESKTOP: 'projects-desktop',
  PROJECTS_MOBILE: 'projects-mobile',

  // Mobile specific
  MOBILE_TITLE: 'lectures-mobile-title',
  PROJECTS_MOBILE_TITLE: 'projects-mobile-title',
  MOBILE_CHARACTER: 'lectures-mobile-character',
  PROJECTS_MOBILE_CHARACTER: 'projects-mobile-character',

  // Images
  LECTURES_IMAGE: 'lectures-image',
  PROJECTS_IMAGE: 'projects-image',
  LOGOS: 'logos',
  LOGOS_MOBILE: 'logos-mobile',

  // Backgrounds
  CONTENT_BG: 'lectures-content-bg',

  // Page backgrounds
  PAGE_BG_CONSULTING: 'consulting-page-background',
  PAGE_BG_SERVICES: 'services-page-background',

  // Header
  HEADER_DESKTOP_ONLY: 'header-desktop-only',
} as const;

export type CSSClassName = typeof CSS_CLASSES[keyof typeof CSS_CLASSES];
