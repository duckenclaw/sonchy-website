import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query and re-renders when it starts or stops
 * matching. The initial value is read synchronously so the first paint already
 * agrees with the stylesheets.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    // The query may have flipped between render and this effect.
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}
