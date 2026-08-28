import { useMediaQuery } from './use-media-query';

/**
 * No hover, a coarse pointer, or simply a phone-width viewport. Feature
 * queries beat `'ontouchstart' in window` here: that — and `maxTouchPoints` —
 * are true on any touchscreen laptop, which does have a cursor worth
 * decorating.
 */
const TOUCH_QUERY = '(hover: none), (pointer: coarse), (max-width: 768px)';

/**
 * True on phones and tablets. Used to switch off the cursor-driven
 * decorations, which have no meaning without a pointer.
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery(TOUCH_QUERY);
}
