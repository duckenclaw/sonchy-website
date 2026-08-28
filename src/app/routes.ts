/** Every route the app serves. Values are paths without a leading slash. */
export const ROUTES = {
  HOME: '',
  ABOUT: 'about',
  SERVICES: 'services',
  CONSULTING: 'services/consulting',
  LECTURES: 'services/lectures',
  PROJECTS: 'services/projects',
  EDUCATION: 'education',
  COURSES: 'courses',
  CONTACTS: 'contacts',
} as const;

export type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];

/** Builds an absolute path for `navigate()` and `<Link to>`. */
export function routeTo(route: RouteValue): string {
  return `/${route}`;
}
