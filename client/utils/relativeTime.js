export default function relativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff/86400)} days ago`;
  return date.toLocaleDateString();
}
