import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import AuthModal from '../components/AuthModal';
import { timeAgo } from '../utils/helpers';

export default function CommunityPage() {
  const { slug } = useParams();
  const { getCommunity, getCommunityPosts, toggleJoin, isJoined, currentUser, COLORS } = useApp();
  const navigate = useNavigate();
  const [sort, setSort] = useState('hot');
  const [showPostModal, setShowPostModal] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  const community = getCommunity(slug);

  const posts = useMemo(() => {
    if (!community) return [];
    const raw = getCommunityPosts(community.id);
    return [...raw].sort((a, b) => {
      if (sort === 'hot') return (b.votes + b.commentCount * 2) - (a.votes + a.commentCount * 2);
      if (sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'top') return b.votes - a.votes;
      return 0;
    });
  }, [community, getCommunityPosts, sort]);

  if (!community) {
    return (
      <div className="page-container full-width">
        <div className="empty-state">
          <h3>Community not found</h3>
          <p>r/{slug} doesn't exist yet.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Go home</button>
        </div>
      </div>
    );
  }

  const color = COLORS[community.colorIndex % COLORS.length];
  const joined = isJoined(community.id);

  const handleJoin = () => {
    if (!currentUser) { setAuthModal('login'); return; }
    toggleJoin(community.id);
  };

  const handlePost = () => {
    if (!currentUser) { setAuthModal('login'); return; }
    setShowPostModal(true);
  };

  return (
    <>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
        <div className="community-banner" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '0 0 16px', marginTop: -20 }}>
            <div className="community-avatar-large" style={{ background: color }}>
              {community.name[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, margin: 0 }}>r/{community.name}</h1>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{community.memberCount.toLocaleString()} members</div>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingBottom: 4 }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={handlePost}>+ Create Post</button>
              <button className={`btn ${joined ? 'btn-ghost' : 'btn-outline'}`} style={{ fontSize: 13 }} onClick={handleJoin}>
                {joined ? 'Joined ✓' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        <main>
          <div className="sort-bar">
            {[['hot','Trend'],['new',' New'],['top',' Top']].map(([s, label]) => (
              <button key={s} className={`sort-btn ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>{label}</button>
            ))}
          </div>
          <div className="feed">
            {posts.length === 0 ? (
              <div className="empty-state">
                <h3>No posts yet</h3>
                <p>Be the first to post in r/{community.name}!</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handlePost}>Create Post</button>
              </div>
            ) : (
              posts.map(post => <PostCard key={post.id} post={post} showCommunity={false} />)
            )}
          </div>
        </main>

        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-header">About r/{community.name}</div>
            <div className="sidebar-card-body">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                {community.description || 'Welcome to this community!'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Members</span>
                <strong>{community.memberCount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Posts</span>
                <strong>{posts.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Created</span>
                <strong>{timeAgo(community.createdAt)}</strong>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={handlePost}>
                + Create Post
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showPostModal && <CreatePostModal onClose={() => setShowPostModal(false)} prefillCommunityId={community.id} />}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </>
  );
}
