import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTES } from './routes';
import HomePage from '@/pages/home/home-page';

/*
 * Only the landing page is in the initial bundle. Every other page — and, more
 * to the point, its stylesheet — is fetched when someone actually navigates to
 * it. Courses alone is a third of the site's CSS.
 */
const AboutPage = lazy(() => import('@/pages/about/about-page'));
const ConsultingPage = lazy(() => import('@/pages/consulting/consulting-page'));
const CoursesPage = lazy(() => import('@/pages/courses/courses-page'));
const EducationPage = lazy(() => import('@/pages/education/education-page'));
const LecturesPage = lazy(() => import('@/pages/lectures/lectures-page'));
const BlankPage = lazy(() => import('@/pages/not-found/blank-page'));
const ProjectsPage = lazy(() => import('@/pages/projects/projects-page'));
const ServicesPage = lazy(() => import('@/pages/services/services-page'));

function App() {
  return (
    // The page background is painted by <body>, so an empty fallback reads as
    // the artwork holding still for a moment rather than as a blank screen.
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={`/${ROUTES.SERVICES}`} element={<ServicesPage />} />
        <Route path={`/${ROUTES.CONSULTING}`} element={<ConsultingPage />} />
        <Route path={`/${ROUTES.LECTURES}`} element={<LecturesPage />} />
        <Route path={`/${ROUTES.PROJECTS}`} element={<ProjectsPage />} />
        <Route path={`/${ROUTES.COURSES}`} element={<CoursesPage />} />
        <Route path={`/${ROUTES.EDUCATION}`} element={<EducationPage />} />
        <Route path={`/${ROUTES.ABOUT}`} element={<AboutPage />} />
        <Route path="*" element={<BlankPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
