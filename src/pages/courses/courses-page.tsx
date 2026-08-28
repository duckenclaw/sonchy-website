import { useRef } from 'react';

import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import DoodleBackground from './doodle-background';
import { useRocketLaunch } from './use-rocket-launch';
import AboutSection from './sections/about-section';
import BookSection from './sections/book-section';
import CalendarSection from './sections/calendar-section';
import CardsSection from './sections/cards-section';
import HeaderSection from './sections/header-section';
import ParticipateSection from './sections/participate-section';
import PlanSection from './sections/plan-section';
import TariffSection from './sections/tariff-section';
import './courses.css';

/**
 * The Writer Autumn landing page. It opts out of the shared page shell — the
 * whole page is its own design, top to bottom. Copy lives in courses-data.ts.
 */
function CoursesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const launch = useRocketLaunch();

  return (
    <div className="app courses2-app" ref={pageRef}>
      <DoodleBackground pageRef={pageRef} />

      <HeaderSection />
      <AboutSection />
      <CalendarSection isTouch={isTouch} />
      <CardsSection isTouch={isTouch} launch={launch} />
      <BookSection />
      <PlanSection isTouch={isTouch} />
      <ParticipateSection />
      <TariffSection launch={launch} />

      <div className="c2-footer-purple" />
    </div>
  );
}

export default CoursesPage;
