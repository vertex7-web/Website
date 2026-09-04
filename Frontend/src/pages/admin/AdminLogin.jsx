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
          <input
            type="password"
            id="admin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login__input"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
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
