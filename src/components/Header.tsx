import { useNavigate } from 'react-router-dom';

interface headerNavbarButtonProps {
  titles: string[];
  routes: string[];
}

const Header = ({ titles, routes }: headerNavbarButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    navigate(`/${route}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title-container">
          <h1>СОНЧИ УТОЧКИНА</h1>
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
