import { useState, useEffect } from 'react';
import type { LectureData } from '../types/lecture';

interface LectureModalProps {
    lecture: LectureData | null;
    isOpen: boolean;
    position: number; // 0-3
    onClose: () => void;
    onBuyClick: () => void;
}

const LectureModal = ({ lecture, isOpen, position, onClose, onBuyClick }: LectureModalProps) => {
    // Рассчитываем смещение в зависимости от позиции (0-3)
    // Позиции: левая (-300px), центр-лево (-100px), центр-право (100px), правая (300px)
    const getOffsetX = (pos: number) => {
        const offsets = ['-300px', '-100px', '100px', '300px'];
        return offsets[pos] || '0px';
    };

    const offsetX = getOffsetX(position);
    const offsetY = '-150px'; // Выше, из середины блоков

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [randomRotation, setRandomRotation] = useState(0);

    // Reset image index and generate random rotation when lecture changes
    useEffect(() => {
        setCurrentImageIndex(0);

        // Генерируем случайный угол с повышенной вероятностью для 0-20° и 340-360°
        // Углы 0-20 и 340-360 (40° из 360°) должны попадаться в 4 раза чаще
        // Создаем взвешенную вероятность: 4 части для "хороших" углов, 1 часть для остальных
        const totalWeight = 4 + 1; // 4 для хороших углов + 1 для остальных
        const randomWeight = Math.random() * totalWeight;

        let random: number;
        if (randomWeight < 4) {
            // 80% шанс: генерируем угол от 0-20 или 340-360
            if (Math.random() < 0.5) {
                // 0-20°
                random = Math.floor(Math.random() * 21);
            } else {
                // 340-360°
                random = Math.floor(Math.random() * 21) + 340;
            }
        } else {
            // 20% шанс: генерируем угол от 21-339
            random = Math.floor(Math.random() * 319) + 21;
        }

        setRandomRotation(random);
    }, [lecture, isOpen]);

    // Escape key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!lecture) return null;

    const handlePreviousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? lecture.images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === lecture.images.length - 1 ? 0 : prev + 1
        );
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`lecture-modal-overlay ${isOpen ? 'show' : ''}`} onClick={handleBackdropClick}>
            <div
                className={`lecture-modal ${isOpen ? 'show' : ''}`}
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
                    <h2 className="lecture-modal-title">{lecture.title}</h2>

                    {/* Image slider */}
                    <div className="lecture-modal-image-slider">
                        {lecture.images.length > 1 && (
                            <button
                                type="button"
                                className="lecture-modal-image-arrow lecture-modal-image-arrow-left"
                                onClick={handlePreviousImage}
                                aria-label="Previous image"
                            >
                                ←
                            </button>
                        )}

                        <div className="lecture-modal-image-container">
                            <div className="lecture-modal-image-placeholder">
                                {/* Розовый прямоугольник для изображения */}
                                <p>Изображение {currentImageIndex + 1}</p>
                            </div>
                            {lecture.images.length > 1 && (
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
                            )}
                        </div>

                        {lecture.images.length > 1 && (
                            <button
                                type="button"
                                className="lecture-modal-image-arrow lecture-modal-image-arrow-right"
                                onClick={handleNextImage}
                                aria-label="Next image"
                            >
                                →
                            </button>
                        )}
                    </div>

                    <p className="lecture-modal-description">{lecture.description}</p>

                    <div className="lecture-modal-footer">
                        <p className="lecture-modal-price">{lecture.price}</p>
                        <button
                            type="button"
                            className="lecture-modal-buy-button"
                            onClick={onBuyClick}
                        >
                            КУПИТЬ ЗА
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureModal;
