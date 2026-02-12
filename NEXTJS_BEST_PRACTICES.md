# Next.js 15 Best Practices - Quick Reference

## Core Principles

### 1. Server Components by Default ✅
```typescript
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

```typescript
// ❌ Client Component (only when needed)
'use client';
export default function Page() {
  const [data, setData] = useState();
  useEffect(() => { /* fetch */ }, []);
  return <div>{data}</div>;
}
```

### 2. Fetch Data on the Server
```typescript
// ✅ DO: Server Component
async function Posts() {
  const posts = await postsService.list();
  return <PostsList posts={posts} />;
}

// ❌ DON'T: useEffect + fetch
function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []);
  return <PostsList posts={posts} />;
}
```

### 3. Use Built-in Features

**Loading States** - `loading.tsx`
```typescript
// app/posts/loading.tsx
export default function Loading() {
  return <Skeleton />;
}
```

**Error Handling** - `error.tsx`
```typescript
// app/posts/error.tsx
'use client';
export default function Error({ error, reset }) {
  return <div>Error: {error.message}</div>;
}
```

## When to Use Client Components

Add `'use client'` directive only for:

1. **Event Handlers**
   ```typescript
   'use client';
   export function Button() {
     return <button onClick={() => alert('hi')}>Click</button>;
   }
   ```

2. **React Hooks**
   ```typescript
   'use client';
   import { useState } from 'react';
   export function Counter() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

3. **Browser APIs**
   ```typescript
   'use client';
   export function Storage() {
     const [value, setValue] = useState(() => 
       localStorage.getItem('key')
     );
     return <div>{value}</div>;
   }
   ```

4. **Third-party Libraries with Client Dependencies**
   ```typescript
   'use client';
   import { Chart } from 'chart.js';
   export function MyChart() {
     return <Chart data={data} />;
   }
   ```

## Caching Strategies

### Static (Default)
```typescript
// Cached until manually revalidated
fetch('/api/data', { cache: 'force-cache' });
```

### Revalidate (Time-based)
```typescript
// Revalidate every 60 seconds
fetch('/api/data', { next: { revalidate: 60 } });
```

### Dynamic (No Cache)
```typescript
// Never cache
fetch('/api/data', { cache: 'no-store' });
```

### Tagged Revalidation
```typescript
// Tag for on-demand revalidation
fetch('/api/data', { next: { tags: ['posts'] } });

// Later, in a Server Action:
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
```

## Component Composition

### ✅ DO: Pass Data Down
```typescript
// Server Component (parent)
async function Page() {
  const posts = await postsService.list();
  return <InteractivePost posts={posts} />;
}

// Client Component (child)
'use client';
function InteractivePost({ posts }) {
  return posts.map(post => (
    <button onClick={() => like(post.id)}>
      {post.title}
    </button>
  ));
}
```

### ❌ DON'T: Fetch in Client Components
```typescript
'use client';
function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []);
  return <div>{posts.map(...)}</div>;
}
```

## File Organization

```
app/
├── posts/
│   ├── page.tsx              # Server Component (data fetching)
│   ├── loading.tsx           # Loading UI
│   ├── error.tsx             # Error boundary
│   └── _components/
│       ├── post-list.tsx     # Server Component (display)
│       └── like-button.tsx   # Client Component (interactive)
```

## Data Fetching Patterns

### Parallel Requests
```typescript
async function Page() {
  // Runs in parallel
  const [posts, users] = await Promise.all([
    postsService.list(),
    usersService.list(),
  ]);
  
  return <div>...</div>;
}
```

### Sequential Requests
```typescript
async function Page() {
  const post = await postsService.getById(1);
  const comments = await commentsService.listByPost(post.id);
  
  return <div>...</div>;
}
```

### Streaming with Suspense
```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Title</h1>
      
      {/* Main content loads first */}
      <PostContent />
      
      {/* Comments stream in separately */}
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

## Performance Best Practices

### 1. Use Server Components for Static Content
Server Components:
- Don't send JavaScript to the client
- Can access backend resources directly
- Automatically split code

### 2. Minimize Client Component Size
```typescript
// ✅ Small interactive component
'use client';
export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
}

// ❌ Large client component
'use client';
export function EntirePage() {
  return <div>...</div>; // Everything is now client-side
}
```

### 3. Use Appropriate Cache Strategy
- **Static content**: `cache: 'force-cache'`
- **User-specific**: `cache: 'no-store'`
- **Frequently updated**: `revalidate: 60`

### 4. Implement Loading States
Always provide `loading.tsx` for better UX during data fetching.

## Common Patterns

### Form Submission (Server Actions)
```typescript
// app/posts/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  await postsService.create({ title, content });
  
  revalidateTag('posts');
  redirect('/posts');
}

// app/posts/new/page.tsx
import { createPost } from '../actions';

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Dynamic Routes
```typescript
// app/posts/[id]/page.tsx
export default async function PostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const post = await postsService.getById(Number(params.id));
  
  return <div>{post.title}</div>;
}
```

### Search Params
```typescript
// app/posts/page.tsx
export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1;
  const posts = await postsService.list(20, page);
  
  return <div>...</div>;
}
```

## Migration Checklist

Converting from Client to Server Components:

- [ ] Remove `'use client'` directive
- [ ] Replace `useState` + `useEffect` with direct `await`
- [ ] Remove loading/error state management
- [ ] Add `loading.tsx` for loading UI
- [ ] Add `error.tsx` for error handling
- [ ] Update function to `async`
- [ ] Add caching configuration to fetch calls
- [ ] Move interactive parts to separate Client Components

## Quick Wins

1. **Remove unnecessary Client Components** - Default to Server
2. **Add loading.tsx files** - Instant loading states
3. **Add error.tsx files** - Better error handling
4. **Use time-based revalidation** - Automatic cache updates
5. **Split large Client Components** - Extract interactive parts

## Anti-Patterns to Avoid

❌ Fetching in useEffect
❌ Large Client Components
❌ Missing loading states
❌ Over-caching dynamic content
❌ Under-caching static content
❌ Using Client Components for display-only content

## Resources

- [Next.js Docs - Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Docs - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Docs - Caching](https://nextjs.org/docs/app/building-your-application/caching)
