import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES, routeTo } from '@/app/routes';
import './blank.css';

/** Placeholder for routes that exist in the menu but have no page yet. */
function BlankPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Last path segment, so /services/whatever still gets a sensible heading.
  const section = pathname.split('/').filter(Boolean).pop();

  return (
    <div className="blank-page">
      <div className="blank-page-content">
        <h1 className="primary-text">{section ? section.toUpperCase() : 'СТРАНИЦА'}</h1>
        <p className="secondary-text">
          Эта страница пока что пуста, но скоро здесь будет интересный контент!
        </p>
        <button
          type="button"
          onClick={() => navigate(routeTo(ROUTES.HOME))}
          className="back-button"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}

export default BlankPage;
