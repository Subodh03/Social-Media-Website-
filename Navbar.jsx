import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getInitials, hashColor } from '../utils/helpers';
import AuthModal from './AuthModal';
import CreatePostModal from './CreatePostModal';
import CreateCommunityModal from './CreateCommunityModal';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handlePostCreate = () => {
    if (!currentUser) { setAuthModal('login'); return; }
    setShowPostModal(true);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
           <span>Threadit</span>
        </Link>

        <div className="navbar-search">
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="navbar-actions">
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => { if (!currentUser) { setAuthModal('login'); return; } setShowCommunityModal(true); }}>
            + Community
          </button>
          <button className="btn btn-primary" onClick={handlePostCreate}>
            + Post
          </button>

          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button className="user-pill" onClick={() => setShowUserMenu(v => !v)}>
                <div className="avatar" style={{ background: hashColor(currentUser.username), width: 24, height: 24, fontSize: 10 }}>
                  {getInitials(currentUser.username)}
                </div>
                {currentUser.username}
                <span>▾</span>
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', minWidth: 180, zIndex: 200, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
                    Signed in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser.username}</strong>
                  </div>
                  <button onClick={() => { navigate(`/user/${currentUser.username}`); setShowUserMenu(false); }} style={{ width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: 14, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.target.style.background = 'none'}>
                    👤 My Profile
                  </button>
                  <button onClick={() => { logout(); setShowUserMenu(false); }} style={{ width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: 14, color: '#e63946', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid var(--border)' }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.target.style.background = 'none'}>
                    ↩ Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => setAuthModal('login')}>Log in</button>
              <button className="btn btn-ghost" onClick={() => setAuthModal('signup')}>Sign up</button>
            </>
          )}
        </div>
      </nav>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
      {showPostModal && <CreatePostModal onClose={() => setShowPostModal(false)} />}
      {showCommunityModal && <CreateCommunityModal onClose={() => setShowCommunityModal(false)} />}
    </>
  );
}
