export interface AboutDecoration {
  src: string;
  width: number;
  height: number;
}

export interface AboutBlock {
  /** Matches the `.about-block-<id>` rule that positions the block. */
  id: string;
  title: string;
  texts?: string[];
  decorations: AboutDecoration[];
  /** Artwork sits centred under the title instead of in a corner. */
  centeredDecoration?: boolean;
  /** Placeholder links; enabled once the target pages exist. */
  links?: string[];
}

export const ABOUT_BLOCKS: AboutBlock[] = [
  {
    id: 'education',
    title: 'Образование.',
    texts: [
      'Художественный переводчик с французского, Литературный институт им. А. М. Горького.',
      'Сейчас только перевожу продукты в доме, но меня научили адаптировать стиль к любому жанру текста, что помогло в работе.',
    ],
    decorations: [{ src: '/about/education.webp', width: 95, height: 111 }],
  },
  {
    id: 'writer',
    title: 'Писательница.',
    texts: [
      'Да, с книжками, да издательство выбрало.',
      'Сейчас пишу фэнси версию Ведьмака с гиперпоп ведьмами. И ещё делаем из неё визуальную новеллу!',
      'Я так развлекаюсь.',
    ],
    decorations: [
      { src: '/about/writer0.webp', width: 131, height: 173 },
      { src: '/about/writer1.webp', width: 88, height: 92 },
    ],
  },
  {
    id: 'new-book',
    title: 'Новая книжка!',
    decorations: [{ src: '/about/new_book.webp', width: 178, height: 157 }],
    centeredDecoration: true,
  },
  {
    id: 'anti-ty',
    title: 'Рецензия на «анти-ты»',
    decorations: [{ src: '/about/anti_ty.webp', width: 190, height: 160 }],
    centeredDecoration: true,
  },
  {
    id: 'consultant',
    title: 'Консультантка.',
    texts: [
      'Работаю креативной консультанткой, потому что мне нравится вариативность.',
      'Последние три года над проектами в геймдеве как нарративный дизайнер.',
      'Можно посмотреть что я могу через портфолио',
    ],
    decorations: [{ src: '/about/consultant.webp', width: 145, height: 185 }],
  },
  {
    id: 'lector',
    title: 'Лекторка.',
    texts: [
      'Помимо всего я обожаю преподавать. Провожу тематические лекции, воркшопы, недавно начала вести группы и курсы.',
      'Материалы авторские, потому что у меня загон на эту тему',
    ],
    links: ['Открытая лекция', 'Учебные материалы'],
    decorations: [{ src: '/about/lector.webp', width: 120, height: 181 }],
  },
  {
    id: 'setters',
    title: 'Сеттерс о моей профессии',
    decorations: [{ src: '/about/setter.webp', width: 204, height: 153 }],
    centeredDecoration: true,
  },
  {
    id: 'more',
    title: 'Ещё чуть-чуть обо мне!',
    texts: [
      'Обожаю видеоигры, занудные эсе против капитализма и ещё во мне осталось немного любви к литературе.',
      'Мои соц. сети в основном о попкультуре и разных сторителлинговских приёмах.',
    ],
    decorations: [
      { src: '/about/more0.webp', width: 123, height: 148 },
      { src: '/about/more1.webp', width: 106, height: 98 },
    ],
  },
  {
    id: 'visual-novel',
    title: 'Визуальная новелла!',
    decorations: [{ src: '/about/visual_novel.webp', width: 173, height: 113 }],
    centeredDecoration: true,
  },
];
