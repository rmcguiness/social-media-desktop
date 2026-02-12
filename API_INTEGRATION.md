# API Integration Guide

## Overview

The frontend follows Next.js 15 best practices using **Server Components** for data fetching with built-in caching and streaming. Client Components are only used when interactivity is required.

Mock data is preserved in `src/mocks/` but only used where backend endpoints don't exist yet (e.g., notifications).

## Architecture

### Next.js App Router Pattern

```
✅ Server Components (default)
   ↓ Fetch data on server
   ↓ Pass props to Client Components
   ↓
❌ Client Components (only for interactivity)
   - No data fetching with useEffect
   - Receive data as props
   - Handle user interactions
```

### File Structure

```
src/
├── config/
│   └── api.ts                    # API endpoints + base URL
├── lib/
│   └── api-client.ts             # HTTP client with Next.js caching
├── services/
│   └── posts.service.ts          # Domain-specific API methods
├── app/
│   ├── home/
│   │   ├── page.tsx              # ✅ Server Component (fetches data)
│   │   ├── loading.tsx           # Loading UI (Suspense)
│   │   ├── error.tsx             # Error boundary
│   │   └── _components/
│   │       └── right-bar.tsx     # ✅ Server Component (receives props)
│   └── notifications/
│       └── page.tsx              # ✅ Server Component (mocks for now)
└── components/
    ├── post/post.tsx             # ✅ Server Component (display only)
    └── comments/comment.tsx      # ✅ Server Component (display only)
```

## Current Integration

✅ **Posts** - Server Component with caching
- Home page (`/home`) - Fetches on server, streams to client
- Automatic loading states via `loading.tsx`
- Error handling via `error.tsx`
- 60-second cache revalidation

🔲 **Notifications** - Still using mocks
- Notifications page (`/notifications`) - Server Component with mocks
- _Backend doesn't have notification endpoints yet_

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Running the Stack

1. **Start the backend** (Terminal 1):
   ```bash
   cd /Volumes/ryan-drive/personal-projects/social-media-backend
   npm run dev
   ```
   Backend runs on http://localhost:4000

2. **Start the frontend** (Terminal 2):
   ```bash
   cd /Volumes/ryan-drive/personal-projects/social-media-desktop
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## Server Components Pattern

### Example: Data Fetching Page

```typescript
// app/posts/page.tsx (Server Component - default)
import { postsService } from '@/services/posts.service';
import { PostsList } from '@/components/posts-list';

export default async function PostsPage() {
  // Fetch data directly on the server
  const response = await postsService.list(20);
  
  return (
    <div>
      <h1>Posts</h1>
      {/* Pass data as props */}
      <PostsList posts={response.data} />
    </div>
  );
}
```

### Example: Loading State

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return <PostsSkeleton />;
}
```

### Example: Error Boundary

```typescript
// app/posts/error.tsx
'use client'; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## API Client with Next.js Caching

The API client supports Next.js fetch options:

```typescript
// lib/api-client.ts
apiClient.get<Post[]>('/api/posts', {
  cache: 'force-cache',        // Cache forever
  revalidate: 60,              // Revalidate every 60 seconds
  tags: ['posts'],             // Tag for on-demand revalidation
});
```

### Cache Strategies

**Static Rendering (default)**
```typescript
// Cached until manually revalidated
apiClient.get('/api/posts', {
  cache: 'force-cache',
});
```

**Time-based Revalidation**
```typescript
// Revalidate every 60 seconds
apiClient.get('/api/posts', {
  revalidate: 60,
});
```

**Dynamic Rendering**
```typescript
// Never cache (opt out of caching)
apiClient.get('/api/posts', {
  cache: 'no-store',
});
```

**On-demand Revalidation**
```typescript
// Tag for revalidateTag('posts')
apiClient.get('/api/posts', {
  tags: ['posts'],
});
```

## Services with Caching

Posts service uses smart caching:

```typescript
// services/posts.service.ts
export const postsService = {
  // GET requests: 60s revalidation
  async list(limit = 20, cursor?: number): Promise<PaginatedResponse<Post>> {
    return apiClient.get(`/api/posts?limit=${limit}`, {
      revalidate: 60,
      tags: ['posts'],
    });
  },

  // Mutations: no caching
  async create(data: CreatePostData, token: string): Promise<Post> {
    return apiClient.post('/api/posts', data, {
      token,
      cache: 'no-store',
    });
  },
};
```

## When to Use Client Components

Only add `"use client"` when you need:

1. **Browser APIs** (localStorage, window, etc.)
2. **Event handlers** (onClick, onChange, etc.)
3. **React hooks** (useState, useEffect, etc.)
4. **Interactive UI** (forms, buttons with state)

```typescript
// ❌ DON'T: Client Component for data fetching
'use client';
import { useEffect, useState } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  }, []);
  
  return <div>{/* ... */}</div>;
}

// ✅ DO: Server Component for data fetching
export default async function Posts() {
  const posts = await postsService.list();
  
  return <div>{/* ... */}</div>;
}

// ✅ DO: Client Component for interactivity
'use client';
export function LikeButton({ postId }: { postId: number }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

## Adding New API Integrations

### 1. Add endpoint to config

```typescript
// src/config/api.ts
export const API_ENDPOINTS = {
  // ...existing endpoints
  comments: '/api/comments',
} as const;
```

### 2. Create service with caching

```typescript
// src/services/comments.service.ts
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

export const commentsService = {
  async list(postId: number) {
    return apiClient.get(`${API_ENDPOINTS.comments}?postId=${postId}`, {
      revalidate: 30,
      tags: ['comments', `post-${postId}-comments`],
    });
  },
};
```

### 3. Use in Server Component

```typescript
// app/posts/[id]/page.tsx
import { commentsService } from '@/services/comments.service';

export default async function PostPage({ params }: { params: { id: string } }) {
  const comments = await commentsService.list(Number(params.id));
  
  return (
    <div>
      <h2>Comments</h2>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

## Loading States

Next.js automatically handles loading states with `loading.tsx`:

```
app/
├── posts/
│   ├── page.tsx       # Shows after data loads
│   └── loading.tsx    # Shows while fetching
```

The loading UI shows automatically during:
- Initial page load
- Navigation between pages
- Hard refresh

## Error Handling

Error boundaries catch errors in Server Components:

```
app/
├── posts/
│   ├── page.tsx       # Can throw errors
│   └── error.tsx      # Catches errors
```

Errors bubble up to the nearest `error.tsx`:
- Network errors
- API errors (4xx, 5xx)
- Runtime errors

## Streaming and Suspense

For advanced patterns, use `<Suspense>`:

```typescript
import { Suspense } from 'react';

export default function PostPage() {
  return (
    <div>
      <h1>Post Title</h1>
      
      {/* This section streams independently */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}

async function Comments() {
  const comments = await commentsService.list();
  return <CommentsList comments={comments} />;
}
```

## Mock Data

Mock data is preserved for development and testing:

```
src/mocks/
├── mockPosts.ts           # ❌ Not used (backend implemented)
└── mockNotifications.ts   # ✅ Still used (backend pending)
```

## Next Steps

1. **Add authentication** - Implement login/register with Server Actions
2. **Add notification endpoints** - Backend + frontend integration
3. **Add comments integration** - Connect comment components to backend
4. **Add likes integration** - Optimistic updates with Server Actions
5. **Add infinite scroll** - Use React Server Components streaming
6. **Add real-time updates** - WebSocket or Server-Sent Events

## Troubleshooting

### "Cannot read properties of undefined"
- Check that API response matches TypeScript types
- Verify backend is running and returning correct data

### CORS Issues
Backend CORS already configured for all origins. If issues persist:
```typescript
// backend/src/plugins/cors.ts
await app.register(cors, {
  origin: 'http://localhost:3000', // Restrict to frontend
  credentials: true,
});
```

### Cache Not Updating
Use different revalidation strategies:
```typescript
// Force dynamic rendering
{ cache: 'no-store' }

// Time-based revalidation
{ revalidate: 60 }

// On-demand revalidation (in Server Actions)
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
```

### Data Not Showing
1. Check backend is running: http://localhost:4000/health
2. Check browser console for errors
3. Check Network tab for API calls
4. Verify `NEXT_PUBLIC_API_URL` in `.env.local`

## Resources

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Caching in Next.js](https://nextjs.org/docs/app/building-your-application/caching)
