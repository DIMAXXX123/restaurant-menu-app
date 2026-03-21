import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const API = import.meta.env.VITE_API_URL || 'https://restaurant-menu-app-378x.onrender.com';
const today = new Date().toISOString().split('T')[0];

// Generate time slots 08:00 – 22:00 in 30-min steps
const TIME_SLOTS = [];
for (let h = 8; h <= 21; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}
TIME_SLOTS.push('22:00');

export default function ReservationPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    guest_name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');

    if (name === 'guest_name') {
      // Letters, spaces, hyphens, apostrophes only
      if (value && !/^[A-Za-zÀ-ÖØ-öø-ÿА-яЁёĐđŠšŽžČčĆćÄäÖöÜüß\s'-]+$/.test(value)) return;
    }

    if (name === 'phone') {
      // Numbers, +, spaces, hyphens, parentheses only
      if (value && !/^[0-9+\s\-()\\.]+$/.test(value)) return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.guest_name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!form.date) {
      setError('Please select a date.');
      return;
    }
    if (!form.time) {
      setError('Please select a time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, guests: parseInt(form.guests) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('resErrorGeneric'));
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('resErrorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reservation-section" id="reservation">
      <div className="reservation-inner">
        <div className="reservation-header">
          <h2>
            {t('resTitle1')} <em>{t('resTitleAccent')}</em>
          </h2>
          <p>{t('resSub')}</p>
        </div>

        <div className="reservation-form">
          {success ? (
            <div className="form-success">
              <div className="success-icon">🎉</div>
              <h3>{t('resSuccessTitle')}</h3>
              <p>{t('resSuccessText')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="form-error">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guest_name">{t('resName')} *</label>
                  <input
                    id="guest_name"
                    name="guest_name"
                    type="text"
                    value={form.guest_name}
                    onChange={handleChange}
                    required
                    placeholder="Anna Müller"
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t('resPhone')}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+43 1 234 5678"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('resEmail')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="anna@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">{t('resDate')} *</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">{t('resTime')} *</label>
                  <select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="time-select"
                  >
                    <option value="">— Select time —</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guests">{t('resGuests')} *</label>
                <select
                  id="guests"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  required
                >
                  {[1,2,3,4,5,6].map((n) => (
                    <option key={n} value={n}>{t(`guest${n}`)}</option>
                  ))}
                  <option value="7">{t('guest7')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">{t('resNotes')}</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder={t('resNotesPlaceholder')}
                />
              </div>

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? t('resSubmitting') : t('resSubmit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
