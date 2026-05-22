import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import CommunitiesPage from './pages/CommunitiesPage';
import './index.css';

function NavTabs() {
  const location = useLocation();
  return (
    <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 4 }}>
        {[['/', 'Home'], ['/communities', 'Communities']].map(([to, label]) => (
          <Link key={to} to={to} style={{ padding: '10px 14px', fontSize: 14, fontWeight: 600, borderBottom: `2px solid ${location.pathname === to ? 'var(--accent)' : 'transparent'}`, color: location.pathname === to ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.15s', marginBottom: -1 }}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function AppInner() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="app-shell">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <NavTabs />
      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/r/:slug" element={<CommunityPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/user/:username" element={<UserProfilePage />} />
        <Route path="*" element={
          <div className="page-container full-width">
            <div className="empty-state">
              <h3>Page not found</h3>
              <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Go home</Link>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}
