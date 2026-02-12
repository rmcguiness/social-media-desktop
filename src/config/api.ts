export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  refresh: '/api/auth/refresh',
  logout: '/api/auth/logout',
  me: '/api/auth/me',
  
  // Posts
  posts: '/api/posts',
  post: (id: number) => `/api/posts/${id}`,
  
  // Comments
  comments: '/api/comments',
  comment: (id: number) => `/api/comments/${id}`,
  
  // Likes
  likes: '/api/likes',
  
  // Users
  users: '/api/users',
  user: (id: number) => `/api/users/${id}`,
  userByUsername: (username: string) => `/api/users/username/${username}`,
  
  // Messages
  conversations: '/api/conversations',
  messages: (conversationId: number) => `/api/conversations/${conversationId}/messages`,
  
  // Notifications
  notifications: '/api/notifications',
} as const;
