import { Fragment } from 'react';

import TrailSection from '../trail-section';
import { CALENDAR_DAYS, WEEKDAY_LABELS } from '../courses-data';

interface CalendarSectionProps {
  isTouch: boolean;
}

/** The taped-up wall calendar showing which day covers which topic. */
function CalendarSection({ isTouch }: CalendarSectionProps) {
  return (
    <TrailSection className="c2-calendar-section" isTouch={isTouch}>
      <div className="c2-section-title">
        <h2>ПРОГРАММА КРАТКО</h2>
        <span className="c2-subdate">24 сент – 4 окт</span>
      </div>

      <div className="c2-calendar-panel">
        <div className="c2-calendar-tape t-tl" />
        <div className="c2-calendar-tape t-tr" />
        <div className="c2-calendar-tape t-bl" />

        <div className="c2-calendar-month">
          <div className="c2-calendar-month-scribble" />
          <span>сентябрь – октябрь</span>
        </div>

        <div className="c2-calendar-grid">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="c2-calendar-dow">
              {label}
            </div>
          ))}

          {CALENDAR_DAYS.map(({ day, event, muted }) => (
            <div
              key={`${day}-${event?.label ?? ''}`}
              className={`c2-calendar-cell ${event ? 'c-event' : ''} ${muted ? 'c-muted' : ''}`}
            >
              <span className="c2-calendar-num">{day}</span>
              {event && (
                <>
                  <img className="c2-day-img" src={event.image} alt={event.alt} />
                  <span className="c2-day-label">
                    {event.label.split('\n').map((line, i) => (
                      <Fragment key={line}>
                        {i > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="c2-calendar-notes">
          <ul>
            <li>7 лекций по 2 часа</li>
            <li>в зуме в 13:00</li>
          </ul>
          <ul>
            <li>записи лекций до 4 января</li>
            <li>гайд отправляется до лекции</li>
          </ul>
        </div>
      </div>
    </TrailSection>
  );
}

export default CalendarSection;
