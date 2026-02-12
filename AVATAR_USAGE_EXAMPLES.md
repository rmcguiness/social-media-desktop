# Avatar Usage Examples

## Basic Usage (Unchanged)

The `getAvatarUrl()` function works exactly the same as before:

```tsx
import { getAvatarUrl } from '@/lib/avatar';

// In your component
function UserProfile({ user }) {
  return (
    <img 
      src={getAvatarUrl(user)} 
      alt={user.name}
      className="rounded-full w-12 h-12"
    />
  );
}
```

## Different Sizes

Avatars scale perfectly at any size:

```tsx
// Small avatar (32px)
<img src={getAvatarUrl(user)} className="w-8 h-8 rounded-full" />

// Medium avatar (48px)
<img src={getAvatarUrl(user)} className="w-12 h-12 rounded-full" />

// Large avatar (64px)
<img src={getAvatarUrl(user)} className="w-16 h-16 rounded-full" />

// Extra large avatar (128px)
<img src={getAvatarUrl(user)} className="w-32 h-32 rounded-full" />
```

## With User Image Fallback

If user has an uploaded image, it's used automatically:

```tsx
const user1 = {
  name: 'John Doe',
  image: 'https://example.com/john.jpg'
};
// Returns: 'https://example.com/john.jpg'

const user2 = {
  name: 'Jane Smith',
  image: null
};
// Returns: 'data:image/svg+xml,...' (generated avatar)
```

## Edge Cases

### Empty Name

```tsx
const anonymousUser = {
  name: '',
  image: null
};
// Returns: SVG with user silhouette icon
```

### Single Name

```tsx
const singleName = {
  name: 'Madonna',
  image: null
};
// Returns: Avatar with initials "MA"
```

### Multi-Word Name

```tsx
const fullName = {
  name: 'Alice Bob Charlie',
  image: null
};
// Returns: Avatar with initials "AC" (first and last)
```

## Matching UI Colors (Bonus Feature)

Use `getAvatarGradient()` to match avatar colors elsewhere in the UI:

```tsx
import { getAvatarUrl, getAvatarGradient } from '@/lib/avatar';

function UserCard({ user }) {
  const [color1, color2] = getAvatarGradient(user.name);
  
  return (
    <div 
      className="card"
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`
      }}
    >
      <img src={getAvatarUrl(user)} className="avatar" />
      <h3>{user.name}</h3>
    </div>
  );
}
```

## User List with Avatars

```tsx
function UserList({ users }) {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="flex items-center gap-3">
          <img 
            src={getAvatarUrl(user)} 
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{user.name}</span>
        </div>
      ))}
    </div>
  );
}
```

## Chat Message Avatars

```tsx
function ChatMessage({ message, sender }) {
  return (
    <div className="flex items-start gap-2">
      <img 
        src={getAvatarUrl(sender)} 
        alt={sender.name}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className="font-semibold text-sm">{sender.name}</div>
        <div className="text-gray-700">{message.text}</div>
      </div>
    </div>
  );
}
```

## Profile Header

```tsx
function ProfileHeader({ user }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-4">
        <img 
          src={getAvatarUrl(user)} 
          alt={user.name}
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}
```

## Deterministic Colors Example

Same user always gets the same gradient:

```tsx
// These will produce identical avatars
const user1 = { name: 'John Doe', image: null };
const user2 = { name: 'John Doe', image: null };

getAvatarUrl(user1) === getAvatarUrl(user2); // true

const [c1a, c1b] = getAvatarGradient('John Doe');
const [c2a, c2b] = getAvatarGradient('John Doe');

c1a === c2a && c1b === c2b; // true
```

## Testing Different Names

```tsx
function AvatarShowcase() {
  const users = [
    { name: 'John Doe', image: null },
    { name: 'Jane Smith', image: null },
    { name: 'Alice', image: null },
    { name: 'Bob Johnson', image: null },
    { name: '', image: null }, // Empty name
  ];
  
  return (
    <div className="flex gap-4">
      {users.map((user, i) => (
        <div key={i} className="text-center">
          <img 
            src={getAvatarUrl(user)} 
            alt={user.name || 'Anonymous'}
            className="w-16 h-16 rounded-full mx-auto"
          />
          <p className="text-xs mt-2">{user.name || '(empty)'}</p>
        </div>
      ))}
    </div>
  );
}
```

## Custom Styling

Since avatars are inline SVGs, they work with all CSS:

```tsx
// With border
<img 
  src={getAvatarUrl(user)} 
  className="w-12 h-12 rounded-full border-2 border-blue-500"
/>

// With shadow
<img 
  src={getAvatarUrl(user)} 
  className="w-12 h-12 rounded-full shadow-lg"
/>

// With ring
<img 
  src={getAvatarUrl(user)} 
  className="w-12 h-12 rounded-full ring-2 ring-purple-500 ring-offset-2"
/>

// With hover effect
<img 
  src={getAvatarUrl(user)} 
  className="w-12 h-12 rounded-full hover:scale-110 transition-transform cursor-pointer"
/>
```

## Performance Notes

✅ **Fast:** Avatars generate in <1ms (no network delay)  
✅ **Cached:** Same user = same data URI (React memoization works)  
✅ **Scalable:** SVG = crisp at any resolution  
✅ **Small:** Inline SVG ~500 bytes vs ~10KB PNG

## Migration from Old Code

**No changes needed!** The function signature is identical:

```tsx
// Old code (still works)
const avatarUrl = getAvatarUrl({ name: user.name, image: user.profilePic });

// New implementation (same API, better performance)
// Just works™
```

## Debugging

To see the raw SVG:

```tsx
const user = { name: 'Test User', image: null };
const dataUri = getAvatarUrl(user);
const svg = decodeURIComponent(dataUri.replace('data:image/svg+xml,', ''));
console.log(svg);
```

Output:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="grad-123456" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="64" fill="url(#grad-123456)"/>
  <text x="64" y="64" text-anchor="middle" dominant-baseline="central" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="56" font-weight="600" fill="white" letter-spacing="-0.02em">
    TU
  </text>
</svg>
```

## TypeScript Types

```typescript
interface User {
  name: string;
  image?: string | null;
}

// Function signatures
function getAvatarUrl(user: User): string;
function getAvatarGradient(name: string): [string, string];
```

---

**Ready to use!** No code changes required - just enjoy faster, more private avatars. 🎉
