import { useCallback } from 'react';
import type { LectureData } from '../types/lecture';

interface LectureCardProps {
    lecture: LectureData;
    onDetailsClick: () => void;
    onBuyClick: () => void;
}

const LectureCard = ({
    lecture,
    onDetailsClick,
    onBuyClick
}: LectureCardProps) => {
    const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.lecture-buy-button')) {
            onDetailsClick();
        }
    }, [onDetailsClick]);

    const handleBuyClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onBuyClick();
    }, [onBuyClick]);

    return (
        <div className="lecture-card" onClick={handleCardClick}>
            <div className="lecture-card-frame">
                {lecture.coverImage ? (
                    <img
                        src={lecture.coverImage}
                        alt=""
                        className="lecture-card-cover-image"
                    />
                ) : (
                    <div className="lecture-card-image-placeholder"></div>
                )}
            </div>


            <button
                type="button"
                className="lecture-buy-button"
                onClick={handleBuyClick}
            >
                КУПИТЬ
            </button>
        </div>
    );
};

export default LectureCard;
