import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checkRateLimit } from '../utils/rateLimit.js';

const LOGIN_TIMEOUT_MS = 12000;

function withLoginTimeout(promise) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error('Login timed out. Please check your connection and try again.'));
    }, LOGIN_TIMEOUT_MS);
  });

  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login, authError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Login | Cre8ors Hub';
  }, []);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const rateLimit = checkRateLimit(`auth:login:${form.email.trim().toLowerCase()}`, 12000);
    if (!rateLimit.allowed) {
      setError(rateLimit.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await withLoginTimeout(login(form));
      if (!data?.session) {
        throw new Error('Login could not be completed. Please try again.');
      }
      navigate('/dashboard', { replace: true });
    } catch (submissionError) {
      setError(submissionError.message || 'Could not log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-block page-top auth-page">
      <div className="auth-shell">
        <div className="auth-card reveal show">
          <p className="eyebrow">Student Login</p>
          <h1>Welcome back.</h1>
          <p>Access your workspace, tasks, progress, rewards, and projects.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                autoComplete="current-password"
                required
              />
            </label>

            {authError ? <p className="auth-message is-error">{authError}</p> : null}
            {error ? <p className="auth-message is-error">{error}</p> : null}

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="auth-switch">
            New to Cre8ors Hub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
