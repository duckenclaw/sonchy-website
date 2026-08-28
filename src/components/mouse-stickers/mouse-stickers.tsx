import { useEffect, useRef, useState } from 'react';

import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import { STICKER_COLORS, STICKER_PATH, STICKER_VIEW_BOX } from './sticker-palette';
import './mouse-stickers.css';

interface Sticker {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  expiresAt: number;
}

const THROTTLE_MS = 30;
/** Must stay in step with the `sticker-fade` animation in mouse-stickers.css. */
const LIFETIME_MS = 2500;
const FADE_MS = 500;
const SWEEP_MS = 250;
const MIN_SIZE = 15;
const MAX_SIZE = 80;

/** Symbol id for the single star definition every sticker points at. */
const STAR_SYMBOL_ID = 'mouse-sticker-star';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pickColor(): string {
  return STICKER_COLORS[Math.floor(Math.random() * STICKER_COLORS.length)];
}

/**
 * Scatters crayon stars along the cursor's path on the landing page.
 * Disabled on touch devices, where there is no cursor to follow.
 *
 * Fading is a CSS animation rather than a per-frame opacity calculation: React
 * only ever adds a sticker and later drops it, and the star geometry is defined
 * once as an SVG <symbol> so the ~80 live stickers are cheap <use> nodes rather
 * than 80 copies of a 2KB path.
 */
function MouseStickers() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const lastAddedAt = useRef(0);
  const nextId = useRef(0);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastAddedAt.current < THROTTLE_MS) return;
      lastAddedAt.current = now;

      setStickers((prev) => [
        ...prev,
        {
          id: nextId.current++,
          x: e.clientX,
          y: e.clientY,
          size: randomBetween(MIN_SIZE, MAX_SIZE),
          rotation: Math.random() * 360,
          color: pickColor(),
          expiresAt: now + LIFETIME_MS + FADE_MS,
        },
      ]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return;

    const sweep = setInterval(() => {
      const now = Date.now();
      setStickers((prev) => {
        const live = prev.filter((sticker) => sticker.expiresAt > now);
        // Skip the re-render entirely when nothing has expired.
        return live.length === prev.length ? prev : live;
      });
    }, SWEEP_MS);

    return () => clearInterval(sweep);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div className="mouse-stickers" aria-hidden="true">
      <svg className="mouse-stickers-defs" viewBox={STICKER_VIEW_BOX}>
        <symbol id={STAR_SYMBOL_ID} viewBox={STICKER_VIEW_BOX}>
          <path opacity="0.9" d={STICKER_PATH} />
        </symbol>
      </svg>

      {stickers.map((sticker) => (
        <svg
          key={sticker.id}
          className="mouse-sticker"
          width={sticker.size}
          height={sticker.size}
          viewBox={STICKER_VIEW_BOX}
          fill={sticker.color}
          style={{
            left: sticker.x - sticker.size / 2,
            top: sticker.y - sticker.size / 2,
            transform: `rotate(${sticker.rotation}deg)`,
          }}
        >
          <use href={`#${STAR_SYMBOL_ID}`} />
        </svg>
      ))}
    </div>
  );
}

export default MouseStickers;
