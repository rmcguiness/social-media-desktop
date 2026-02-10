'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidateHomeFeed() {
    // Revalidate the posts cache tag (used by postsService.list)
    revalidateTag('posts');
    // Also revalidate the home page path
    revalidatePath('/home');
    revalidatePath('/');
}

export async function revalidatePostPage(postId: number) {
    // Revalidate specific post cache tag
    revalidateTag(`post-${postId}`);
    // Also revalidate the post page path
    revalidatePath(`/posts/${postId}`);
}
