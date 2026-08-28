import { useNavigate } from 'react-router-dom';

import { ROUTES, routeTo } from '@/app/routes';
import './page-nav.css';

/**
 * The "НАЗАД / НА ГЛАВНУЮ" pair shown at the bottom of a page on mobile.
 * Hidden on desktop, where the header navbar already covers both.
 */
export function PageNav() {
  const navigate = useNavigate();

  return (
    <div className="page-nav">
      <button
        type="button"
        className="page-nav-button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        НАЗАД
      </button>
      <button
        type="button"
        className="page-nav-button"
        onClick={() => navigate(routeTo(ROUTES.HOME))}
        aria-label="Return to main page"
      >
        НА ГЛАВНУЮ
      </button>
    </div>
  );
}

/** Full-width "back to the main page" bar, also mobile only. */
export function PageReturnButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="page-return-button"
      onClick={() => navigate(routeTo(ROUTES.HOME))}
      aria-label="Return to main page"
    >
      ВЕРНУТЬСЯ НА ГЛАВНУЮ
    </button>
  );
}
