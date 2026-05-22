import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import { timeAgo, getInitials, hashColor } from '../utils/helpers';

export default function UserProfilePage() {
  const { username } = useParams();
  const { users, getUserPosts, getUserComments } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('posts');

  const user = users.find(u => u.username === username);

  if (!user) {
    return (
      <div className="page-container full-width">
        <div className="empty-state">
          <h3>User not found</h3>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Go home</button>
        </div>
      </div>
    );
  }

  const userPosts = getUserPosts(user.id);
  const userComments = getUserComments(user.id);
  const totalVotes = userPosts.reduce((sum, p) => sum + p.votes, 0) + userComments.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="page-container">
      <main>
        {/* Profile header */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: 80, background: `linear-gradient(135deg, ${hashColor(user.username)} 0%, ${hashColor(user.username + '2')} 100%)` }} />
          <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div className="avatar" style={{ background: hashColor(user.username), width: 64, height: 64, fontSize: 24, border: '4px solid var(--bg-card)', marginTop: -32, flexShrink: 0 }}>
              {getInitials(user.username)}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>u/{user.username}</h1>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Joined {timeAgo(user.joinedAt)}</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            ['Posts', userPosts.length],
            ['Comments', userComments.length],
            ['Total Karma', totalVotes],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>{val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>
            Posts ({userPosts.length})
          </button>
          <button className={`tab ${tab === 'comments' ? 'active' : ''}`} onClick={() => setTab('comments')}>
            Comments ({userComments.length})
          </button>
        </div>

        {tab === 'posts' && (
          <div className="feed">
            {userPosts.length === 0 ? (
              <div className="empty-state"><h3>No posts yet</h3></div>
            ) : (
              [...userPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => <PostCard key={p.id} post={p} />)
            )}
          </div>
        )}

        {tab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {userComments.length === 0 ? (
              <div className="empty-state"><h3>No comments yet</h3></div>
            ) : (
              [...userComments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(c => (
                <div key={c.id} className="post-card fade-up" style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${c.postId}`)}>
                  <div style={{ flex: 1, padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                      {timeAgo(c.createdAt)} · {c.votes} points
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <aside className="sidebar">
        <div className="sidebar-card">
          <div className="sidebar-card-header">Trophies</div>
          <div className="sidebar-card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[' New Member', ...(userPosts.length >= 1 ? [' Poster'] : []), ...(userComments.length >= 1 ? [' Commenter'] : []), ...(totalVotes >= 10 ? ['⭐ Popular'] : [])].map(t => (
              <span key={t} className="tag" style={{ fontSize: 12 }}>{t}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
