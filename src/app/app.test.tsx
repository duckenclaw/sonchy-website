import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import App from './app';
import { ROUTES, routeTo } from './routes';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

/** Titles are split across elements by <br>, so match on flattened text. */
async function expectHeading(text: string) {
  const found = await screen.findAllByText(
    (_, element) => element?.textContent?.replace(/\s+/g, '') === text.replace(/\s+/g, ''),
    {},
    { timeout: 3000 },
  );
  expect(found.length).toBeGreaterThan(0);
}

describe('routes', () => {
  const pages: [string, string][] = [
    [routeTo(ROUTES.HOME), 'СОНЧИ УТОЧКИНА'],
    [routeTo(ROUTES.ABOUT), 'ОБО МНЕ'],
    [routeTo(ROUTES.SERVICES), 'УСЛУГИ'],
    [routeTo(ROUTES.CONSULTING), 'КОНСУЛЬТАЦИИ'],
    [routeTo(ROUTES.LECTURES), 'ЛЕКЦИИ/ВОРКШОПЫ'],
    [routeTo(ROUTES.PROJECTS), 'ПРОЕКТНАЯ РАБОТА'],
    [routeTo(ROUTES.EDUCATION), 'ОБУЧЕНИЕ'],
    [routeTo(ROUTES.COURSES), 'WRITERAUTUMN'],
  ];

  it.each(pages)('%s renders its page', async (path, heading) => {
    renderAt(path);
    await expectHeading(heading);
  });
});

describe('unknown routes', () => {
  it('falls back to the placeholder for a top-level path', async () => {
    renderAt(routeTo(ROUTES.CONTACTS));
    await expectHeading('CONTACTS');
  });

  // Regression: the catch-all used to be `/:section`, which matches a single
  // segment only, so a nested unknown path rendered nothing at all.
  it('falls back to the placeholder for a nested path', async () => {
    renderAt('/services/does-not-exist');
    await expectHeading('DOES-NOT-EXIST');
  });
});
