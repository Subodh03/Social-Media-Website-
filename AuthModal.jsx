import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup } = useApp();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (!form.username.trim()) throw new Error('Username is required');
        if (form.username.length < 3) throw new Error('Username must be at least 3 characters');
        await signup(form.username, form.email, form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-up">
        <div className="modal-header">
          <h2 className="modal-title">{isLogin ? 'Welcome back' : 'Join Threadit'}</h2>
          <button onClick={onClose} style={{ fontSize: 22, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={handle}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '10px 14px', background: '#fff2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" type="text" placeholder="username" value={form.username} onChange={set('username')} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            {isLogin && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 4 }}>
                </div>
            )}
          </div>
          <div className="modal-footer" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '10px' }}>
              {loading ? 'Loading...' : isLogin ? 'Log in' : 'Create account'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => onSwitch(isLogin ? 'signup' : 'login')} style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
