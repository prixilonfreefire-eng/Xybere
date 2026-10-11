// Generates clean, crisp SVG avatar data URIs with initials and custom theme gradients.
// No demo stock photos used.

const PALETTE = [
  { bg: '#0866FF', text: '#FFFFFF', name: 'Mission Blue' },
  { bg: '#00B4D8', text: '#050505', name: 'Cyber Cyan' },
  { bg: '#7928CA', text: '#FFFFFF', name: 'Deep Violet' },
  { bg: '#10B981', text: '#FFFFFF', name: 'Emerald' },
  { bg: '#F59E0B', text: '#050505', name: 'Solar Amber' },
  { bg: '#EF4444', text: '#FFFFFF', name: 'Mars Red' },
  { bg: '#3B82F6', text: '#FFFFFF', name: 'Cobalt' },
  { bg: '#6366F1', text: '#FFFFFF', name: 'Indigo' },
];

export function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function generateInitialsAvatar(name: string, colorIndex = 0): string {
  const initials = getInitials(name);
  const color = PALETTE[Math.abs(colorIndex) % PALETTE.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="50" fill="${color.bg}" />
    <text x="50" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="700" fill="${color.text}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export { PALETTE };
