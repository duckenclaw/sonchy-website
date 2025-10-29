import { useState, useRef, useEffect } from 'react';

interface SlideData {
  header: string;
  description: string;
  image: string;
  points: string[];
}

interface SliderProps {
  slides: SlideData[];
}

const Slider = ({ slides }: SliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Preload images for current, next and previous slides
  useEffect(() => {
    const indicesToPreload = [
      currentIndex,
      (currentIndex + 1) % slides.length, // next
      (currentIndex - 1 + slides.length) % slides.length, // previous
    ];

    indicesToPreload.forEach((index) => {
      const img = new Image();
      img.src = slides[index].image;
    });
  }, [currentIndex, slides.length]);

  const handlePrevious = () => {
    if (isAnimating) return;
    setDirection('left');
    setPrevIndex(currentIndex);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => {
      setPrevIndex(null);
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setDirection('right');
    setPrevIndex(currentIndex);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => {
      setPrevIndex(null);
      setIsAnimating(false);
    }, 500);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setPrevIndex(currentIndex);
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setPrevIndex(null);
      setIsAnimating(false);
    }, 500);
  };

  const handleSlideClick = () => {
    handleNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Свайп влево - следующий слайд
      handleNext();
    }

    if (touchStartX.current - touchEndX.current < -50) {
      // Свайп вправо - предыдущий слайд
      handlePrevious();
    }
  };

  return (
    <div className="slider">
      <button
        type="button"
        className="slider-arrow slider-arrow-left"
        onClick={handlePrevious}
        aria-label="Previous slide"
      >
        <img src="/arrow-left.svg" alt="" />
      </button>

      <div className="slider-container">
        <div
          className="slider-text-container"
          onClick={handleSlideClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: 'pointer' }}
        >
          {/* Previous slide - exiting */}
          {prevIndex !== null && (
            <div className={`slider-slide slide-exit-${direction}`}>
              <h3 className="slider-header">{slides[prevIndex].header}</h3>
              <p className="slider-description">{slides[prevIndex].description}</p>
              <div className="slider-image-container">
                <img
                  src={slides[prevIndex].image}
                  alt={slides[prevIndex].header}
                  className="slider-image"
                />
              </div>
              <ul className="slider-list">
                {slides[prevIndex].points.map((point, pointIndex) => (
                  <li key={pointIndex}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Current slide - entering or static */}
          <div className={`slider-slide ${isAnimating ? `slide-enter-${direction}` : ''}`}>
            <h3 className="slider-header">{slides[currentIndex].header}</h3>
            <p className="slider-description">{slides[currentIndex].description}</p>
            <div className="slider-image-container">
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].header}
                className="slider-image"
              />
            </div>
            <ul className="slider-list">
              {slides[currentIndex].points.map((point, pointIndex) => (
                <li key={pointIndex}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
          <div className="slider-dots">
              {slides.map((_, index) => (
                  <button
                      key={index}
                      type="button"
                      className={`slider-dot ${
                          index === currentIndex ? 'slider-dot-active' : ''
                      }`}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Go to slide ${index + 1}`}
                  />
              ))}
          </div>
      </div>

      <button
        type="button"
        className="slider-arrow slider-arrow-right"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <img src="/arrow-left.svg" alt="" />
      </button>

    </div>
  );
};

export default Slider;
