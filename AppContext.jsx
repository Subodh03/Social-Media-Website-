import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const COLORS = ['#e63946','#2563eb','#16a34a','#7c3aed','#d97706','#0891b2','#be185d','#047857','#9333ea','#dc2626'];

const INITIAL_COMMUNITIES = [
  { id: 'c1', name: 'programming', slug: 'programming', description: 'A community for programmers to discuss anything code-related. Ask questions, share projects, debate best practices.', memberCount: 8420, colorIndex: 1, createdAt: new Date('2024-01-10').toISOString() },
  { id: 'c2', name: 'webdev', slug: 'webdev', description: 'The web developer community — HTML, CSS, JS, frameworks, and beyond.', memberCount: 5130, colorIndex: 0, createdAt: new Date('2024-01-15').toISOString() },
  { id: 'c3', name: 'science', slug: 'science', description: 'Latest in science news, discoveries, and discussions.', memberCount: 12000, colorIndex: 2, createdAt: new Date('2024-01-08').toISOString() },
  { id: 'c4', name: 'gaming', slug: 'gaming', description: 'For gamers of all kinds. Reviews, news, and hot takes.', memberCount: 9800, colorIndex: 3, createdAt: new Date('2024-01-12').toISOString() },
  { id: 'c5', name: 'movies', slug: 'movies', description: 'Film discussions, reviews, trailers, and cinematic debates.', memberCount: 7300, colorIndex: 4, createdAt: new Date('2024-01-20').toISOString() },
];

const INITIAL_POSTS = [
  {
    id: 'p1', communityId: 'c1', authorId: 'u2', authorName: 'devKishore',
    title: 'I built a terminal emulator in the browser using WebAssembly — here\'s how',
    body: 'After 6 months of evenings and weekends, I finally got a working terminal emulator running fully client-side. No backend involved at all. Using WASM to compile a minimal Linux kernel and running bash inside it. The latency is surprisingly good.',
    type: 'text', votes: 1247, commentCount: 89,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'p2', communityId: 'c2', authorId: 'u3', authorName: 'saaraMehta',
    title: 'CSS container queries just landed in all major browsers — finally!',
    body: 'This is the feature I\'ve been waiting for. You can now style components based on their parent container\'s size instead of the viewport. This fundamentally changes how we write responsive components.',
    type: 'text', votes: 834, commentCount: 56,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'p3', communityId: 'c3', authorId: 'u4', authorName: 'prabhatK',
    title: 'NASA\'s new telescope just photographed a star being born in real time',
    body: 'The images coming back from the latest mission are absolutely stunning. We\'re seeing stellar nurseries with unprecedented resolution. The gas clouds collapsing under their own gravity, the jets of material shooting out — it\'s all there.',
    type: 'link', url: 'https://science.nasa.gov', votes: 2341, commentCount: 203,
    createdAt: new Date(Date.now() - 7 * 3600000).toISOString()
  },
  {
    id: 'p4', communityId: 'c1', authorId: 'u5', authorName: 'niyaKode',
    title: 'Hot take: TypeScript has made codebases harder to read, not easier',
    body: 'Before you downvote, hear me out. The abstractions TypeScript encourages — complex generics, conditional types, mapped types — have made the average codebase significantly more intimidating for newcomers. We\'ve traded one class of bugs for a new complexity tax.',
    type: 'text', votes: -43, commentCount: 412,
    createdAt: new Date(Date.now() - 9 * 3600000).toISOString()
  },
  {
    id: 'p5', communityId: 'c4', authorId: 'u6', authorName: 'gameNerd99',
    title: 'Played 200 hours of this indie game in 3 weeks and I have no regrets',
    body: 'Small studio, no marketing budget, word-of-mouth only. The craftsmanship here absolutely puts AAA studios to shame. The attention to detail, the music, the emergent storytelling — all built by a team of 4 people.',
    type: 'text', votes: 567, commentCount: 134,
    createdAt: new Date(Date.now() - 11 * 3600000).toISOString()
  },
  {
    id: 'p6', communityId: 'c2', authorId: 'u7', authorName: 'reactRaj',
    title: 'I\'ve been using Svelte for 6 months after 5 years of React. My honest review.',
    body: 'The DX is genuinely better in most ways. The bundle sizes are dramatically smaller. But the ecosystem gap is real, and hiring for it is tough. Would I start a new project in Svelte? Probably yes for a small team. Large enterprise? React still wins.',
    type: 'text', votes: 923, commentCount: 287,
    createdAt: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: 'p7', communityId: 'c5', authorId: 'u8', authorName: 'cinemaAnanya',
    title: 'Why practical effects will always beat CGI for horror',
    body: 'There\'s something the brain recognizes about real light on real objects that CGI still can\'t quite replicate. The best horror of the last decade leans heavily on practical — look at the monster design in recent A24 films.',
    type: 'text', votes: 445, commentCount: 98,
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString()
  },
];

const INITIAL_COMMENTS = [
  { id: 'cm1', postId: 'p1', authorId: 'u3', authorName: 'saaraMehta', body: 'This is incredible. How did you handle memory management? WASM linear memory can get tricky when you\'re running a full kernel.', votes: 87, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'cm2', postId: 'p1', authorId: 'u5', authorName: 'niyaKode', body: 'Did you look at JSLinux for inspiration? Fabrice Bellard\'s project does something similar. Curious how your approach differs.', votes: 45, createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString() },
  { id: 'cm3', postId: 'p1', authorId: 'u2', authorName: 'devKishore', body: 'Memory management is handled through Emscripten\'s malloc implementation. It\'s not perfect but it works for the scope of this project. And yes, JSLinux was the starting point for inspiration!', votes: 112, createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: 'cm4', postId: 'p2', authorId: 'u7', authorName: 'reactRaj', body: 'Finally. I\'ve been waiting for this for years. The workarounds we had to use before were just messy.', votes: 56, createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 'cm5', postId: 'p4', authorId: 'u3', authorName: 'saaraMehta', body: 'I partially agree. Complex generics are a nightmare. But simple typed interfaces have saved my team countless bugs in prod. It\'s about discipline in how you use it.', votes: 234, createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: 'cm6', postId: 'p4', authorId: 'u6', authorName: 'gameNerd99', body: 'Counter-take: any codebase that\'s hard to read was hard to read before TypeScript, just in different ways.', votes: 189, createdAt: new Date(Date.now() - 7 * 3600000).toISOString() },
  { id: 'cm7', postId: 'p6', authorId: 'u2', authorName: 'devKishore', body: 'The DX point is real. Svelte\'s reactivity model is just... cleaner. But I keep coming back to React because of the tooling ecosystem.', votes: 78, createdAt: new Date(Date.now() - 13 * 3600000).toISOString() },
];

function loadState() {
  try {
    const s = localStorage.getItem('threadit_state');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem('threadit_state', JSON.stringify(state));
  } catch {}
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [currentUser, setCurrentUser] = useState(saved?.currentUser || null);
  const [users, setUsers] = useState(saved?.users || [
    { id: 'u1', username: 'guest', email: 'guest@example.com', password: 'guest123', joinedAt: new Date('2024-01-01').toISOString() },
    { id: 'u2', username: 'devKishore', email: 'kishore@example.com', password: 'pass123', joinedAt: new Date('2024-01-05').toISOString() },
    { id: 'u3', username: 'saaraMehta', email: 'saara@example.com', password: 'pass123', joinedAt: new Date('2024-01-06').toISOString() },
  ]);
  const [communities, setCommunities] = useState(saved?.communities || INITIAL_COMMUNITIES);
  const [posts, setPosts] = useState(saved?.posts || INITIAL_POSTS);
  const [comments, setComments] = useState(saved?.comments || INITIAL_COMMENTS);
  const [votes, setVotes] = useState(saved?.votes || {});
  const [joinedCommunities, setJoinedCommunities] = useState(saved?.joinedCommunities || []);

  useEffect(() => {
    saveState({ currentUser, users, communities, posts, comments, votes, joinedCommunities });
  }, [currentUser, users, communities, posts, comments, votes, joinedCommunities]);

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    setCurrentUser(user);
    return user;
  }, [users]);

  const signup = useCallback((username, email, password) => {
    if (users.find(u => u.email === email)) throw new Error('Email already in use');
    if (users.find(u => u.username === username)) throw new Error('Username already taken');
    const newUser = { id: 'u' + Date.now(), username, email, password, joinedAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const createCommunity = useCallback((name, description) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (communities.find(c => c.slug === slug)) throw new Error('Community already exists');
    const newCommunity = {
      id: 'c' + Date.now(), name: slug, slug, description,
      memberCount: 1, colorIndex: communities.length % COLORS.length,
      createdAt: new Date().toISOString()
    };
    setCommunities(prev => [...prev, newCommunity]);
    setJoinedCommunities(prev => [...prev, newCommunity.id]);
    return newCommunity;
  }, [communities]);

  const createPost = useCallback((communityId, title, body, type, url) => {
    if (!currentUser) throw new Error('Must be logged in');
    const newPost = {
      id: 'p' + Date.now(), communityId, authorId: currentUser.id,
      authorName: currentUser.username, title, body: body || '', type: type || 'text',
      url: url || '', votes: 1, commentCount: 0,
      createdAt: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, [currentUser]);

  const createComment = useCallback((postId, body) => {
    if (!currentUser) throw new Error('Must be logged in');
    const newComment = {
      id: 'cm' + Date.now(), postId, authorId: currentUser.id,
      authorName: currentUser.username, body, votes: 1,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p));
    return newComment;
  }, [currentUser]);

  const vote = useCallback((targetId, targetType, direction) => {
    if (!currentUser) return;
    const key = `${currentUser.id}_${targetId}`;
    const current = votes[key];
    let delta = 0;

    if (current === direction) {
      
      delta = direction === 'up' ? -1 : 1;
      setVotes(prev => { const n = {...prev}; delete n[key]; return n; });
    } else if (current) {
      
      delta = direction === 'up' ? 2 : -2;
      setVotes(prev => ({ ...prev, [key]: direction }));
    } else {
      
      delta = direction === 'up' ? 1 : -1;
      setVotes(prev => ({ ...prev, [key]: direction }));
    }

    if (targetType === 'post') {
      setPosts(prev => prev.map(p => p.id === targetId ? { ...p, votes: p.votes + delta } : p));
    } else {
      setComments(prev => prev.map(c => c.id === targetId ? { ...c, votes: c.votes + delta } : c));
    }
  }, [currentUser, votes]);

  const getUserVote = useCallback((targetId) => {
    if (!currentUser) return null;
    return votes[`${currentUser.id}_${targetId}`] || null;
  }, [currentUser, votes]);

  const toggleJoin = useCallback((communityId) => {
    if (!currentUser) return;
    setJoinedCommunities(prev => {
      const joined = prev.includes(communityId);
      if (joined) {
        setCommunities(cs => cs.map(c => c.id === communityId ? { ...c, memberCount: c.memberCount - 1 } : c));
        return prev.filter(id => id !== communityId);
      } else {
        setCommunities(cs => cs.map(c => c.id === communityId ? { ...c, memberCount: c.memberCount + 1 } : c));
        return [...prev, communityId];
      }
    });
  }, [currentUser]);

  const isJoined = useCallback((communityId) => joinedCommunities.includes(communityId), [joinedCommunities]);

  const getCommunity = useCallback((slug) => communities.find(c => c.slug === slug), [communities]);
  const getPostComments = useCallback((postId) => comments.filter(c => c.postId === postId), [comments]);
  const getCommunityPosts = useCallback((communityId) => posts.filter(p => p.communityId === communityId), [posts]);
  const getUserPosts = useCallback((userId) => posts.filter(p => p.authorId === userId), [posts]);
  const getUserComments = useCallback((userId) => comments.filter(c => c.authorId === userId), [comments]);

  return (
    <AppContext.Provider value={{
      currentUser, users, communities, posts, comments, votes, joinedCommunities,
      COLORS,
      login, signup, logout,
      createCommunity, createPost, createComment,
      vote, getUserVote, toggleJoin, isJoined,
      getCommunity, getPostComments, getCommunityPosts, getUserPosts, getUserComments,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
