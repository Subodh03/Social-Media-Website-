import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CreatePostModal({ onClose, prefillCommunityId }) {
  const { communities, createPost, currentUser } = useApp();
  const navigate = useNavigate();
  const [type, setType] = useState('text');
  const [form, setForm] = useState({ title: '', body: '', url: '', communityId: prefillCommunityId || '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.communityId) { setError('Select a community'); return; }
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (type === 'link' && !form.url.trim()) { setError('URL is required for link posts'); return; }
    setLoading(true);
    try {
      const post = await createPost(form.communityId, form.title.trim(), form.body.trim(), type, form.url.trim());
      onClose();
      navigate(`/post/${post.id}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-up" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2 className="modal-title">Create a post</h2>
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
              <label className="form-label">Community</label>
              <select className="form-input" value={form.communityId} onChange={set('communityId')}>
                <option value="">Choose a community...</option>
                {communities.map(c => <option key={c.id} value={c.id}>r/{c.name}</option>)}
              </select>
            </div>

            <div className="post-type-tabs">
              {[['text',' Text'],['link',' Link'],['image',' Image']].map(([t, label]) => (
                <button key={t} type="button" className={`post-type-tab ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" type="text" placeholder="An interesting title..." value={form.title} onChange={set('title')} required maxLength={300} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{form.title.length}/300</div>
            </div>

            {type === 'text' && (
              <div className="form-group">
                <label className="form-label">Body <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                <textarea className="form-textarea" placeholder="What's on your mind?" value={form.body} onChange={set('body')} rows={5} />
              </div>
            )}

            {type === 'link' && (
              <div className="form-group">
                <label className="form-label">URL</label>
                <input className="form-input" type="url" placeholder="https://example.com" value={form.url} onChange={set('url')} />
              </div>
            )}

            {type === 'image' && (
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" type="url" placeholder="https://example.com/image.jpg" value={form.url} onChange={set('url')} />
                {form.url && (
                  <div style={{ marginTop: 10 }}>
                    <img src={form.url} alt="preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 'var(--radius)', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
