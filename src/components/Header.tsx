import { useNavigate } from 'react-router-dom';
import { PageType } from '../types/pages';

interface HeaderProps {
  currentPage: string;
  titles: string[];
  routes: string[];
}

const Header = ({ titles, routes, currentPage }: HeaderProps) => {
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    navigate(`/${route}`);
  };

  const getHeaderTitleClass = () => {
    if (currentPage === PageType.CONSULTING) return "header-title-consulting";
    if (currentPage === PageType.SERVICES) return "header-title-services";
    return "header-title-main";
  };

  return (
    <header className="header">
      <div className="header-container">
        <div
          className={`header-title-container ${getHeaderTitleClass()}`}
        >
          <h1>{currentPage}</h1>
        </div>
        <div className="header-desktop-navbar">
          {titles.map((title, index) => (
            <button
              type="button"
              className="header-button"
              onClick={() => handleClick(routes[index])}
              key={routes[index]}
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

export default Header;
