export function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatVotes(n) {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

export function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}

export function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#e63946','#2563eb','#16a34a','#7c3aed','#d97706','#0891b2','#be185d','#047857','#9333ea','#dc2626'];
  return colors[Math.abs(hash) % colors.length];
}
