import { useState, useEffect, useRef, useCallback } from 'react';
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
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const visibleCount = isMobile ? 1 : 4;

    const handlePrevious = useCallback(() => {
        if (isMobile && containerRef.current) {
            const scrollAmount = containerRef.current.clientWidth;
            containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            setCurrentStartIndex((prev) => Math.max(0, prev - 1));
        }
    }, [isMobile]);

    const handleNext = useCallback(() => {
        if (isMobile && containerRef.current) {
            const scrollAmount = containerRef.current.clientWidth;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
            setCurrentStartIndex((prev) =>
                Math.min(lectures.length - visibleCount, prev + 1)
            );
        }
    }, [isMobile, lectures.length, visibleCount]);

    return (
        <div className="lecture-slider-outer">
            <div className="lecture-slider-mobile-title">ОБУЧЕНИЕ</div>

            <div className="lecture-slider">
                <button
                    type="button"
                    className="lecture-slider-arrow lecture-slider-arrow-left"
                    onClick={handlePrevious}
                    disabled={!isMobile && currentStartIndex === 0}
                    aria-label="Previous lectures"
                >
                    <img src="/arrow-left.svg" alt="" />
                </button>

                <div className="lecture-slider-wrapper">
                    <h2 className="lecture-slider-title">ЛЕКЦИИ</h2>
                    <div className="lecture-slider-container" ref={containerRef}>
                        <div
                            className="lecture-slider-cards"
                            style={{
                                transform: isMobile
                                    ? 'none'
                                    : `translateX(calc(-${currentStartIndex} * ((100% - 4.5rem) / 4 + 1.5rem)))`
                            }}
                        >
                            {lectures.map((lecture, index) => {
                                const visiblePosition = (index - currentStartIndex) % 4;
                                return (
                                    <LectureCard
                                        key={lecture.id}
                                        lecture={lecture}
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
                    disabled={!isMobile && currentStartIndex >= lectures.length - visibleCount}
                    aria-label="Next lectures"
                >
                    <img src="/arrow-left.svg" alt="" />
                </button>
            </div>
        </div>
    );
};

export default LectureSlider;
