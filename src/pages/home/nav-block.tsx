import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { routeTo } from '@/app/routes';
import type { HomeBlock } from './home-blocks';

/**
 * One of the three portrait tiles on the landing page. The whole tile is
 * clickable, so it carries the button role and keyboard handling.
 */
function NavBlock({ image, title, description, alt, position, route }: HomeBlock) {
  const navigate = useNavigate();

  const handleClick = () => navigate(routeTo(route));

  return (
    <div
      className={`nav-block nav-block-${position}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      <img src={image} alt={alt} className="nav-image" />
      <h2 className="nav-title primary-text">{title}</h2>
      <p className="nav-description secondary-text">
        {description.split('\n').map((line, i) => (
          <Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
    </div>
  );
}

export default NavBlock;
