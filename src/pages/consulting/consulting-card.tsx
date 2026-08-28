import { useNavigate } from 'react-router-dom';

import { ROUTES, routeTo } from '@/app/routes';
import CardOutline from '@/components/card-outline/card-outline';
import type { ConsultingPackage } from './consulting-data';

/** One consultation package: illustration, bullet list, blurb and price. */
function ConsultingCard({ image, title, bonuses, description, price, alt }: ConsultingPackage) {
  const navigate = useNavigate();

  return (
    <div className="consulting-block">
      <img src={image} alt={alt} className="consulting-image" loading="lazy" />

      <div className="consulting-content">
        <CardOutline className="consulting-content-bg" />

        <div className="consulting-title-container">
          <h2 className="consulting-title primary-text">{title}</h2>
        </div>

        <div className="consulting-content-inner">
          <div className="consulting-details">
            <div className="consulting-info">
              <ul className="consulting-bonuses">
                {bonuses.map((bonus) => (
                  <li key={bonus} className="bonus-item">
                    <img src="/ui/list-decoration.svg" alt="" className="list-decoration" />
                    <span className="bonus-text secondary-text">{bonus}</span>
                  </li>
                ))}
              </ul>

              <p className="consulting-description secondary-text">{description}</p>
            </div>

            <div className="consulting-price-container">
              <div className="consulting-price">
                <span className="price-text secondary-text">{price}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="consulting-contact-button"
          onClick={() => navigate(routeTo(ROUTES.CONTACTS))}
        >
          СВЯЗАТЬСЯ
        </button>
      </div>
    </div>
  );
}

export default ConsultingCard;
