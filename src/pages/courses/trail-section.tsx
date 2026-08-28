import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const THROTTLE_MS = 8;
const TRAIL_LIFETIME_MS = 3500;
const MAX_POINTS = 400;

interface TrailSectionProps {
  className?: string;
  /** The trail is pointer-driven, so it is switched off on touch devices. */
  isTouch: boolean;
  children: ReactNode;
}

/** Turns a list of points into a smoothed path through their midpoints. */
function toPath(points: TrailPoint[]): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const previous = points[i - 1];
    const midX = (previous.x + current.x) / 2;
    const midY = (previous.y + current.y) / 2;

    if (i === 1) path += ` L ${midX} ${midY}`;
    else path += ` Q ${previous.x} ${previous.y} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

/**
 * Wraps a section so the cursor paints a fading pink-to-green brush stroke
 * across it.
 *
 * The trail is deliberately kept out of React state. At 400 points and a
 * pointer sampled every 8ms, re-rendering per sample meant ~125 renders a
 * second of a subtree that also carries an feTurbulence filter. Instead the
 * points live in a ref and a single requestAnimationFrame loop writes the `d`
 * attribute straight to the path, so the section renders once and repaints on
 * the browser's own frame clock.
 */
function TrailSection({ className = '', isTouch, children }: TrailSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const points = useRef<TrailPoint[]>([]);
  const lastAddedAt = useRef(0);
  const frame = useRef(0);

  // Only the gradient needs the measured width, and only when the box resizes.
  const [width, setWidth] = useState(0);

  const id = useId();
  const gradientId = `trail-gradient-${id}`;
  const filterId = `trail-rough-${id}`;

  const paint = useCallback(() => {
    const now = Date.now();
    points.current = points.current.filter((p) => now - p.timestamp < TRAIL_LIFETIME_MS);

    const path = pathRef.current;
    if (path) {
      const d = toPath(points.current);
      path.setAttribute('d', d);
      path.style.visibility = d ? 'visible' : 'hidden';
    }

    // Idle when the trail has faded out; the next pointer move restarts it.
    frame.current = points.current.length ? requestAnimationFrame(paint) : 0;
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !containerRef.current) return;

    const now = Date.now();
    if (now - lastAddedAt.current < THROTTLE_MS) return;
    lastAddedAt.current = now;

    const rect = containerRef.current.getBoundingClientRect();
    points.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, timestamp: now });
    if (points.current.length > MAX_POINTS) points.current.shift();

    if (!frame.current) frame.current = requestAnimationFrame(paint);
  };

  return (
    <div
      ref={containerRef}
      className={`c2-trail-section ${className}`}
      onMouseMove={handleMouseMove}
    >
      <svg className="c2-trail-svg" aria-hidden="true">
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2={width}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFAFE4" />
            <stop offset="48%" stopColor="#FFAFE4" />
            <stop offset="52%" stopColor="#87E0B3" />
            <stop offset="100%" stopColor="#87E0B3" />
          </linearGradient>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <path
          ref={pathRef}
          stroke={`url(#${gradientId})`}
          strokeWidth="40"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.5"
          filter={`url(#${filterId})`}
          style={{ visibility: 'hidden' }}
        />
      </svg>
      {children}
    </div>
  );
}

export default TrailSection;
