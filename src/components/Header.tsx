import { useNavigate } from 'react-router-dom';

interface headerNavbarButtonProps {
  currentPage: string;
  titles: string[];
  routes: string[];
}

const Header = ({ titles, routes, currentPage }: headerNavbarButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    navigate(`/${route}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div 
          className="header-title-container"
          style={{
            backgroundImage: currentPage === "УСЛУГИ" 
              ? "url('/title-bg-services.svg')" 
              : "url('/title-bg-main.svg')"
          }}
        >
          <h1>{currentPage}</h1>
        </div>
        <div className="header-desktop-navbar">
            {titles.map((title, index) => (
                <button className={`header-button`} onClick={() => handleClick(routes[index])} key={index}>{title}</button>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
