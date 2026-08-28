import { useRef, useState } from 'react';

/** Swipe distance, in pixels, that flips the book to the other page. */
const SWIPE_THRESHOLD = 40;

/**
 * The open-book spread describing the course.
 *
 * TODO: the autumn design replaces this with a new image (Figma node 670:2817
 * on the sonchy-landing page). Still the summer artwork here — export blocked
 * by the Figma plan's MCP call limit.
 */
function BookSection() {
  const [page, setPage] = useState<0 | 1>(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) setPage(dx < 0 ? 1 : 0);
    touchStartX.current = null;
  };

  return (
    <section className="c2-book-section">
      <img
        src="/courses/book.webp"
        alt="Открытая книга с описанием курса"
        loading="lazy"
        decoding="async"
      />

      <div
        className="c2-book-slider"
        aria-label="Страницы книги — пролистайте"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="c2-book-slider-viewport"
          style={{ transform: `translateX(-${page * 50}%)` }}
        >
          <img src="/courses/book.webp" alt="Открытая книга" />
        </div>
      </div>

      <div className="c2-book-dots" role="tablist" aria-label="Переключатель страниц">
        {([0, 1] as const).map((index) => (
          <button
            key={index}
            type="button"
            className={`c2-book-dot ${page === index ? 'active' : ''}`}
            onClick={() => setPage(index)}
            aria-label={`Страница ${index + 1}`}
            aria-selected={page === index}
          />
        ))}
      </div>

      <p className="c2-book-note">
        в тарифе «Пробующий» будет короткий фидбэк на отрывки в комментариях с пояснениями на
        лекции типичных ошибок, полный разбор только для тарифа с консультациями
      </p>
    </section>
  );
}

export default BookSection;
