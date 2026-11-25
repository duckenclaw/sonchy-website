import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import EmailSection from './email-section';
import { EMAIL_SECTION } from './education-data';

function mockFetch(response: Partial<Response>) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, ...response });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('EmailSection', () => {
  it('posts the address and reports success', async () => {
    const fetchMock = mockFetch({ ok: true, status: 200 });
    render(<EmailSection material="constructor" />);

    await userEvent.type(screen.getByLabelText(EMAIL_SECTION.inputLabel), 'reader@example.com');
    await userEvent.click(screen.getByRole('button', { name: EMAIL_SECTION.submitLabel }));

    await waitFor(() => {
      expect(screen.getByText(EMAIL_SECTION.successMessage)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/subscribe');
    expect(JSON.parse(init.body)).toEqual({
      email: 'reader@example.com',
      botField: '',
      material: 'constructor',
    });
  });

  it('rejects an address without an @ without calling the server', async () => {
    const fetchMock = mockFetch({ ok: true, status: 200 });
    render(<EmailSection material="constructor" />);

    await userEvent.type(screen.getByLabelText(EMAIL_SECTION.inputLabel), 'not-an-address');
    await userEvent.click(screen.getByRole('button', { name: EMAIL_SECTION.submitLabel }));

    expect(await screen.findByText(EMAIL_SECTION.invalidMessage)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports an error when the server fails', async () => {
    mockFetch({ ok: false, status: 502 });
    render(<EmailSection material="constructor" />);

    await userEvent.type(screen.getByLabelText(EMAIL_SECTION.inputLabel), 'reader@example.com');
    await userEvent.click(screen.getByRole('button', { name: EMAIL_SECTION.submitLabel }));

    expect(await screen.findByText(EMAIL_SECTION.errorMessage)).toBeInTheDocument();
  });

  it('reports an error when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(<EmailSection material="constructor" />);

    await userEvent.type(screen.getByLabelText(EMAIL_SECTION.inputLabel), 'reader@example.com');
    await userEvent.click(screen.getByRole('button', { name: EMAIL_SECTION.submitLabel }));

    expect(await screen.findByText(EMAIL_SECTION.errorMessage)).toBeInTheDocument();
  });
});
