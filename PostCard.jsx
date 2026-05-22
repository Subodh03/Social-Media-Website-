import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { timeAgo, formatVotes } from '../utils/helpers';

export default function PostCard({ post, showCommunity = true }) {
  const { communities, vote, getUserVote, currentUser, COLORS } = useApp();
  const navigate = useNavigate();
  const community = communities.find(c => c.id === post.communityId);
  const userVote = getUserVote(post.id);

  const handleVote = (e, dir) => {
    e.stopPropagation();
    vote(post.id, 'post', dir);
  };

  const communityColor = community ? COLORS[community.colorIndex % COLORS.length] : '#888';

  return (
    <div className="post-card fade-up" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="post-vote-bar">
        <button className={`vote-btn ${userVote === 'up' ? 'upvoted' : ''}`} onClick={e => handleVote(e, 'up')} title="Upvote">▲</button>
        <span className="vote-count" style={{ color: userVote === 'up' ? 'var(--up-color)' : userVote === 'down' ? 'var(--down-color)' : undefined }}>
          {formatVotes(post.votes)}
        </span>
        <button className={`vote-btn ${userVote === 'down' ? 'downvoted' : ''}`} onClick={e => handleVote(e, 'down')} title="Downvote">▼</button>
      </div>

      <div className="post-content">
        <div className="post-meta">
          {showCommunity && community && (
            <span className="community-link" onClick={e => { e.stopPropagation(); navigate(`/r/${community.slug}`); }}>
              <span className="community-dot" style={{ background: communityColor }}>{community.name[0].toUpperCase()}</span>
              r/{community.name}
            </span>
          )}
          <span>·</span>
          <span>Posted by u/{post.authorName}</span>
          <span>·</span>
          <span>{timeAgo(post.createdAt)}</span>
          {post.type === 'link' && <span className="tag" style={{ marginLeft: 4 }}>link</span>}
          {post.type === 'image' && <span className="tag" style={{ marginLeft: 4 }}>image</span>}
        </div>

        <h3 className="post-title">{post.title}</h3>

        {post.type === 'text' && post.body && (
          <p className="post-body-preview">{post.body}</p>
        )}

        {post.type === 'link' && post.url && (
          <div className="post-link-preview">
            <span></span>
            <a href={post.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
              {post.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          </div>
        )}

        <div className="post-actions">
          <button className="post-action-btn" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>
             {post.commentCount} comments
          </button>
          <button className="post-action-btn" onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id); }}>
             Share
          </button>
        </div>
      </div>
    </div>
  );
}
