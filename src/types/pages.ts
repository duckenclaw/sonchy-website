export const PageType = {
  MAIN: 'ГЛАВНАЯ',
  SERVICES: 'УСЛУГИ',
  CONTACTS: 'КОНТАКТЫ',
} as const;

export type PageTypeName = typeof PageType[keyof typeof PageType];
