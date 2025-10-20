/**
 * Type definitions for component props across the application
 */

export interface NavigationButton {
  label: string;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

export interface ContentSection {
  title: string;
  subtitle?: string;
  content: string[];
}

export interface SpeechBubbleProps {
  text: string;
  alignment?: 'start' | 'end';
  className?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}
