import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CreateCommunityModal({ onClose }) {
  const { createCommunity } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const slugPreview = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.length < 3) { setError('Name must be at least 3 characters'); return; }
    setLoading(true);
    try {
      const community = await createCommunity(form.name, form.description);
      onClose();
      navigate(`/r/${community.slug}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-up">
        <div className="modal-header">
          <h2 className="modal-title">Create a community</h2>
          <button onClick={onClose} style={{ fontSize: 22, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
        <form onSubmit={handle}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '10px 14px', background: '#fff2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Community name</label>
              <input className="form-input" type="text" placeholder="e.g. javascript" value={form.name} onChange={set('name')} required minLength={3} maxLength={50} />
              {form.name && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Will be created as: <strong style={{ color: 'var(--text-secondary)' }}>r/{slugPreview}</strong>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Description <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
              <textarea className="form-textarea" placeholder="What is this community about?" value={form.description} onChange={set('description')} rows={3} />
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text-secondary)' }}>
              Note:- Community names must be lowercase letters, numbers, or hyphens. At least 3 characters.
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
