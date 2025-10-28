import { useState, useRef } from 'react';

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
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
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
        <div className="slider-text-container">
          <div
            className="slider-slide"
            onClick={handleSlideClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: 'pointer' }}
          >
            <h3 className="slider-header">{slides[currentIndex].header}</h3>
            <p className="slider-description">{slides[currentIndex].description}</p>
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].header}
              className="slider-image"
            />
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
