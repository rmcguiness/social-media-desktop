/**
 * Tests for avatar generation
 */

import { getAvatarUrl, getAvatarGradient } from './avatar';

describe('Avatar Generation', () => {
  describe('getAvatarUrl', () => {
    it('should return user image if provided', () => {
      const user = {
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg'
      };
      
      expect(getAvatarUrl(user)).toBe('https://example.com/avatar.jpg');
    });

    it('should generate SVG data URI for user without image', () => {
      const user = {
        name: 'John Doe',
        image: null
      };
      
      const result = getAvatarUrl(user);
      expect(result).toMatch(/^data:image\/svg\+xml,/);
      expect(result).toContain('JD'); // Should contain initials
    });

    it('should handle empty image string', () => {
      const user = {
        name: 'Jane Smith',
        image: '   '
      };
      
      const result = getAvatarUrl(user);
      expect(result).toMatch(/^data:image\/svg\+xml,/);
      expect(result).toContain('JS');
    });

    it('should extract initials from first and last name', () => {
      const user = {
        name: 'Alice Bob Charlie',
        image: null
      };
      
      const result = getAvatarUrl(user);
      expect(result).toContain('AC'); // First and last
    });

    it('should handle single name (use first 2 letters)', () => {
      const user = {
        name: 'Madonna',
        image: null
      };
      
      const result = getAvatarUrl(user);
      expect(result).toContain('MA');
    });

    it('should handle empty name with fallback icon', () => {
      const user = {
        name: '',
        image: null
      };
      
      const result = getAvatarUrl(user);
      expect(result).toMatch(/^data:image\/svg\+xml,/);
      expect(result).toContain('path'); // Should have fallback icon path
    });

    it('should generate deterministic avatars (same name = same output)', () => {
      const user1 = { name: 'Test User', image: null };
      const user2 = { name: 'Test User', image: null };
      
      expect(getAvatarUrl(user1)).toBe(getAvatarUrl(user2));
    });

    it('should generate different avatars for different names', () => {
      const user1 = { name: 'Alice', image: null };
      const user2 = { name: 'Bob', image: null };
      
      expect(getAvatarUrl(user1)).not.toBe(getAvatarUrl(user2));
    });
  });

  describe('getAvatarGradient', () => {
    it('should return gradient color pair', () => {
      const gradient = getAvatarGradient('John Doe');
      
      expect(gradient).toHaveLength(2);
      expect(gradient[0]).toMatch(/^#[0-9A-F]{6}$/i);
      expect(gradient[1]).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should be deterministic (same name = same gradient)', () => {
      const gradient1 = getAvatarGradient('Test User');
      const gradient2 = getAvatarGradient('Test User');
      
      expect(gradient1).toEqual(gradient2);
    });

    it('should distribute names across different gradients', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
      const gradients = names.map(name => getAvatarGradient(name));
      
      // At least some gradients should be different
      const uniqueGradients = new Set(gradients.map(g => g.join(',')));
      expect(uniqueGradients.size).toBeGreaterThan(1);
    });
  });
});
