import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { ROUTES, routeTo } from '@/app/routes';
import type { RouteValue } from '@/app/routes';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import './header.css';

/** Each variant swaps the plaque artwork behind the page title. */
export type HeaderVariant = 'main' | 'services' | 'consulting' | 'education';

interface HeaderProps {
  title: string;
  variant?: HeaderVariant;
}

const NAV_LINKS: { label: string; route: RouteValue }[] = [
  { label: 'Главная', route: ROUTES.HOME },
  { label: 'Обо мне', route: ROUTES.ABOUT },
  { label: 'Услуги', route: ROUTES.SERVICES },
  { label: 'Обучение', route: ROUTES.EDUCATION },
  { label: 'Курсы', route: ROUTES.COURSES },
  { label: 'Контакты', route: ROUTES.CONTACTS },
];

function Header({ title, variant = 'main' }: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  // Focus moves into the drawer on open and back to the burger on close.
  useFocusTrap(drawerRef, menuOpen);

  const handleNavigate = (route: RouteValue) => {
    setMenuOpen(false);
    navigate(routeTo(route));
  };

  // Esc closes the drawer, and the page behind it should not scroll.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  // The drawer is rendered into <body> rather than inline: .header sets
  // z-index: 1, which would trap the overlay below page content on every page.
  const drawer = createPortal(
    <div className={`header-mobile-shell ${menuOpen ? 'is-open' : ''}`} inert={!menuOpen}>
      <div
        className="header-mobile-backdrop"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        ref={drawerRef}
        id="header-mobile-nav"
        className="header-mobile-nav"
        aria-label="Основная навигация"
      >
        <button
          type="button"
          className="header-mobile-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Закрыть меню"
        >
          <span />
          <span />
        </button>

        {NAV_LINKS.map((link, i) => (
          <button
            type="button"
            className="header-mobile-button"
            onClick={() => handleNavigate(link.route)}
            key={link.route}
            style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.05}s` : '0s' }}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </div>,
    document.body,
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className={`header-title-container header-title-${variant}`}>
          <h1>{title}</h1>
        </div>

        <div className="header-desktop-navbar">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              className="header-button"
              onClick={() => handleNavigate(link.route)}
              key={link.route}
              aria-label={`Navigate to ${link.label}`}
            >
              {link.label}
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
}

export default Header;
