import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PageType } from '../types/pages';
import { ROUTES } from '../constants/routes';

interface HeaderProps {
  currentPage: string;
}

const Header = ({ currentPage }: HeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (route: string) => {
    setMenuOpen(false);
    navigate(`/${route}`);
  };

  const getHeaderTitleClass = () => {
    if (currentPage === PageType.CONSULTING) return "header-title-consulting";
    if (currentPage === PageType.SERVICES) return "header-title-services";
    if (currentPage === "ОБУЧЕНИЕ") return "header-title-education";
    return "header-title-main";
  };

  // Всегда используем одинаковые 3 кнопки навигации
  const navButtons = [
    { title: "Главная", route: ROUTES.HOME },
    { title: "Обо мне", route: ROUTES.ABOUT },
    { title: "Услуги", route: ROUTES.SERVICES },
    { title: "Обучение", route: ROUTES.EDUCATION },
    { title: "Курсы", route: ROUTES.COURSES },
    { title: "Контакты", route: ROUTES.CONTACTS }
  ];

  // Esc closes the drawer, matching what people expect from an overlay menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // The drawer is rendered into <body> rather than inline: .header sets
  // z-index: 1, which would trap the overlay below page content on every page.
  const drawer = createPortal(
    <div className={`header-mobile-shell ${menuOpen ? 'is-open' : ''}`}>
      <div
        className="header-mobile-backdrop"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="header-mobile-nav"
        className="header-mobile-nav"
        aria-label="Основная навигация"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="header-mobile-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Закрыть меню"
          tabIndex={menuOpen ? 0 : -1}
        >
          <span />
          <span />
        </button>

        {navButtons.map((button, i) => (
          <button
            type="button"
            className="header-mobile-button"
            onClick={() => handleClick(button.route)}
            key={button.route}
            tabIndex={menuOpen ? 0 : -1}
            style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.05}s` : '0s' }}
          >
            {button.title}
          </button>
        ))}
      </nav>
    </div>,
    document.body
  );

  return (
    <header className="header">
      <div className="header-container">
        <div
          className={`header-title-container ${getHeaderTitleClass()}`}
        >
          <h1>{currentPage}</h1>
        </div>
        <div className="header-desktop-navbar">
          {navButtons.map((button) => (
            <button
              type="button"
              className="header-button"
              onClick={() => handleClick(button.route)}
              key={button.route}
              aria-label={`Navigate to ${button.title}`}
            >
              {button.title}
            </button>
          ))}
        </div>

        {/* Burger takes over below 1025px, where the desktop navbar is hidden */}
        <button
          type="button"
          className="header-burger"
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-controls="header-mobile-nav"
        >
          <span className="header-burger-line" />
          <span className="header-burger-line" />
          <span className="header-burger-line" />
        </button>
      </div>

      {drawer}
    </header>
  );
};

export default Header;
