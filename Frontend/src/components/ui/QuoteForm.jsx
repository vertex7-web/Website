import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { getMachines } from '../../data/machines';
import { getServices } from '../../data/services';
import './QuoteForm.css';

/* ── Rate-limit helper (client-side) ──────────────────────── */
const RATE_LIMIT_KEY = 'v7_quote_last';
const RATE_LIMIT_MS = 60_000; // 1 min between submissions

function isRateLimited() {
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return false;
  return Date.now() - Number(last) < RATE_LIMIT_MS;
}

function markSubmitted() {
  localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
}

/* ── Validation ───────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.name.trim()) errors.name = 'Name is required.';
  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.';
  }
  if (!data.service) errors.service = 'Please select a service.';
  if (!data.message.trim()) errors.message = 'Message is required.';

  return errors;
}

/* ── Initial Form State ───────────────────────────────────── */
const INITIAL = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  equipment: '',
  duration: '',
  message: '',
  _honeypot: '', // spam trap
};

export default function QuoteForm() {
  const machines = getMachines();
  const services = getServices();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot check
    if (form._honeypot) return;

    // Rate limiting
    if (isRateLimited()) {
      setStatus('error');
      setErrorMessage('Please wait a moment before submitting again.');
      return;
    }

    // Validate
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      /* ── Submit to API ──────────────────────────────────────
         Replace this URL with your actual backend endpoint.
         Options:
         • Netlify Functions: /.netlify/functions/quote
         • Vercel Serverless: /api/quote
         • Supabase Edge Function
         • Any REST endpoint
         ────────────────────────────────────────────────────── */
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          equipment: form.equipment,
          duration: form.duration,
          message: form.message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      markSubmitted();
      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Something went wrong. Please try again or contact us directly.'
      );
    }
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="quote-form__success" role="alert">
        <div className="quote-form__success-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="quote-form__success-title">Quote Request Sent</h3>
        <p className="quote-form__success-text">
          Thank you for your inquiry. Our team will review your request and get
          back to you within one business day.
        </p>
        <button
          type="button"
          className="btn btn--outline-lime btn--md"
          onClick={() => setStatus('idle')}
        >
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      className="quote-form"
      onSubmit={handleSubmit}
      ref={formRef}
      noValidate
    >
      {/* Error Banner */}
      {status === 'error' && (
        <div className="quote-form__error-banner" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot — hidden from real users */}
      <div className="quote-form__hp" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="quote-hp">Leave empty</label>
        <input
          type="text"
          id="quote-hp"
          name="_honeypot"
          value={form._honeypot}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {/* Row 1: Name + Company */}
      <div className="quote-form__row">
        <div className="quote-form__field">
          <label htmlFor="quote-name" className="quote-form__label">
            Full Name <span className="quote-form__required">*</span>
          </label>
          <input
            type="text"
            id="quote-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`quote-form__input ${errors.name ? 'quote-form__input--error' : ''}`}
            placeholder="Juan Dela Cruz"
            autoComplete="name"
          />
          {errors.name && <span className="quote-form__error">{errors.name}</span>}
        </div>

        <div className="quote-form__field">
          <label htmlFor="quote-company" className="quote-form__label">
            Company
          </label>
          <input
            type="text"
            id="quote-company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="quote-form__input"
            placeholder="Company name (optional)"
            autoComplete="organization"
          />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="quote-form__row">
        <div className="quote-form__field">
          <label htmlFor="quote-email" className="quote-form__label">
            Email Address <span className="quote-form__required">*</span>
          </label>
          <input
            type="email"
            id="quote-email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`quote-form__input ${errors.email ? 'quote-form__input--error' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <span className="quote-form__error">{errors.email}</span>}
        </div>

        <div className="quote-form__field">
          <label htmlFor="quote-phone" className="quote-form__label">
            Phone Number <span className="quote-form__required">*</span>
          </label>
          <input
            type="tel"
            id="quote-phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`quote-form__input ${errors.phone ? 'quote-form__input--error' : ''}`}
            placeholder="09XX XXX XXXX"
            autoComplete="tel"
          />
          {errors.phone && <span className="quote-form__error">{errors.phone}</span>}
        </div>
      </div>

      {/* Row 3: Service + Equipment */}
      <div className="quote-form__row">
        <div className="quote-form__field">
          <label htmlFor="quote-service" className="quote-form__label">
            Service Needed <span className="quote-form__required">*</span>
          </label>
          <select
            id="quote-service"
            name="service"
            value={form.service}
            onChange={handleChange}
            className={`quote-form__select ${errors.service ? 'quote-form__input--error' : ''}`}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>{s.title}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.service && <span className="quote-form__error">{errors.service}</span>}
        </div>

        <div className="quote-form__field">
          <label htmlFor="quote-equipment" className="quote-form__label">
            Equipment Needed
          </label>
          <select
            id="quote-equipment"
            name="equipment"
            value={form.equipment}
            onChange={handleChange}
            className="quote-form__select"
          >
            <option value="">Select equipment (optional)</option>
            {machines.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
            <option value="Multiple">Multiple / Not Sure</option>
          </select>
        </div>
      </div>

      {/* Row 4: Duration */}
      <div className="quote-form__field">
        <label htmlFor="quote-duration" className="quote-form__label">
          Estimated Rental Duration
        </label>
        <select
          id="quote-duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="quote-form__select"
        >
          <option value="">Select duration (optional)</option>
          <option value="1-3 days">1–3 days</option>
          <option value="1 week">1 week</option>
          <option value="2-4 weeks">2–4 weeks</option>
          <option value="1-3 months">1–3 months</option>
          <option value="3+ months">3+ months</option>
          <option value="Not sure">Not sure</option>
        </select>
      </div>

      {/* Row 5: Message */}
      <div className="quote-form__field">
        <label htmlFor="quote-message" className="quote-form__label">
          Project Details / Message <span className="quote-form__required">*</span>
        </label>
        <textarea
          id="quote-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          className={`quote-form__textarea ${errors.message ? 'quote-form__input--error' : ''}`}
          rows="5"
          placeholder="Tell us about your project — location, timeline, and what you need."
        />
        {errors.message && <span className="quote-form__error">{errors.message}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn--primary btn--lg quote-form__submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className="quote-form__spinner" aria-hidden="true" />
            Sending...
          </>
        ) : (
          'Submit Quote Request'
        )}
      </button>

      <p className="quote-form__disclaimer">
        By submitting this quote request, you agree to our{' '}
        <Link to="/terms" className="quote-form__legal-link" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </Link>{' '}
        and acknowledge our{' '}
        <Link to="/privacy" className="quote-form__legal-link" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </Link>.
        We protect your contact details and never share or sell your email.
      </p>
    </form>
  );
}
