import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', bio: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Profile | Cre8ors Hub';
  }, []);

  useEffect(() => {
    setForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
    });
  }, [profile]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await updateProfile(form);
      setMessage('Profile updated.');
    } catch (submissionError) {
      setError(submissionError.message || 'Could not update your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      eyebrow="Student Profile"
      title="Your account"
      description="Keep your student profile ready for the learning workspace."
    >
      <section className="profile-grid">
        <article className="app-card profile-summary-card reveal">
          <p className="eyebrow">Account</p>
          <h2>{profile?.full_name || user?.email || 'Student'}</h2>
          <div className="profile-facts">
            <span>Email</span>
            <strong>{user?.email}</strong>
            <span>Role</span>
            <strong>{profile?.role || 'student'}</strong>
          </div>
        </article>

        <article className="app-card reveal">
          <form className="auth-form profile-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input name="full_name" value={form.full_name} onChange={updateField} />
            </label>

            <label>
              Phone
              <input name="phone" value={form.phone} onChange={updateField} />
            </label>

            <label className="auth-field-wide">
              Bio
              <textarea name="bio" value={form.bio} onChange={updateField} rows="5" />
            </label>

            {error ? <p className="auth-message is-error">{error}</p> : null}
            {message ? <p className="auth-message is-success">{message}</p> : null}

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </article>
      </section>
    </AppLayout>
  );
}
