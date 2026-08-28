import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { routeTo } from '@/app/routes';
import { MOBILE_OUTLINE } from './services-data';
import type { Service } from './services-data';

interface ServiceBoxProps extends Service {
  /** The middle card's mobile outline is flipped so the row looks hand-drawn. */
  flipOutlineOnMobile?: boolean;
}

/** One clickable service card with its own hand-drawn outline. */
function ServiceBox({
  image,
  title,
  description,
  outline,
  route,
  alt,
  flipOutlineOnMobile = false,
}: ServiceBoxProps) {
  const navigate = useNavigate();

  const handleClick = () => navigate(routeTo(route));

  return (
    <div
      className="service-box"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Navigate to ${title}`}
    >
      <svg
        viewBox={outline.viewBox}
        className="service-box-svg service-box-svg-desktop"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d={outline.path} fill="transparent" stroke="#C4DEF8" strokeWidth="2" />
      </svg>

      <svg
        viewBox={MOBILE_OUTLINE.viewBox}
        className="service-box-svg service-box-svg-mobile"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ transform: flipOutlineOnMobile ? 'scaleY(-1)' : 'none' }}
      >
        <path d={MOBILE_OUTLINE.path} fill="transparent" stroke="#C4DEF8" strokeWidth="2" />
      </svg>

      <div className="service-box-content">
        <img src={image} alt={alt} className="service-image" loading="lazy" decoding="async" />
        <h3 className="service-title primary-text">{title}</h3>
        <p className="service-description secondary-text">{description}</p>
        <div className="service-confirm-button" aria-hidden="true">
          АГА!
        </div>
      </div>
    </div>
  );
}

export default memo(ServiceBox);
