import { ROUTES } from '@/app/routes';
import type { RouteValue } from '@/app/routes';

export interface HomeBlock {
  image: string;
  title: string;
  /** Rendered as two lines when it contains a newline. */
  description: string;
  alt: string;
  position: 'left' | 'right';
  route: RouteValue;
}

export const HOME_BLOCKS: HomeBlock[] = [
  {
    image: '/home/education.webp',
    title: 'ОБУЧЕНИЕ',
    description: 'лекции, материалы, курсы',
    alt: 'education',
    position: 'left',
    route: ROUTES.EDUCATION,
  },
  {
    image: '/home/services.webp',
    title: 'УСЛУГИ',
    description: 'воркшопы, лекции,\nконсультации',
    alt: 'services',
    position: 'right',
    route: ROUTES.SERVICES,
  },
  {
    image: '/home/about.webp',
    title: 'ОБО МНЕ',
    description: 'тут я выпендриваюсь',
    alt: 'about',
    position: 'left',
    route: ROUTES.ABOUT,
  },
];
