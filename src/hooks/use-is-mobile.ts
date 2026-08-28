import { useMediaQuery } from './use-media-query';

/** Matches the `max-width: 768px` breakpoint the stylesheets use. */
const MOBILE_QUERY = '(max-width: 768px)';

/** Tracks whether the viewport is currently at mobile width. */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
