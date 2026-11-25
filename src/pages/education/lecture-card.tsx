import StarBadge from './star-badge';
import type { Lecture } from './lecture';

interface LectureCardProps {
  lecture: Lecture;
  onDetailsClick: () => void;
  onBuyClick: () => void;
}

/**
 * Cover art with the price laid over it; clicking anywhere else on the card
 * opens the details modal.
 *
 * Paid lectures get a price button that jumps straight to the shop. Free
 * materials have nowhere to jump to — they are mailed from the form inside the
 * modal — so they carry the star badge in the corner instead, and the whole
 * card is the way in.
 */
function LectureCard({ lecture, onDetailsClick, onBuyClick }: LectureCardProps) {
  const isFree = Boolean(lecture.material);

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

      {isFree ? (
        <StarBadge className="lecture-card-badge" label={lecture.price} />
      ) : (
        <button
          type="button"
          className="lecture-buy-button"
          onClick={(e) => {
            // Buying must not also open the modal behind it.
            e.stopPropagation();
            onBuyClick();
          }}
        >
          {lecture.price}
        </button>
      )}
    </div>
  );
}

export default LectureCard;
