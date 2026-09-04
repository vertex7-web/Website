import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import './CookieConsent.css';

const COOKIE_STORAGE_KEY = 'vertex7_cookie_consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!saved) {
        // Delay slightly for smooth entrance after initial page load
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable (e.g. strict incognito mode)
    }
  }, []);

  const saveConsent = (consentData) => {
    try {
      localStorage.setItem(
        COOKIE_STORAGE_KEY,
        JSON.stringify({
          ...consentData,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // LocalStorage blocked
    }
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true });
  };

  const handleEssentialOnly = () => {
    saveConsent({ necessary: true, analytics: false });
  };

  const handleSaveCustom = () => {
    saveConsent({ necessary: true, analytics: analyticsAllowed });
  };

  if (!isVisible) return null;

  return (
    <aside
      className={`cookie-consent ${isVisible ? 'cookie-consent--visible' : ''}`}
      role="dialog"
      aria-label="Cookie and Privacy Consent"
      aria-live="polite"
    >
      <div className="cookie-consent__header">
        <svg
          className="cookie-consent__icon"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
        <h2 className="cookie-consent__title">Privacy & Cookies</h2>
      </div>

      <p className="cookie-consent__text">
        Vertex 7 uses essential cookies to ensure safe and reliable site operations. We also use analytics to improve our machinery catalog. Learn more in our{' '}
        <Link to="/privacy" className="cookie-consent__link">
          Privacy Policy
        </Link>.
      </p>

      {/* Expandable Preferences Panel */}
      {showPreferences && (
        <div className="cookie-consent__preferences" aria-label="Cookie Categories">
          <div className="cookie-preference-item">
            <div className="cookie-preference-item__info">
              <h3 className="cookie-preference-item__title">Strictly Necessary</h3>
              <p className="cookie-preference-item__desc">Required for security, form submission, and core site navigation.</p>
            </div>
            <label className="cookie-toggle" aria-label="Strictly Necessary Cookies (Always On)">
              <input type="checkbox" checked disabled />
              <span className="cookie-toggle__slider" aria-hidden="true" />
            </label>
          </div>

          <div className="cookie-preference-item">
            <div className="cookie-preference-item__info">
              <h3 className="cookie-preference-item__title">Analytics & Fleet Metrics</h3>
              <p className="cookie-preference-item__desc">Helps us evaluate popular equipment and optimize user experience.</p>
            </div>
            <label className="cookie-toggle" aria-label="Analytics Cookies">
              <input
                type="checkbox"
                checked={analyticsAllowed}
                onChange={(e) => setAnalyticsAllowed(e.target.checked)}
              />
              <span className="cookie-toggle__slider" aria-hidden="true" />
            </label>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="cookie-consent__actions">
        {showPreferences ? (
          <>
            <button
              type="button"
              className="cookie-consent__btn cookie-consent__btn--accept"
              onClick={handleSaveCustom}
            >
              Save Preferences
            </button>
            <button
              type="button"
              className="cookie-consent__btn cookie-consent__btn--reject"
              onClick={() => setShowPreferences(false)}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="cookie-consent__btn cookie-consent__btn--accept"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
            <button
              type="button"
              className="cookie-consent__btn cookie-consent__btn--reject"
              onClick={handleEssentialOnly}
            >
              Essential Only
            </button>
            <button
              type="button"
              className="cookie-consent__btn--settings"
              onClick={() => setShowPreferences(true)}
            >
              Customize Cookie Settings
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
