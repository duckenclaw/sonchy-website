import { useState } from 'react';
import LectureCard from './LectureCard';
import type { LectureData } from '../types/lecture';

interface LectureSliderProps {
    lectures: LectureData[];
    onLectureDetailsClick: (lecture: LectureData, position: number) => void;
    onLectureBuyClick: (lecture: LectureData) => void;
}

const LectureSlider = ({
    lectures,
    onLectureDetailsClick,
    onLectureBuyClick
}: LectureSliderProps) => {
    const [currentStartIndex, setCurrentStartIndex] = useState(0);

    // Показываем 4 карточки одновременно
    const visibleCount = 4;

    const handlePrevious = () => {
        setCurrentStartIndex((prev) =>
            prev === 0 ? 0 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentStartIndex((prev) =>
            prev >= lectures.length - visibleCount ? prev : prev + 1
        );
    };

    return (
        <div className="lecture-slider-outer">
            <div className="lecture-slider">
                <button
                    type="button"
                    className="lecture-slider-arrow lecture-slider-arrow-left"
                    onClick={handlePrevious}
                    aria-label="Previous lectures"
                    disabled={currentStartIndex === 0}
                >
                    <img src="/arrow-left.svg" alt="" />
                </button>

                <div className="lecture-slider-wrapper">
                    <h2 className="lecture-slider-title">ЛЕКЦИИ</h2>
                    <div className="lecture-slider-container">
                        <div
                            className="lecture-slider-cards"
                            style={{
                                transform: `translateX(calc(-${currentStartIndex} * ((100% - 4.5rem) / 4 + 1.5rem)))`
                            }}
                        >
                            {lectures.map((lecture, index) => {
                                // Позиция в видимой области (0-3)
                                const visiblePosition = (index - currentStartIndex) % 4;
                                return (
                                    <LectureCard
                                        key={lecture.id}
                                        id={lecture.id}
                                        title={lecture.title}
                                        description={lecture.description}
                                        price={lecture.price}
                                        images={lecture.images}
                                        position={visiblePosition}
                                        onDetailsClick={() => onLectureDetailsClick(lecture, visiblePosition)}
                                        onBuyClick={() => onLectureBuyClick(lecture)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="lecture-slider-arrow lecture-slider-arrow-right"
                    onClick={handleNext}
                    aria-label="Next lectures"
                    disabled={currentStartIndex >= lectures.length - visibleCount}
                >
                    <img src="/arrow-left.svg" alt="" />
                </button>
            </div>
        </div>
    );
};

export default LectureSlider;
