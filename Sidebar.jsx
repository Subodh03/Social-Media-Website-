import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CreateCommunityModal from './CreateCommunityModal';
import AuthModal from './AuthModal';

export default function Sidebar() {
  const { communities, currentUser, COLORS } = useApp();
  const navigate = useNavigate();
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  const sorted = [...communities].sort((a, b) => b.memberCount - a.memberCount).slice(0, 8);

  return (
    <>
      <aside className="sidebar">
        {/* Welcome card */}
        <div className="sidebar-card">
          <div style={{ background: 'linear-gradient(135deg, #ff4820 0%, #ff8c66 100%)', height: 60, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
          <div style={{ padding: '16px 16px 12px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              Home Feed
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              Your personal Threadit front page. Discover, vote, and join the conversation.
            </p>
            {!currentUser && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }} onClick={() => setAuthModal('signup')}>
                  Sign up
                </button>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }} onClick={() => setAuthModal('login')}>
                  Log in
                </button>
              </div>
            )}
            {currentUser && (
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setShowCommunityModal(true)}>
                + Create Community
              </button>
            )}
          </div>
        </div>

        
        <div className="sidebar-card">
          <div className="sidebar-card-header">Top Communities</div>
          <div className="sidebar-card-body" style={{ padding: '8px 16px' }}>
            {sorted.map((c, i) => (
              <div key={c.id} className="community-list-item" onClick={() => navigate(`/r/${c.slug}`)}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', width: 20, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div className="community-dot" style={{ background: COLORS[c.colorIndex % COLORS.length] }}>
                  {c.name[0].toUpperCase()}
                </div>
                <div className="info">
                  <div className="name">r/{c.name}</div>
                  <div className="members">{c.memberCount.toLocaleString()} members</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div style={{ padding: '12px 4px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
            {['Help','About','Careers','Press','Blog','Rules','Privacy','Terms'].map(l => (
              <span key={l} style={{ cursor: 'pointer' }} onMouseEnter={e => e.target.style.color='var(--text-primary)'} onMouseLeave={e => e.target.style.color='var(--text-muted)'}>{l}</span>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>Threadit Inc © 2025</div>
        </div>
      </aside>

      {showCommunityModal && <CreateCommunityModal onClose={() => setShowCommunityModal(false)} />}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </>
  );
}
