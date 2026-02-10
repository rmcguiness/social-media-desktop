'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateHomeFeed() {
    revalidatePath('/home');
    revalidatePath('/');
}

export async function revalidatePostPage(postId: number) {
    revalidatePath(`/posts/${postId}`);
}
