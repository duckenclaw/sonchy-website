export const PageType = {
  MAIN: 'ГЛАВНАЯ',
  SERVICES: 'УСЛУГИ',
  CONTACTS: 'КОНТАКТЫ',
  CONSULTING: 'КОНСУЛЬТАЦИИ',
} as const;

export type PageTypeName = typeof PageType[keyof typeof PageType];
