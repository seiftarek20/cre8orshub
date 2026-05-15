import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checkRateLimit } from '../utils/rateLimit.js';

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, signup, authError } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Signup | Cre8ors Hub';
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
    setMessage('');

    const rateLimit = checkRateLimit(`auth:signup:${form.email.trim().toLowerCase()}`, 12000);
    if (!rateLimit.allowed) {
      setError(rateLimit.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await signup(form);
      if (data.session) {
        navigate('/dashboard', { replace: true });
        return;
      }
      setMessage('Account created. Please check your email to confirm your account before logging in.');
    } catch (submissionError) {
      setError(submissionError.message || 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-block page-top auth-page">
      <div className="auth-shell">
        <div className="auth-card reveal show">
          <p className="eyebrow">Create Account</p>
          <h1>Start your workspace.</h1>
          <p>Create your student account now. Courses and progress will connect here in the next backend phases.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                autoComplete="name"
                required
              />
            </label>

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
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {authError ? <p className="auth-message is-error">{authError}</p> : null}
            {error ? <p className="auth-message is-error">{error}</p> : null}
            {message ? <p className="auth-message is-success">{message}</p> : null}

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
