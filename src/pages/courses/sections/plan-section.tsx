import TrailSection from '../trail-section';
import { PLAN_ROWS } from '../courses-data';
import type { PlanDecoration } from '../courses-data';

interface PlanSectionProps {
  isTouch: boolean;
}

function Decoration({ decoration }: { decoration?: PlanDecoration }) {
  if (!decoration) return null;

  return (
    <img
      src={decoration.src}
      alt=""
      aria-hidden="true"
      className={`c2-plan-deco ${decoration.className}`}
    />
  );
}

/** Lecture-by-lecture table: what we study, what we edit, which guide we fill. */
function PlanSection({ isTouch }: PlanSectionProps) {
  return (
    <TrailSection className="c2-plan-section" isTouch={isTouch}>
      <div className="c2-section-title t-pink">
        <h2>ПЛАН ИНТЕНСИВА</h2>
      </div>

      <div className="c2-plan-headers-row">
        <div className="c2-plan-header">Что изучаем?</div>
        <div className="c2-plan-header">Что редактируем?</div>
        <div className="c2-plan-header">Какой гайд заполняем?</div>
      </div>

      <div className="c2-plan-grid">
        {PLAN_ROWS.map((row) => (
          <div className={`c2-plan-row c2-plan-row-${row.n}`} key={row.n}>
            <div className="c2-plan-cell">
              <div className="c2-plan-cell-title">
                <span className="c2-plan-cell-name">{row.name}</span>
              </div>
              <p className="c2-plan-cell-body">{row.studyBody}</p>
              <Decoration decoration={row.decoCol1} />
            </div>

            <div className="c2-plan-cell c2-plan-cell-center">
              <span>{row.edit}</span>
              <Decoration decoration={row.decoCol2} />
            </div>

            <div className="c2-plan-cell c2-plan-cell-right">
              <ul>
                {row.guide.map((guide) => (
                  <li key={guide}>{guide}</li>
                ))}
              </ul>
              <Decoration decoration={row.decoCol3} />
            </div>
          </div>
        ))}
      </div>
    </TrailSection>
  );
}

export default PlanSection;
