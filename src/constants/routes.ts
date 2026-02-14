export const ROUTES = {
  HOME: '',
  SERVICES: 'services',
  CONTACTS: 'contacts',
  CONSULTING: 'services/consulting',
  LECTURES: 'services/lectures',
  PROJECTS: 'services/projects',
  EDUCATION: 'education',
  COURSES: 'courses',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
