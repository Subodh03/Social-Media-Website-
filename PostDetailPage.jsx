import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { timeAgo, formatVotes, getInitials, hashColor } from '../utils/helpers';
import AuthModal from '../components/AuthModal';

function Comment({ comment }) {
  const { vote, getUserVote, currentUser } = useApp();
  const userVote = getUserVote(comment.id);

  return (
    <div className="comment fade-up">
      <div className="comment-header">
        <div className="avatar" style={{ background: hashColor(comment.authorName), width: 22, height: 22, fontSize: 9 }}>
          {getInitials(comment.authorName)}
        </div>
        <span className="comment-author">u/{comment.authorName}</span>
        <span>·</span>
        <span>{timeAgo(comment.createdAt)}</span>
      </div>
      <p className="comment-body">{comment.body}</p>
      <div className="comment-actions">
        <button className={`post-action-btn ${userVote === 'up' ? 'upvoted' : ''}`} style={{ color: userVote === 'up' ? 'var(--up-color)' : undefined }} onClick={() => vote(comment.id, 'comment', 'up')}>
          ▲ {formatVotes(comment.votes)}
        </button>
        <button className={`post-action-btn ${userVote === 'down' ? 'downvoted' : ''}`} onClick={() => vote(comment.id, 'comment', 'down')}>
          ▼
        </button>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const { posts, communities, getPostComments, createComment, vote, getUserVote, currentUser, COLORS } = useApp();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [commentSort, setCommentSort] = useState('top');

  const post = posts.find(p => p.id === postId);
  const community = post ? communities.find(c => c.id === post.communityId) : null;
  const rawComments = getPostComments(postId);
  const userVote = getUserVote(postId);

  const comments = [...rawComments].sort((a, b) => {
    if (commentSort === 'top') return b.votes - a.votes;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!post) {
    return (
      <div className="page-container full-width">
        <div className="empty-state">
          <h3>Post not found</h3>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Go home</button>
        </div>
      </div>
    );
  }

  const communityColor = community ? COLORS[community.colorIndex % COLORS.length] : '#888';

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) { setAuthModal('login'); return; }
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      await createComment(postId, commentText.trim());
      setCommentText('');
    } catch {}
    setLoading(false);
  };

  return (
    <>
      <div className="page-container">
        <main>
          
          {community && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13 }}>
              <div className="community-dot" style={{ background: communityColor, width: 20, height: 20, fontSize: 10 }}>
                {community.name[0].toUpperCase()}
              </div>
              <Link to={`/r/${community.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>r/{community.name}</Link>
              <span style={{ color: 'var(--text-muted)' }}>›</span>
              <span style={{ color: 'var(--text-muted)' }}>Post</span>
            </div>
          )}

          
          <div className="post-detail">
            <div style={{ display: 'flex' }}>
              {/* Vote bar */}
              <div className="post-vote-bar" style={{ width: 52 }}>
                <button className={`vote-btn ${userVote === 'up' ? 'upvoted' : ''}`} onClick={() => vote(postId, 'post', 'up')}>▲</button>
                <span className="vote-count" style={{ color: userVote === 'up' ? 'var(--up-color)' : userVote === 'down' ? 'var(--down-color)' : undefined }}>
                  {formatVotes(post.votes)}
                </span>
                <button className={`vote-btn ${userVote === 'down' ? 'downvoted' : ''}`} onClick={() => vote(postId, 'post', 'down')}>▼</button>
              </div>


              <div style={{ flex: 1, padding: '16px 20px' }}>
                <div className="post-meta" style={{ marginBottom: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Posted by u/{post.authorName}</span>
                  <span>·</span>
                  <span style={{ color: 'var(--text-muted)' }}>{timeAgo(post.createdAt)}</span>
                  {post.type !== 'text' && <span className="tag">{post.type}</span>}
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 14, lineHeight: 1.3 }}>
                  {post.title}
                </h1>

                {post.type === 'text' && post.body && (
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>{post.body}</p>
                )}

                {post.type === 'link' && post.url && (
                  <div className="post-link-preview" style={{ marginBottom: 14 }}>
                    <span></span>
                    <a href={post.url} target="_blank" rel="noreferrer">{post.url}</a>
                  </div>
                )}

                {post.type === 'image' && post.url && (
                  <img src={post.url} alt="post" style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain', borderRadius: 'var(--radius)', marginBottom: 14, border: '1px solid var(--border)' }} />
                )}

                <div className="post-actions">
                  <button className="post-action-btn"> {post.commentCount} comments</button>
                  <button className="post-action-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}> Share</button>
                </div>
              </div>
            </div>
          </div>

          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginTop: 16 }}>
            {currentUser ? (
              <form onSubmit={handleComment}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                  Commenting as <strong style={{ color: 'var(--accent)' }}>u/{currentUser.username}</strong>
                </div>
                <textarea
                  className="form-textarea"
                  placeholder="What are your thoughts?"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={4}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, gap: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setCommentText('')}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading || !commentText.trim()}>
                    {loading ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Log in or sign up to leave a comment.</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => setAuthModal('login')}>Log in</button>
                  <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setAuthModal('signup')}>Sign up</button>
                </div>
              </div>
            )}
          </div>

          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{comments.length} comments</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {[['top',' Top'],['new',' New']].map(([s, label]) => (
                  <button key={s} className={`sort-btn ${commentSort === s ? 'active' : ''}`} style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setCommentSort(s)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {comments.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first!</p>
              </div>
            ) : (
              comments.map(c => <Comment key={c.id} comment={c} />)
            )}
          </div>
        </main>

        
        <aside className="sidebar">
          {community && (
            <div className="sidebar-card">
              <div className="sidebar-card-header">r/{community.name}</div>
              <div className="sidebar-card-body">
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                  {community.description || 'A Threadit community.'}
                </p>
                <div style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Members</span>
                  <strong>{community.memberCount.toLocaleString()}</strong>
                </div>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 14, fontSize: 13 }} onClick={() => navigate(`/r/${community.slug}`)}>
                  Visit r/{community.name}
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </>
  );
}
