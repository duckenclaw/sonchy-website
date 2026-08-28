import { useCallback, useEffect, useRef, useState } from 'react';

import type { TierId } from './courses-data';

/** Every purchase button on the page, so the animation can target just one. */
export type LaunchTarget = `sticky-${TierId}` | `tariff-${TierId}` | 'cards';

interface Star {
  id: number;
  tx: number;
  ty: number;
  hueRotate: number;
  size: number;
  delay: number;
  rotation: number;
  startLeft: number;
}

const STAR_COUNT = 40;
const STAR_HUES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/**
 * How long before a launched button is restored: the pill animates for 1.6s and
 * the last star carries a 0.975s stagger on top of its own 1.6s run.
 */
const LAUNCH_RESET_MS = 2600;

/** Monotonic, so two launches in the same millisecond cannot collide on keys. */
let nextStarId = 0;

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.6;
    const distance = 180 + Math.random() * 240;

    return {
      id: nextStarId++,
      tx: Math.sin(angle) * distance,
      ty: -Math.abs(Math.cos(angle) * distance),
      hueRotate: STAR_HUES[Math.floor(Math.random() * STAR_HUES.length)],
      size: 30 + Math.random() * 50,
      delay: i * 0.025,
      rotation: Math.random() * 360,
      startLeft: 50 + (Math.random() - 0.5) * 30,
    };
  });
}

/**
 * Drives the "buy" buttons: the pill rockets off the page in a shower of stars
 * while the payment link opens in a new tab, then everything resets.
 */
export function useRocketLaunch() {
  const [launching, setLaunching] = useState<LaunchTarget | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const resetTimer = useRef<number | null>(null);
  /**
   * The guard has to be a ref, not the `launching` state: two clicks dispatched
   * in the same tick both read the pre-update state and would each open a
   * payment tab. A ref is written synchronously, so the second click loses.
   */
  const isLaunching = useRef(false);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const launch = useCallback((target: LaunchTarget, href: string) => {
    if (isLaunching.current) return;
    isLaunching.current = true;

    setLaunching(target);
    setStars(createStars());
    window.open(href, '_blank', 'noopener,noreferrer');

    // c2-launch ends at opacity 0 with fill-mode forwards, so without this
    // the button stays invisible once the user returns from the payment tab.
    resetTimer.current = window.setTimeout(() => {
      isLaunching.current = false;
      setLaunching(null);
      setStars([]);
    }, LAUNCH_RESET_MS);
  }, []);

  /** Renders the star burst, but only for the button that was pressed. */
  const renderStars = useCallback(
    (target: LaunchTarget) => {
      if (launching !== target) return null;

      return stars.map((star) => (
        <img
          key={star.id}
          src="/ui/star.svg"
          className="c2-rocket-star"
          alt=""
          style={
            {
              left: `${star.startLeft}%`,
              top: '50%',
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--star-hue': `${star.hueRotate}deg`,
              '--star-rotation': `${star.rotation}deg`,
              '--star-tx': `${star.tx}px`,
              '--star-ty': `${star.ty}px`,
              animationDelay: `${star.delay}s`,
            } as React.CSSProperties
          }
        />
      ));
    },
    [launching, stars],
  );

  return { launching, launch, renderStars };
}
