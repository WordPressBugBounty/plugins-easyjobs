/**
 * Small helpers shared by the candidate-details components.
 */

export const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] || '';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (a + b).toUpperCase();
};

// Map a pipeline label to one of the design's status colour classes.
export const statusClass = (label = '') => {
  const l = label.toLowerCase();
  if (/reject|declin/.test(l)) return 'st-red';
  if (/hire|select|onboard/.test(l)) return 'st-green';
  if (/offer/.test(l)) return 'st-violet';
  if (/interview/.test(l)) return 'st-amber';
  if (/short|review/.test(l)) return 'st-accent';
  if (/appl|new/.test(l)) return 'st-neutral';
  return 'st-accent';
};

export const dotColorVar = (cls) =>
  ({
    'st-red': 'var(--red)',
    'st-green': 'var(--green)',
    'st-violet': 'var(--violet)',
    'st-amber': 'var(--amber)',
    'st-accent': 'var(--accent)',
    'st-neutral': 'var(--muted-2)',
    'st-sky': 'var(--sky)',
  })[cls] || 'var(--accent)';

// Short education badge (e.g. "Bachelor of Science" → "BSC").
export const eduBadge = (edu) => {
  const src = edu?.level_name || edu?.degree_name || '';
  const map = {
    bachelor: 'BSC',
    master: 'MSC',
    'higher secondary': 'HSC',
    secondary: 'SSC',
    phd: 'PHD',
    diploma: 'DIP',
  };
  const key = Object.keys(map).find((k) => src.toLowerCase().includes(k));
  if (key) return map[key];
  return (src.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'EDU').toUpperCase();
};
