import TrailSection from '../trail-section';
import { PAYMENT_LINKS, STOREFRONT_LINK, TIERS } from '../courses-data';
import type { useRocketLaunch } from '../use-rocket-launch';

interface CardsSectionProps {
  isTouch: boolean;
  launch: ReturnType<typeof useRocketLaunch>;
}

/** Sticky notes describing who each tier is for, plus the general CTA. */
function CardsSection({ isTouch, launch }: CardsSectionProps) {
  const { launching, launch: startLaunch, renderStars } = launch;

  return (
    <TrailSection className="c2-cards-section" isTouch={isTouch}>
      <div className="c2-section-title t-gold">
        <h2>КОМУ ПОДХОДИТ?</h2>
      </div>

      <div className="c2-cards-bg">
        <img
          className="c2-cards-bg-img"
          src="/courses/cards-section-bg.svg"
          alt=""
          aria-hidden="true"
        />
        <div className="c2-cards-row">
          {TIERS.map((tier) => (
            <div className={`c2-sticky-col ${tier.stickyClass}`} key={tier.id}>
              <div className={`c2-sticky ${tier.stickyClass}`}>
                <div className="c2-sticky-content">
                  <h4>{tier.stickyTitle}</h4>
                  <p>{tier.blurb}</p>
                </div>
              </div>

              <span className={`c2-sticky-badge ${tier.seats ? '' : 'is-empty'}`}>
                {tier.seats ?? '—'}
              </span>

              <div className="c2-sticky-price-wrap">
                <button
                  type="button"
                  className={`c2-sticky-price ${
                    launching === `sticky-${tier.id}` ? 'launching' : ''
                  }`}
                  onClick={() => startLaunch(`sticky-${tier.id}`, PAYMENT_LINKS[tier.id])}
                  disabled={tier.soldOut}
                >
                  {tier.soldOut ? 'SOLD OUT' : tier.price}
                </button>
                {renderStars(`sticky-${tier.id}`)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="c2-cta-wrap">
        <button
          type="button"
          className={`c2-cta-pill ${launching === 'cards' ? 'launching' : ''}`}
          onClick={() => startLaunch('cards', STOREFRONT_LINK)}
        >
          ЗАПИСАТЬСЯ
          <br />
          на осенний интенсив
        </button>
        {renderStars('cards')}
        <p className="c2-cta-disclaimer">
          *купить в записи после окончания интенсива - нельзя. запись ТОЛЬКО для участников
        </p>
      </div>
    </TrailSection>
  );
}

export default CardsSection;
