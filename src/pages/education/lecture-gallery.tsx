import LectureCard from './lecture-card';
import type { Lecture } from './lecture';

interface LectureGalleryProps {
  lectures: Lecture[];
  onDetailsClick: (lecture: Lecture, position: number) => void;
  onBuyClick: (lecture: Lecture) => void;
}

/**
 * Columns the gallery is laid out in on desktop. Cards wrap onto new rows past
 * this, so adding lectures needs no code change — but the modal's zoom-in
 * animation is keyed per column, so it still needs to know the count.
 */
const COLUMNS = 4;

/** Every lecture at once: a left-aligned grid that wraps as the list grows. */
function LectureGallery({ lectures, onDetailsClick, onBuyClick }: LectureGalleryProps) {
  return (
    <div className="lecture-gallery-outer">
      <div className="lecture-gallery-mobile-title">ОБУЧЕНИЕ</div>

      <h2 className="lecture-gallery-title">ЛЕКЦИИ</h2>

      <div className="lecture-gallery-wrapper">
        <div className="lecture-gallery-cards">
          {lectures.map((lecture, index) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onDetailsClick={() => onDetailsClick(lecture, index % COLUMNS)}
              onBuyClick={() => onBuyClick(lecture)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LectureGallery;
