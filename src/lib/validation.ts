import { z } from 'zod';

// Reusable validation patterns
const usernamePattern = /^[a-zA-Z0-9_]+$/;

// Schema for creating posts
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(500, 'Content must be 500 characters or less'),
  image: z.string().url('Invalid image URL').optional().nullable(),
  parentId: z.number().int().positive().optional().nullable(),
});

// Schema for creating comments
export const createCommentSchema = z.object({
  postId: z.number().int().positive('Invalid post ID'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(280, 'Comment must be 280 characters or less'),
});

// Schema for user registration
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or less')
    .regex(usernamePattern, 'Username can only contain letters, numbers, and underscores'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or less'),
});

// Schema for login
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Email or username is required')
    .max(255, 'Input too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password too long'),
});

// Schema for updating profile
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or less')
    .regex(usernamePattern, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z
    .string()
    .max(160, 'Bio must be 160 characters or less')
    .optional()
    .nullable(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  coverImage: z.string().url('Invalid cover image URL').optional().nullable(),
});

// Helper function to format Zod errors
export function formatZodErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

// Helper function to validate and return result
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: { field: string; message: string }[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: formatZodErrors(result.error) };
}
