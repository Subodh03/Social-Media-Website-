import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CreateCommunityModal from '../components/CreateCommunityModal';
import AuthModal from '../components/AuthModal';

export default function CommunitiesPage() {
  const { communities, toggleJoin, isJoined, currentUser, COLORS } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  const filtered = communities.filter(c => c.name.includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => b.memberCount - a.memberCount);

  return (
    <>
      <div className="page-container full-width" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Explore Communities</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{communities.length} communities to explore</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></span>
              <input
                style={{ height: 38, paddingLeft: 36, paddingRight: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)', width: 240 }}
                placeholder="Search communities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => { if (!currentUser) { setAuthModal('login'); return; } setShowCreate(true); }}>
              + Create
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {sorted.map(community => {
            const color = COLORS[community.colorIndex % COLORS.length];
            const joined = isJoined(community.id);
            return (
              <div key={community.id} className="card fade-up" style={{ cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ height: 50, background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)` }} />
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10, marginTop: -20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, 
                      fontSize: 18, color: 'white', border: '3px solid var(--bg-card)' }}>
                      {community.name[0].toUpperCase()}
                    </div>
                    <button
                      className={`btn ${joined ? 'btn-ghost' : 'btn-outline'}`}
                      style={{ fontSize: 12, padding: '5px 12px' }}
                      onClick={e => { e.stopPropagation(); if (!currentUser) { setAuthModal('login'); return; } toggleJoin(community.id); }}
                    >
                      {joined ? 'Joined ✓' : 'Join'}
                    </button>
                  </div>
                  <div onClick={() => navigate(`/r/${community.slug}`)}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>r/{community.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{community.memberCount.toLocaleString()} members</p>
                    {community.description && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {community.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="empty-state">
            <h3>No communities found</h3>
            <p>Try a different search, or create a new community.</p>
          </div>
        )}
      </div>

      {showCreate && <CreateCommunityModal onClose={() => setShowCreate(false)} />}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </>
  );
}
