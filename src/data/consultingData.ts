export interface ConsultingPackage {
  id: string;
  image: string;
  title: string;
  bonuses: string[];
  description: string;
  price: string;
  alt: string;
}

export const CONSULTING_PACKAGES: ConsultingPackage[] = [
  {
    id: 'giga',
    image: '/giga.png',
    title: 'ГИГА',
    bonuses: [
      '1,5 - 2 часа',
      '2 недели сопровождение в чате',
      'PDF с гайдами и примерами для реализации проекта'
    ],
    description: 'Подходит для больших организаций или масштабных запросов, как стратегия развития бренда на год или TOV компании.',
    price: '650$',
    alt: 'giga'
  },
  {
    id: 'express',
    image: '/express.png',
    title: 'ЭКСПРЕСС',
    bonuses: [
      '45 мин. - 1 час',
      '2 дня сопровождения в чате',
      'список источников/референсов',
      'без конспектов и материалов',
      'можно делать видеозапись'
    ],
    description: 'Хватит времени, чтобы обсудить определённый аспект проекта, побрейнштормить или получить отклик на материал.',
    price: '210$',
    alt: 'express'
  }
];
