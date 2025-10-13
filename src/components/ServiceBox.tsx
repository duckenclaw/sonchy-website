import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SVG_PATHS } from '../constants/svgPaths';

interface ServiceBoxProps {
  image: string;
  title: string;
  description: string;
  svgPath: string;
  viewBox: string;
  route: string;
  alt?: string;
  shouldFlipOnMobile?: boolean;
}

const ServiceBox = ({
  image,
  title,
  description,
  svgPath,
  viewBox,
  route,
  alt,
  shouldFlipOnMobile = false
}: ServiceBoxProps) => {
  const navigate = useNavigate();

  const altText = alt || `${title} service`;

  const handleClick = () => {
    navigate(`/${route}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="service-box"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Navigate to ${title}`}
    >
      {/* Desktop SVG */}
      <svg
        viewBox={viewBox}
        className="service-box-svg service-box-svg-desktop"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d={svgPath}
          fill="transparent"
          stroke="#C4DEF8"
          strokeWidth="2"
        />
      </svg>
      {/* Mobile SVG */}
      <svg
        viewBox={SVG_PATHS.MOBILE_SERVICE_BOX_VIEWBOX}
        className="service-box-svg service-box-svg-mobile"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          transform: shouldFlipOnMobile ? 'scaleY(-1)' : 'none'
        }}
      >
        <path
          d={SVG_PATHS.MOBILE_SERVICE_BOX}
          fill="transparent"
          stroke="#C4DEF8"
          strokeWidth="2"
        />
      </svg>
      <div className="service-box-content">
        <img src={image} alt={altText} className="service-image" />
        <h3 className="service-title primary-text">{title}</h3>
        <p className="service-description secondary-text">{description}</p>
        <div className="service-confirm-button" aria-hidden="true">
          АГА!
        </div>
      </div>
    </div>
  );
};

ServiceBox.displayName = 'ServiceBox';

export default memo(ServiceBox);
