import type { Lecture } from './lecture';

interface LectureCardProps {
  lecture: Lecture;
  onDetailsClick: () => void;
  onBuyClick: () => void;
}

/** Cover art plus a price button; clicking the card opens the details modal. */
function LectureCard({ lecture, onDetailsClick, onBuyClick }: LectureCardProps) {
  return (
    <div
      className="lecture-card"
      onClick={onDetailsClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDetailsClick();
        }
      }}
    >
      <div className="lecture-card-frame">
        <img
          src={lecture.coverImage}
          alt=""
          className="lecture-card-cover-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <button
        type="button"
        className="lecture-buy-button"
        onClick={(e) => {
          e.stopPropagation();
          onBuyClick();
        }}
      >
        {lecture.price}
      </button>
    </div>
  );
}

export default LectureCard;
