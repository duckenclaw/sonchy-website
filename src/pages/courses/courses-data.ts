/**
 * Everything the Writer Autumn landing page says, kept apart from how it looks.
 * Update copy, prices and payment links here.
 */

/** The three ways to join the intensive. */
export type TierId = 'listener' | 'trying' | 'consult';

export interface Tier {
  id: TierId;
  /** Sticky-note label — differs from the tariff-table name by design. */
  stickyTitle: string;
  stickyClass: string;
  blurb: string;
  seats: string | null;
  price: string;
  /** Tariff-table column heading. */
  tableName: string;
  /** Blocks both purchase buttons for the tier and shows SOLD OUT instead. */
  soldOut?: boolean;
}

export const PAYMENT_LINKS: Record<TierId, string> = {
  listener: 'https://app.lava.top/products/2e904852-f5f2-4f28-8039-b4fdcdee5358',
  trying: 'https://app.lava.top/products/a504d32c-85b6-4bef-ad89-97ebc8fa1285',
  consult: 'https://app.lava.top/products/bd25d7a6-2fb5-4a5d-a613-b9242abb2d43',
};

/** The general CTA opens the storefront rather than a single product. */
export const STOREFRONT_LINK = 'https://app.lava.top/xsonchy?sort=published';

export const TIERS: Tier[] = [
  {
    id: 'listener',
    stickyTitle: 'НОВИЧКУ',
    stickyClass: 's-novichku',
    blurb:
      'есть идея, но не знаю, стоит ли в нее вкладываться, хочу послушать курс лекций и решить сам',
    seats: null,
    price: '10 900 ₽',
    tableName: 'НОВИЧОК',
  },
  {
    id: 'trying',
    stickyTitle: 'ПРОБУЮЩЕМУ',
    stickyClass: 's-probuyushchemu',
    blurb:
      'есть отрывки и черновики, но хочу написать что-то цельное. не хватает обратной связи и упражнений',
    seats: '30 мест!',
    price: '17 900 ₽',
    tableName: 'ПРОБУЮЩИЙ',
  },
  {
    id: 'consult',
    stickyTitle: 'С КОНСУЛЬТАЦИЯМИ',
    stickyClass: 's-consult',
    blurb: 'есть рукопись или готов писать сейчас — нужно личное сопровождение и полный разбор',
    seats: '0 мест',
    price: '33 900 ₽',
    tableName: 'С КОНСУЛЬТАЦИЯМИ',
    soldOut: true,
  },
];

/** `true` renders a check, `false` a dash, a string renders as-is. */
export type TariffCell = boolean | string;

export interface TariffRow {
  label: string;
  values: [TariffCell, TariffCell, TariffCell];
}

export const TARIFF_ROWS: TariffRow[] = [
  { label: 'Кол-во мест', values: ['∞', '30 мест', '4 места'] },
  { label: '7 лекций + записи интенсива', values: [true, true, true] },
  { label: '7 практических гайдов', values: [true, true, true] },
  { label: 'Доступ в общий чат писателей', values: [true, true, true] },
  {
    label: 'Отрывки на разбор',
    values: [false, '7 отрывков (по 1 на тему)', '7 отрывков (по 1 на тему)'],
  },
  {
    label: 'Разбор текстов на лекции',
    values: [false, 'выборочно на лекции', 'Все в отдельном видео'],
  },
  { label: 'Письменный фидбек от мастера', values: [false, true, true] },
  { label: 'Индивидуальная редактура', values: [false, false, true] },
  { label: 'Помощь с гайдами', values: [false, false, true] },
  { label: '2 личные зум-консультации', values: [false, false, true] },
  { label: 'Доступ к материалам', values: ['3 месяца', '3 месяца', 'навсегда'] },
];

export interface PlanDecoration {
  src: string;
  className: string;
}

export interface PlanRow {
  /** Lecture number; also selects the row colour via `.c2-plan-row-<n>`. */
  n: number;
  name: string;
  studyBody: string;
  edit: string;
  guide: string[];
  /** Doodles pinned into the three columns of the row. */
  decoCol1?: PlanDecoration;
  decoCol2?: PlanDecoration;
  decoCol3?: PlanDecoration;
}

export const PLAN_ROWS: PlanRow[] = [
  {
    n: 1,
    name: 'Идея, заявка, конфликт',
    studyBody: 'оценка идеи и развитие ее до главного конфликта и темы, оформление в заявку',
    edit: 'логлайн (краткое описание истории)',
    guide: ['заявка для издательства', 'презентация'],
    decoCol1: { src: '/courses/lamp-plan-decoration.svg', className: 'deco-lamp' },
    decoCol3: { src: '/courses/book-plan-decoration.svg', className: 'deco-book' },
  },
  {
    n: 2,
    name: 'Мир и исследование',
    studyBody: 'изучение и создание конфликтной среды, где будут происходить действия романа',
    edit: 'сцена первого знакомства с миром и окружением',
    guide: ['устройство мира', 'лорные записки'],
    decoCol1: { src: '/courses/star-plan-decoration.svg', className: 'deco-star' },
    decoCol2: { src: '/courses/sun-plan-decoration.svg', className: 'deco-sun' },
    decoCol3: { src: '/courses/waves-plan-decoration.svg', className: 'deco-waves' },
  },
  {
    n: 3,
    name: 'Главный герой',
    studyBody: 'детальная проработка главного героя и его арки',
    edit: 'экспозиция главного героя или злодея',
    guide: ['библия персонажей'],
    decoCol2: {
      src: '/courses/exclamation-plan-decoration.svg',
      className: 'deco-exclamation',
    },
    decoCol3: { src: '/courses/characters-plan-decoration.svg', className: 'deco-characters' },
  },
  {
    n: 4,
    name: 'Сюжет и драматургия',
    studyBody: 'выбор сюжетной структуры и типа планирования истории',
    edit: 'синопсис книги',
    guide: ['поэпизодный план в карточках'],
    decoCol1: { src: '/courses/check-plan-decoration.svg', className: 'deco-check' },
    decoCol2: { src: '/courses/synopsis-plan-decoration.svg', className: 'deco-synopsis' },
    decoCol3: { src: '/courses/episode-plan-decoration.svg', className: 'deco-episode' },
  },
  {
    n: 5,
    name: 'Диалоги и взаимоотношения',
    studyBody: 'раскрытие второстепенных героев через действия и реплики',
    edit: 'диалог главного конфликта героев',
    guide: ['речевая карта', 'план 5 ключевых диалогов'],
  },
  {
    n: 6,
    name: 'Стиль и нарратив',
    studyBody: 'основа литературного монтажа, поиск авторского стиля',
    edit: 'описание обстановки или эмоционального состояния героя',
    guide: ['нарративный автопортрет (аналитика своего стиля)'],
  },
  {
    n: 7,
    name: 'Редактура и продвижение',
    studyBody: 'завершающая лекция о будущем черновика',
    edit: 'редактура сценарной заявки для издательства',
    guide: ['стратегия продвижения книги', 'план по редактуре'],
  },
];

export interface CalendarDay {
  day: number;
  /** Lecture days carry an icon and a caption. */
  event?: { image: string; alt: string; label: string };
  /** Days after the intensive ends are greyed out. */
  muted?: boolean;
}

/** Three weeks, Monday-first, spanning 21 сентября – 11 октября. */
export const CALENDAR_DAYS: CalendarDay[] = [
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24, event: { image: '/courses/calendar-idea.svg', alt: 'Идея', label: 'Идея!' } },
  { day: 25, event: { image: '/courses/calendar-world.svg', alt: 'Мир', label: 'Мир' } },
  {
    day: 26,
    event: {
      image: '/courses/calendar-characters.svg',
      alt: 'Персонажи',
      label: 'Персонажи!',
    },
  },
  { day: 27, event: { image: '/courses/calendar-plot.svg', alt: 'Сюжет', label: 'Сюжет!' } },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 1 },
  {
    day: 2,
    event: { image: '/courses/calendar-dialog.svg', alt: 'Диалоги', label: 'Диалоги' },
  },
  { day: 3, event: { image: '/courses/calendar-style.svg', alt: 'Стиль', label: 'Стиль' } },
  {
    day: 4,
    event: {
      image: '/courses/calendar-development.svg',
      alt: 'Продвижение',
      // Split so the caption wraps mid-word inside the narrow cell.
      label: 'Продви-\nжение',
    },
  },
  { day: 5, muted: true },
  { day: 6, muted: true },
  { day: 7, muted: true },
  { day: 8, muted: true },
  { day: 9, muted: true },
  { day: 10, muted: true },
  { day: 11, muted: true },
];

export const WEEKDAY_LABELS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
