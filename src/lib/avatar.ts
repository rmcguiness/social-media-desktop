/**
 * Generate avatar for a user using local SVG generation
 * No external API dependencies - all avatars are generated client-side
 */

// Gradient color pairs for avatars (modern X.com style)
const GRADIENT_PAIRS: [string, string][] = [
  ['#3B82F6', '#8B5CF6'], // blue → purple
  ['#EC4899', '#F97316'], // pink → orange
  ['#06B6D4', '#10B981'], // teal → green
  ['#8B5CF6', '#EC4899'], // purple → pink
  ['#F59E0B', '#EF4444'], // amber → red
  ['#10B981', '#06B6D4'], // emerald → cyan
  ['#6366F1', '#8B5CF6'], // indigo → purple
  ['#F97316', '#FBBF24'], // orange → yellow
  ['#14B8A6', '#3B82F6'], // teal → blue
  ['#A855F7', '#EC4899'], // violet → pink
];

/**
 * Simple hash function to convert string to number
 * Used for deterministic color selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get deterministic gradient colors for a given name
 */
function getGradientForName(name: string): [string, string] {
  const hash = hashString(name);
  const index = hash % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[index];
}

/**
 * Extract initials from a name (up to 2 letters)
 */
function getInitials(name: string): string {
  if (!name || name.trim() === '') {
    return '';
  }

  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // Single name: use first 2 characters
    return parts[0].slice(0, 2).toUpperCase();
  }
  
  // Multiple names: use first letter of first and last name
  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}

/**
 * Generate an SVG avatar with initials and gradient background
 */
function generateAvatarSVG(name: string): string {
  const initials = getInitials(name);
  const [color1, color2] = getGradientForName(name);
  
  // Fallback icon for users with no name (user silhouette)
  if (!initials) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="grad-fallback" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#94A3B8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#64748B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#grad-fallback)"/>
      <path d="M64 32c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zM64 72c-17.6 0-32 10.4-32 24v8h64v-8c0-13.6-14.4-24-32-24z" fill="white" opacity="0.9"/>
    </svg>`;
  }

  // Create a unique gradient ID based on the name hash
  const gradientId = `grad-${hashString(name)}`;
  
  // Font size scales with initial count (1 letter = bigger, 2 letters = smaller)
  const fontSize = initials.length === 1 ? 64 : 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="64" cy="64" r="64" fill="url(#${gradientId})"/>
    <text x="64" y="64" text-anchor="middle" dominant-baseline="central" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="${fontSize}" font-weight="600" fill="white" letter-spacing="-0.02em">
      ${initials}
    </text>
  </svg>`;
}

/**
 * Convert SVG string to data URI
 */
function svgToDataUri(svg: string): string {
  // Encode SVG for use in data URI
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate a fallback avatar URL for a user
 * Returns a data URI with inline SVG (no external API calls)
 */
export function getAvatarUrl(user: { name: string; image?: string | null }): string {
  // If user has an image, use it (check for both null and empty string)
  if (user.image && user.image.trim() !== '') {
    return user.image;
  }

  // Generate SVG avatar and convert to data URI
  const svg = generateAvatarSVG(user.name || '');
  return svgToDataUri(svg);
}

/**
 * Get the gradient color pair for a given name (utility function)
 * Useful for matching avatar colors elsewhere in the UI
 */
export function getAvatarGradient(name: string): [string, string] {
  return getGradientForName(name);
}
