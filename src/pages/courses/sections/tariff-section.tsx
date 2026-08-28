import { PAYMENT_LINKS, TARIFF_ROWS, TIERS } from '../courses-data';
import type { TariffCell } from '../courses-data';
import type { useRocketLaunch } from '../use-rocket-launch';

interface TariffSectionProps {
  launch: ReturnType<typeof useRocketLaunch>;
}

function TariffValue({ value }: { value: TariffCell }) {
  if (value === true) {
    return (
      <span className="c2-tariff-check" aria-label="включено">
        ✓
      </span>
    );
  }
  if (value === false) {
    return <span className="c2-tariff-dash" role="img" aria-label="не включено" />;
  }
  return <>{value}</>;
}

/** Side-by-side comparison of the three tiers, with a buy button per column. */
function TariffSection({ launch }: TariffSectionProps) {
  const { launching, launch: startLaunch, renderStars } = launch;

  return (
    <section className="c2-tariff-section">
      <div className="c2-section-title t-cream">
        <h2>СРАВНЕНИЕ ТАРИФОВ</h2>
      </div>

      <div className="c2-tariff-wrapper">
        <div className="c2-tariff-row c2-tariff-head">
          <div className="c2-tariff-cell c2-tariff-cell-label" />
          {TIERS.map((tier, i) => (
            <div className={`c2-tariff-cell tier-${i + 1}`} key={tier.id}>
              {tier.tableName}
            </div>
          ))}
        </div>

        <div className="c2-tariff-body">
          {TARIFF_ROWS.map((row) => (
            <div className="c2-tariff-row" key={row.label}>
              <div className="c2-tariff-cell c2-tariff-cell-label">{row.label}</div>
              {row.values.map((value, i) => (
                <div className={`c2-tariff-cell tier-${i + 1}`} key={TIERS[i].id}>
                  <TariffValue value={value} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="c2-tariff-row c2-tariff-cta">
          <div className="c2-tariff-cell c2-tariff-cell-label" />
          {TIERS.map((tier, i) => (
            <div className="c2-tariff-cell" key={tier.id}>
              <button
                type="button"
                className={`c2-tariff-buy tier-${i + 1} ${
                  launching === `tariff-${tier.id}` ? 'launching' : ''
                }`}
                onClick={() => startLaunch(`tariff-${tier.id}`, PAYMENT_LINKS[tier.id])}
                disabled={tier.soldOut}
              >
                {tier.soldOut ? 'SOLD OUT' : tier.price}
              </button>
              {renderStars(`tariff-${tier.id}`)}
            </div>
          ))}
        </div>
      </div>

      <p className="c2-tariff-note">
        * Запись интенсива предоставляется только участникам курса и доступна до 4 января.
        Успейте забронировать место на потоке.
      </p>
    </section>
  );
}

export default TariffSection;
