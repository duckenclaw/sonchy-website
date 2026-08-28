import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LectureModal from './lecture-modal';
import type { Lecture } from './lecture';

const LECTURE: Lecture = {
  id: 1,
  description: 'Тестовая лекция',
  price: '2590 Р',
  coverImage: '/education/lecture-1.webp',
  buyLink: 'https://app.lava.top/products/test',
  images: ['/education/a.webp', '/education/b.webp'],
};

function renderModal(isOpen: boolean, onClose = vi.fn()) {
  const utils = render(
    <>
      <button type="button">trigger</button>
      <LectureModal
        lecture={LECTURE}
        isOpen={isOpen}
        position={0}
        onClose={onClose}
        onBuyClick={vi.fn()}
      />
    </>,
  );
  return { ...utils, onClose };
}

describe('LectureModal focus management', () => {
  it('moves focus into the dialog when it opens', () => {
    renderModal(true);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    renderModal(true);

    const dialog = screen.getByRole('dialog');
    // Cycle past the end of the dialog's controls; focus must not escape.
    for (let i = 0; i < 12; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('returns focus to the trigger when it closes', () => {
    const tree = (isOpen: boolean) => (
      <>
        <button type="button">trigger</button>
        <LectureModal
          lecture={LECTURE}
          isOpen={isOpen}
          position={0}
          onClose={vi.fn()}
          onBuyClick={vi.fn()}
        />
      </>
    );

    const { rerender } = render(tree(false));
    const trigger = screen.getByRole('button', { name: 'trigger' });
    trigger.focus();

    rerender(tree(true));
    expect(document.activeElement).not.toBe(trigger);

    rerender(tree(false));
    expect(document.activeElement).toBe(trigger);
  });

  // Regression: the overlay stays mounted and is hidden with opacity alone, so
  // without `inert` its buttons stayed in the tab order behind the page.
  it('is inert while closed', () => {
    renderModal(false);
    expect(screen.getByRole('dialog', { hidden: true }).parentElement).toHaveAttribute('inert');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
