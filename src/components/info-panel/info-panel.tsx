import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES, routeTo } from '@/app/routes';
import CardOutline from '@/components/card-outline/card-outline';
import './info-panel.css';

/** A line of copy in the panel. `alignEnd` right-aligns the bubble on desktop. */
export interface PanelBubble {
  text: string;
  alignEnd?: boolean;
}

export interface PanelAction {
  label: string;
  /** Picks the button artwork. */
  style: 'contact' | 'portfolio';
}

interface InfoPanelProps {
  /** Style hook for the per-page differences; see info-panel.css. */
  variant: 'lectures' | 'projects';
  /** Title printed above the panel on mobile, where the header is hidden. */
  mobileTitle: React.ReactNode;
  character: { src: string; alt: string };
  bubbles: PanelBubble[];
  /** Optional client-logo strip, shown after this many bubbles. */
  logos?: { desktop: string; mobile: string; alt: string; afterBubble: number };
  /** Price pill shown next to the buttons. */
  price?: string;
  actions: PanelAction[];
}

/**
 * The speech-bubble card shared by the Lectures and Projects pages. Desktop and
 * mobile render as separate trees because the artwork differs too much to
 * reflow, but both are driven by the same props.
 */
function InfoPanel({
  variant,
  mobileTitle,
  character,
  bubbles,
  logos,
  price,
  actions,
}: InfoPanelProps) {
  const navigate = useNavigate();
  const panelClass = `panel-${variant}`;

  const renderBubbles = () =>
    bubbles.map((bubble) => (
      <div key={bubble.text} className={`speech-bubble ${bubble.alignEnd ? 'bottom' : ''}`}>
        {bubble.text}
      </div>
    ));

  const renderActions = () => (
    <div className="info-panel-actions">
      {price && <div className="info-panel-price">{price}</div>}
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`info-panel-button info-panel-button-${action.style}`}
          onClick={() => navigate(routeTo(ROUTES.CONTACTS))}
        >
          {action.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className={`info-panel-desktop ${panelClass}`}>
        <div className="info-panel-frame">
          <div className="info-panel-visual">
            <img src={character.src} alt={character.alt} className="info-panel-character" />
            {logos && <img src={logos.desktop} alt={logos.alt} className="info-panel-logos" />}
          </div>
          <div className="info-panel-content">
            {renderBubbles()}
            {renderActions()}
          </div>
        </div>
      </div>

      <div className={`info-panel-mobile ${panelClass}`}>
        <div className="info-panel-title">{mobileTitle}</div>
        <img src={character.src} alt={character.alt} className="info-panel-character" />
        <CardOutline className="info-panel-bg" />

        <div className="info-panel-body">
          <div className="info-panel-content">
            {bubbles.map((bubble, index) => (
              <Fragment key={bubble.text}>
                <div className={`speech-bubble ${bubble.alignEnd ? 'bottom' : ''}`}>
                  {bubble.text}
                </div>
                {logos?.afterBubble === index + 1 && (
                  <img src={logos.mobile} alt={logos.alt} className="info-panel-logos-mobile" />
                )}
              </Fragment>
            ))}
            {renderActions()}
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoPanel;
