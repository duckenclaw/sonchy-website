import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useRocketLaunch } from './use-rocket-launch';

const HREF = 'https://app.lava.top/products/test';

describe('useRocketLaunch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('open', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens the payment link once per launch', () => {
    const { result } = renderHook(() => useRocketLaunch());

    act(() => result.current.launch('cards', HREF));

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(HREF, '_blank', 'noopener,noreferrer');
  });

  // Regression: the guard read `launching` from state, so two clicks dispatched
  // before React re-rendered both passed it and opened two payment tabs.
  it('ignores a second click in the same tick', () => {
    const { result } = renderHook(() => useRocketLaunch());

    act(() => {
      result.current.launch('cards', HREF);
      result.current.launch('cards', HREF);
      result.current.launch('tariff-listener', HREF);
    });

    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('stays blocked until the animation resets, then allows a new launch', () => {
    const { result } = renderHook(() => useRocketLaunch());

    act(() => result.current.launch('cards', HREF));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.launch('cards', HREF));
    expect(window.open).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.launch('cards', HREF));
    expect(window.open).toHaveBeenCalledTimes(2);
  });

  it('gives every star a unique key across launches', () => {
    const { result } = renderHook(() => useRocketLaunch());

    act(() => result.current.launch('cards', HREF));
    const first = result.current.renderStars('cards') as { key: string }[];

    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.launch('cards', HREF));
    const second = result.current.renderStars('cards') as { key: string }[];

    const keys = [...first, ...second].map((star) => star.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('renders stars only for the button that was pressed', () => {
    const { result } = renderHook(() => useRocketLaunch());

    act(() => result.current.launch('tariff-consult', HREF));

    expect(result.current.renderStars('tariff-consult')).not.toBeNull();
    expect(result.current.renderStars('cards')).toBeNull();
  });
});
