import { useCallback, useEffect, useRef, useState } from 'react';

import { useFocusTrap } from '@/hooks/use-focus-trap';
import type { Lecture } from './lecture';

interface LectureModalProps {
  lecture: Lecture | null;
  isOpen: boolean;
  /** Column the card was in, so the modal grows out of the right place. */
  position: number;
  onClose: () => void;
  onBuyClick: () => void;
}

/** Where the zoom-in animation starts, per slider column. */
const START_OFFSETS_X = ['-300px', '-100px', '100px', '300px'];
const START_OFFSET_Y = '-150px';

/** A small tilt either side of upright, so no two openings look alike. */
function randomTilt(): number {
  const degrees = Math.floor(Math.random() * 21);
  return Math.random() < 0.5 ? degrees : degrees + 340;
}

function LectureModal({ lecture, isOpen, position, onClose, onBuyClick }: LectureModalProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [tilt, setTilt] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus moves into the dialog on open and back to the card on close.
  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen || !lecture) return;
    setImageIndex(0);
    setTilt(randomTilt());
  }, [lecture, isOpen]);

  // Lock the page behind the modal and wire up Esc.
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const step = useCallback(
    (direction: -1 | 1) => {
      if (!lecture) return;
      const count = lecture.images.length;
      setImageIndex((prev) => (prev + direction + count) % count);
    },
    [lecture],
  );

  if (!lecture) return null;

  return (
    <div
      className={`lecture-modal-overlay ${isOpen ? 'show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // The overlay stays mounted and is hidden with opacity, so without this
      // its buttons keep their place in the tab order behind the page.
      inert={!isOpen}
    >
      <div
        ref={dialogRef}
        className={`lecture-modal ${isOpen ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Подробнее о лекции"
        style={
          {
            '--modal-start-x': START_OFFSETS_X[position] ?? '0px',
            '--modal-start-y': START_OFFSET_Y,
            '--modal-random-rotate': `${tilt}deg`,
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          className="lecture-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="lecture-modal-content">
          <div className="lecture-modal-image-slider">
            <div className="lecture-modal-image-container">
              <div
                className="lecture-modal-image-track"
                style={{ transform: `translateX(-${imageIndex * 100}%)` }}
              >
                {lecture.images.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Изображение ${index + 1}`}
                    className="lecture-modal-image"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </div>

          {lecture.images.length > 1 && (
            <div className="lecture-modal-image-nav">
              <button
                type="button"
                className="lecture-modal-image-arrow lecture-modal-image-arrow-left"
                onClick={() => step(-1)}
                aria-label="Previous image"
              >
                <ChevronIcon direction="left" />
              </button>

              <div className="lecture-modal-image-dots">
                {lecture.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={`lecture-modal-image-dot ${index === imageIndex ? 'active' : ''}`}
                    onClick={() => setImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="lecture-modal-image-arrow lecture-modal-image-arrow-right"
                onClick={() => step(1)}
                aria-label="Next image"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          )}

          <p className="lecture-modal-description">{lecture.description}</p>

          <div className="lecture-modal-footer">
            <button type="button" className="lecture-modal-buy-button" onClick={onBuyClick}>
              {lecture.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  const path = direction === 'left' ? 'M10 2L2 10L10 18' : 'M2 2L10 10L2 18';

  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LectureModal;
