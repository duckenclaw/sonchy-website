import { useCallback, useRef, useState } from 'react';

import { useIsMobile } from '@/hooks/use-is-mobile';
import LectureCard from './lecture-card';
import type { Lecture } from './lecture';

interface LectureSliderProps {
  lectures: Lecture[];
  onDetailsClick: (lecture: Lecture, position: number) => void;
  onBuyClick: (lecture: Lecture) => void;
}

/** How many cards fit side by side on desktop. */
const VISIBLE_COUNT = 4;

/**
 * Desktop slides a track of four cards with arrow buttons; mobile scrolls the
 * container horizontally instead, one card at a time.
 */
function LectureSlider({ lectures, onDetailsClick, onBuyClick }: LectureSliderProps) {
  const [startIndex, setStartIndex] = useState(0);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollMobile = useCallback((direction: -1 | 1) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: direction * container.clientWidth, behavior: 'smooth' });
  }, []);

  const handlePrevious = useCallback(() => {
    if (isMobile) scrollMobile(-1);
    else setStartIndex((prev) => Math.max(0, prev - 1));
  }, [isMobile, scrollMobile]);

  const handleNext = useCallback(() => {
    if (isMobile) scrollMobile(1);
    else setStartIndex((prev) => Math.min(lectures.length - VISIBLE_COUNT, prev + 1));
  }, [isMobile, scrollMobile, lectures.length]);

  return (
    <div className="lecture-slider-outer">
      <div className="lecture-slider-mobile-title">ОБУЧЕНИЕ</div>

      <div className="lecture-slider">
        <button
          type="button"
          className="lecture-slider-arrow lecture-slider-arrow-left"
          onClick={handlePrevious}
          disabled={!isMobile && startIndex === 0}
          aria-label="Previous lectures"
        >
          <img src="/ui/arrow-left.svg" alt="" />
        </button>

        <div className="lecture-slider-wrapper">
          <h2 className="lecture-slider-title">ЛЕКЦИИ</h2>
          <div className="lecture-slider-container" ref={containerRef}>
            <div
              className="lecture-slider-cards"
              style={{
                transform: isMobile
                  ? 'none'
                  : `translateX(calc(-${startIndex} * ((100% - 4.5rem) / 4 + 1.5rem)))`,
              }}
            >
              {lectures.map((lecture, index) => (
                <LectureCard
                  key={lecture.id}
                  lecture={lecture}
                  onDetailsClick={() =>
                    onDetailsClick(lecture, (index - startIndex) % VISIBLE_COUNT)
                  }
                  onBuyClick={() => onBuyClick(lecture)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="lecture-slider-arrow lecture-slider-arrow-right"
          onClick={handleNext}
          disabled={!isMobile && startIndex >= lectures.length - VISIBLE_COUNT}
          aria-label="Next lectures"
        >
          <img src="/ui/arrow-left.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export default LectureSlider;
