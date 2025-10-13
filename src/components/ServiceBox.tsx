import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ServiceBoxProps {
  image: string;
  title: string;
  description: string;
  svgPath: string;
  viewBox: string;
  route: string;
  alt?: string;
}

const ServiceBox = ({ image, title, description, svgPath, viewBox, route, alt = "" }: ServiceBoxProps) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleConfirm = () => {
    navigate(`/${route}`);
  };

  return (
    <div 
      className="service-box"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleConfirm}
    >
      <svg
        viewBox={viewBox}
        className="service-box-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={svgPath}
          fill={hovered ? "#FFAFE4" : "transparent"}
          stroke="#C4DEF8"
          strokeWidth="2"
          style={{ transition: "fill 0.3s ease" }}
        />
      </svg>
      <div className="service-box-content">
        <img src={image} alt={alt} className="service-image" />
        <h3 className="service-title primary-text">{title}</h3>
        <p className="service-description secondary-text">{description}</p>
        <button 
          className="service-confirm-button"
          onClick={handleConfirm}
        >
          АГА!
        </button>
      </div>
    </div>
  );
};

export default ServiceBox;
