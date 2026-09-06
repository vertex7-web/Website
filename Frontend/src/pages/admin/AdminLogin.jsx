import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import transparentLogo from '../../assets/transparent-logo.svg';
import './AdminLogin.css';

export default function AdminLogin() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__header">
          <img src={transparentLogo} alt="Vertex 7" className="admin-login__logo-img" />
          <h1 className="admin-login__title">Admin Dashboard</h1>
          <p className="admin-login__subtitle">Sign in to manage your content</p>
        </div>

        {error && (
          <div className="admin-login__error" role="alert">
            {error}
          </div>
        )}

        <div className="admin-login__field">
          <label htmlFor="admin-email" className="admin-login__label">Email</label>
          <input
            type="email"
            id="admin-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-login__input"
            placeholder="admin@vertex7.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="admin-login__field">
          <label htmlFor="admin-password" className="admin-login__label">Password</label>
          <div className="admin-login__password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login__input admin-login__input--password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="admin-login__toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="admin-login__submit"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
