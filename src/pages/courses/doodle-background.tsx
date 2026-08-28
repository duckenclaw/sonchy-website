import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Long, horizontally elongated hand-drawn spirals. The viewBox is 1000×200 —
 * wide and short — so each spiral sprawls sideways across the page.
 */
const SPIRAL_PATHS = [
  // Loose horizontal coil winding left-to-right
  'M 20 100 C 80 20, 160 180, 240 100 S 400 20, 480 100 S 640 180, 720 100 S 880 20, 980 100',
  // Bigger looping spiral with a curl at the end
  'M 10 110 C 100 30, 200 30, 300 110 S 500 190, 600 110 S 800 30, 900 110 Q 950 160, 880 170 Q 820 175, 840 110',
  // Long meandering wavy curl
  'M 980 90 C 900 170, 800 10, 700 90 S 500 170, 400 90 S 200 10, 100 90 Q 30 130, 80 160 Q 130 175, 150 120',
  // Tight cluster in middle with tails extending out
  'M 20 120 Q 200 60, 400 120 C 500 150, 580 60, 500 90 S 400 150, 480 130 Q 600 100, 700 120 Q 900 140, 980 80',
  // Long flowing S-curve with extra loop
  'M 10 100 C 150 10, 300 190, 450 100 Q 550 40, 600 80 Q 650 130, 580 130 Q 540 120, 600 100 S 800 180, 990 100',
  // Vertical loops marching across
  'M 30 100 Q 80 20, 130 100 Q 180 180, 230 100 Q 280 20, 330 100 Q 380 180, 430 100 Q 480 20, 530 100 Q 580 180, 630 100 Q 680 20, 730 100 Q 780 180, 830 100 Q 880 20, 970 100',
];

/**
 * Positions spread down the page, deliberately skipping the plan section
 * (roughly 68%–87% of page height) so the doodles don't cross its rows.
 */
const DOODLES = [
  { path: SPIRAL_PATHS[0], top: '6%', rotation: -3 },
  { path: SPIRAL_PATHS[1], top: '16%', rotation: 4 },
  { path: SPIRAL_PATHS[2], top: '26%', rotation: -2 },
  { path: SPIRAL_PATHS[3], top: '38%', rotation: 5 },
  { path: SPIRAL_PATHS[4], top: '50%', rotation: -4 },
  { path: SPIRAL_PATHS[5], top: '62%', rotation: 3 },
  { path: SPIRAL_PATHS[0], top: '93%', rotation: -3, flip: true },
];

interface DoodleBackgroundProps {
  /** The scrolling page element the doodle layer has to match in height. */
  pageRef: RefObject<HTMLElement | null>;
}

/** Tracks the full scroll height of an element, including its children. */
function useScrollHeight(ref: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => setHeight(element.scrollHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    // Sections grow independently of the container, so watch them too.
    for (const child of element.children) {
      if (child instanceof HTMLElement) observer.observe(child);
    }

    return () => observer.disconnect();
  }, [ref]);

  return height;
}

/** The scribbled gold spirals drifting behind the whole Courses page. */
function DoodleBackground({ pageRef }: DoodleBackgroundProps) {
  const height = useScrollHeight(pageRef);

  return (
    <div
      className="c2-doodles"
      aria-hidden="true"
      style={height ? { height: `${height}px` } : undefined}
    >
      {DOODLES.map((doodle, i) => (
        <svg
          key={i}
          className="c2-doodle"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            top: doodle.top,
            transform: `translateX(-50%) rotate(${doodle.rotation}deg)${
              doodle.flip ? ' scaleX(-1)' : ''
            }`,
          }}
        >
          <path
            d={doodle.path}
            fill="none"
            stroke="#F5D381"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
    </div>
  );
}

export default DoodleBackground;
