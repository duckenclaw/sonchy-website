import { useState, useEffect, useCallback, useRef } from 'react';
import type { LectureData } from '../types/lecture';

interface LectureModalProps {
    lecture: LectureData | null;
    isOpen: boolean;
    position: number;
    onClose: () => void;
    onBuyClick: () => void;
}

const LectureModal = ({ lecture, isOpen, position, onClose, onBuyClick }: LectureModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [randomRotation, setRandomRotation] = useState(0);

    const getOffsetX = (pos: number) => {
        const offsets = ['-300px', '-100px', '100px', '300px'];
        return offsets[pos] || '0px';
    };

    const generateRandomRotation = useCallback(() => {
        return Math.random() < 0.5
            ? Math.floor(Math.random() * 21)
            : Math.floor(Math.random() * 21) + 340;
    }, []);

    useEffect(() => {
        if (isOpen && lecture) {
            setCurrentImageIndex(0);
            setRandomRotation(generateRandomRotation());
        }
    }, [lecture, isOpen, generateRandomRotation]);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);

    const handlePreviousImage = useCallback(() => {
        if (!lecture) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? lecture.images.length - 1 : prev - 1
        );
    }, [lecture]);

    const handleNextImage = useCallback(() => {
        if (!lecture) return;
        setCurrentImageIndex((prev) =>
            prev === lecture.images.length - 1 ? 0 : prev + 1
        );
    }, [lecture]);

    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );

    const handleModalClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }, []);

    if (!lecture) return null;

    const offsetX = getOffsetX(position);
    const offsetY = '-150px';

    return (
        <div className={`lecture-modal-overlay ${isOpen ? 'show' : ''}`} onClick={handleBackdropClick}>
            <div
                ref={modalRef}
                className={`lecture-modal ${isOpen ? 'show' : ''}`}
                onClick={handleModalClick}
                style={{
                    '--modal-start-x': offsetX,
                    '--modal-start-y': offsetY,
                    '--modal-random-rotate': `${randomRotation}deg`
                } as React.CSSProperties}
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
                            <div className="lecture-modal-image-track"
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {lecture.images.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`Изображение ${index + 1}`}
                                        className="lecture-modal-image"
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
                                onClick={handlePreviousImage}
                                aria-label="Previous image"
                            >
                                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 2L2 10L10 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <div className="lecture-modal-image-dots">
                                {lecture.images.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`lecture-modal-image-dot ${
                                            index === currentImageIndex ? 'active' : ''
                                        }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                className="lecture-modal-image-arrow lecture-modal-image-arrow-right"
                                onClick={handleNextImage}
                                aria-label="Next image"
                            >
                                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 2L10 10L2 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}

                    <p className="lecture-modal-description">{lecture.description}</p>

                    <div className="lecture-modal-footer">
                        <p className="lecture-modal-price">{lecture.price}</p>
                        <button
                            type="button"
                            className="lecture-modal-buy-button"
                            onClick={onBuyClick}
                        >
                            КУПИТЬ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureModal;
