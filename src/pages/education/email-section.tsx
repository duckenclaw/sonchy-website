import { useState } from 'react';

import { EMAIL_SECTION } from './education-data';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface EmailSectionProps {
  /** Which free material to mail. Must match a key of MATERIALS on the server. */
  material: string;
}

/**
 * Collects an email address and asks the server to mail one free material to
 * it. Nothing is stored — the server sends and forgets. See EMAIL-SETUP.md.
 *
 * Lives inside the lecture modal, so its colours are tuned for the pale blue
 * modal window rather than the purple page.
 */
function EmailSection({ material }: EmailSectionProps) {
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const isSubmitting = status === 'submitting';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = email.trim();
    // A sanity check only; the server is the real validator.
    if (!trimmed.includes('@')) {
      setStatus('error');
      setMessage(EMAIL_SECTION.invalidMessage);
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, botField, material }),
      });

      if (!response.ok) {
        setStatus('error');
        setMessage(
          response.status === 400 ? EMAIL_SECTION.invalidMessage : EMAIL_SECTION.errorMessage,
        );
        return;
      }

      setStatus('success');
      setMessage(EMAIL_SECTION.successMessage);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage(EMAIL_SECTION.errorMessage);
    }
  }

  // Several of these ids appear once per mounted form, and the modal keeps one
  // form per lecture, so they are scoped by material to stay unique.
  const inputId = `email-section-input-${material}`;
  const honeypotId = `email-section-website-${material}`;

  return (
    <section className="email-section">
      <h3 className="email-section-title">{EMAIL_SECTION.title}</h3>
      <p className="email-section-text">{EMAIL_SECTION.text}</p>

      <form className="email-section-form" onSubmit={handleSubmit} noValidate>
        <label className="email-section-hidden" htmlFor={inputId}>
          {EMAIL_SECTION.inputLabel}
        </label>
        <input
          id={inputId}
          className="email-section-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={EMAIL_SECTION.inputPlaceholder}
          autoComplete="email"
          required
          disabled={isSubmitting}
        />

        {/* Honeypot: hidden from people, tempting to bots. */}
        <div className="email-section-hidden" aria-hidden="true">
          <label htmlFor={honeypotId}>Website</label>
          <input
            id={honeypotId}
            type="text"
            name="website"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button type="submit" className="email-section-submit" disabled={isSubmitting}>
          {isSubmitting ? EMAIL_SECTION.sendingLabel : EMAIL_SECTION.submitLabel}
        </button>
      </form>

      <p
        className={`email-section-status ${
          status === 'success'
            ? 'email-section-status-success'
            : status === 'error'
              ? 'email-section-status-error'
              : ''
        }`}
        aria-live="polite"
      >
        {message}
      </p>
    </section>
  );
}

export default EmailSection;
