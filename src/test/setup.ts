import '@testing-library/jest-dom/vitest';

/**
 * jsdom implements neither matchMedia nor ResizeObserver, and the hooks under
 * test call both. Default to a desktop, hover-capable viewport; individual
 * tests override `matchMedia` when they need mobile.
 */
window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
