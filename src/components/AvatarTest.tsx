/**
 * Visual test component for avatar generation
 * Shows avatars at different sizes with various names
 */

import { getAvatarUrl } from '../lib/avatar';

const TEST_USERS = [
  { name: 'John Doe', image: null },
  { name: 'Jane Smith', image: null },
  { name: 'Alice', image: null },
  { name: 'Bob Johnson', image: null },
  { name: 'Charlie Brown', image: null },
  { name: 'Diana Prince', image: null },
  { name: 'Eve Adams', image: null },
  { name: 'Frank Wright', image: null },
  { name: 'Grace Hopper', image: null },
  { name: 'Henry Ford', image: null },
  { name: '', image: null }, // Empty name test
];

const SIZES = [
  { size: 32, label: '32px (small)' },
  { size: 48, label: '48px (medium)' },
  { size: 64, label: '64px (large)' },
  { size: 128, label: '128px (xl)' },
];

export default function AvatarTest() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>Avatar Generation Test</h1>
      
      {SIZES.map(({ size, label }) => (
        <div key={size} style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{label}</h2>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem',
            alignItems: 'center'
          }}>
            {TEST_USERS.map((user, index) => (
              <div 
                key={index}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <img
                  src={getAvatarUrl(user)}
                  alt={user.name || 'Anonymous'}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: '2px solid #e5e7eb'
                  }}
                />
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  maxWidth: size,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.name || '(empty)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>✅ Test Checklist</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Avatars render at multiple sizes (32px, 48px, 64px, 128px)</li>
          <li>Initials extracted correctly (first + last name)</li>
          <li>Single names use first 2 letters</li>
          <li>Empty names show fallback icon</li>
          <li>Gradient backgrounds are visually distinct</li>
          <li>Same name always generates same avatar (deterministic)</li>
          <li>Typography is clean and modern (X.com style)</li>
        </ul>
      </div>
    </div>
  );
}
