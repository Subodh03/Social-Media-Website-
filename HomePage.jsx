import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

export default function HomePage({ searchQuery }) {
  const { posts } = useApp();
  const [sort, setSort] = useState('hot');

  const sorted = useMemo(() => {
    let filtered = searchQuery
      ? posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.body?.toLowerCase().includes(searchQuery.toLowerCase()))
      : posts;

    return [...filtered].sort((a, b) => {
      if (sort === 'hot') {
        const scoreA = a.votes + a.commentCount * 2;
        const scoreB = b.votes + b.commentCount * 2;
        return scoreB - scoreA;
      }
      if (sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'top') return b.votes - a.votes;
      return 0;
    });
  }, [posts, sort, searchQuery]);

  return (
    <div className="page-container">
      <main>
        <div className="sort-bar">
          {[['hot','Trend'],['new',' New'],['top',' Top']].map(([s, label]) => (
            <button key={s} className={`sort-btn ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>
              {label}
            </button>
          ))}
        </div>
        {searchQuery && (
          <div style={{ padding: '10px 0', fontSize: 14, color: 'var(--text-muted)' }}>
            Showing results for "<strong style={{ color: 'var(--text-primary)' }}>{searchQuery}</strong>" — {sorted.length} post{sorted.length !== 1 ? 's' : ''} found
          </div>
        )}
        <div className="feed">
          {sorted.length === 0 ? (
            <div className="empty-state">
              <h3>{searchQuery ? 'No posts found' : 'Nothing here yet'}</h3>
              <p>{searchQuery ? 'Try a different search term.' : 'Be the first to post something!'}</p>
            </div>
          ) : (
            sorted.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>
      <Sidebar />
    </div>
  );
}
