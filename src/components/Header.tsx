import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageType } from '../types/pages';

interface HeaderNavbarButtonProps {
  currentPage: string;
  titles: string[];
  routes: string[];
}

const Header = ({ titles, routes, currentPage }: HeaderNavbarButtonProps) => {
  const navigate = useNavigate();

  const isServicesPage = currentPage === PageType.SERVICES;

  const handleClick = (route: string) => {
    navigate(`/${route}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div
          className={`header-title-container ${isServicesPage ? "header-title-services" : "header-title-main"}`}
        >
          <h1>{currentPage}</h1>
        </div>
        <div className="header-desktop-navbar">
          {titles.map((title, index) => (
            <button
              type="button"
              className="header-button"
              onClick={() => handleClick(routes[index])}
              key={index}
              aria-label={`Navigate to ${title}`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export default memo(Header);
