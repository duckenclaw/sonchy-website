import { useNavigate } from 'react-router-dom';

interface NavBlockProps {
  image: string;
  title: string;
  description: string;
  alt?: string;
  position: 'left' | 'right';
  route: string;
}

const NavBlock = ({ image, title, description, alt = "", position, route }: NavBlockProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${route}`);
  };

  return (
    <div 
      className={`nav-block nav-block-${position}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <img src={image} alt={alt} className="nav-image" />
      <h2 className="nav-title primary-text">{title}</h2>
      <p className="nav-description secondary-text">{description}</p>
    </div>
  );
};

export default NavBlock;
