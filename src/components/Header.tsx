import { useNavigate } from 'react-router-dom';
import { PageType } from '../types/pages';
import { ROUTES } from '../constants/routes';

interface HeaderProps {
  currentPage: string;
}

const Header = ({ currentPage }: HeaderProps) => {
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    navigate(`/${route}`);
  };

  const getHeaderTitleClass = () => {
    if (currentPage === PageType.CONSULTING) return "header-title-consulting";
    if (currentPage === PageType.SERVICES) return "header-title-services";
    return "header-title-main";
  };

  // Всегда используем одинаковые 3 кнопки навигации
  const navButtons = [
    { title: "Главная", route: ROUTES.HOME },
    { title: "Услуги", route: ROUTES.SERVICES },
    { title: "Контакты", route: ROUTES.CONTACTS }
  ];

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
      </div>
    </header>
  );
};

export default Header;
