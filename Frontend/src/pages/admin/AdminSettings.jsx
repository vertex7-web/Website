import { useState, useEffect } from 'react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useSiteSettings();

  const [form, setForm] = useState(() => ({
    phone: settings?.phone || '',
    email: settings?.email || '',
    address: settings?.address || '',
    business_hours: settings?.business_hours || '',
  }));

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm((prev) => ({
        phone: prev.phone || settings.phone || '',
        email: prev.email || settings.email || '',
        address: prev.address || settings.address || '',
        business_hours: prev.business_hours || settings.business_hours || '',
      }));
    }
  }, [settings]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.phone.trim()) {
      setStatus({ type: 'error', message: 'Phone number is required.' });
      return;
    }

    setSaving(true);
    setStatus(null);

    const res = await updateSettings(form);
    setSaving(false);

    if (res.success) {
      setStatus({ type: 'success', message: 'Settings saved successfully.' });
    } else {
      setStatus({ type: 'error', message: res.message || 'Failed to save settings.' });
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Site Settings</h1>
      </div>

      {status && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'var(--color-charcoal)',
            border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}`,
            color: status.type === 'error' ? '#fca5a5' : 'var(--color-white)',
            fontSize: '0.875rem',
          }}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form__section">
          <h2 className="admin-form__section-title" style={{ color: 'var(--color-white)' }}>
            Contact Information
          </h2>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label" htmlFor="setting-phone">
                Phone Number *
              </label>
              <input
                id="setting-phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="0968 856 8983"
                required
              />
            </div>

            <div className="admin-form__field">
              <label className="admin-form__label" htmlFor="setting-email">
                Email Address
              </label>
              <input
                id="setting-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="vertex7.her@gmail.com"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label" htmlFor="setting-address">
                Address
              </label>
              <input
                id="setting-address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="43 Viola St., Santa Rita Matanda, San Miguel, Bulacan"
              />
            </div>

            <div className="admin-form__field">
              <label className="admin-form__label" htmlFor="setting-hours">
                Business Hours
              </label>
              <input
                id="setting-hours"
                name="business_hours"
                type="text"
                value={form.business_hours}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="Mon - Sat: 8:00 AM - 5:00 PM"
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </>
  );
}
