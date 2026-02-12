'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { commentsService } from '@/services/comments.service';
import { getAuthToken } from './auth';

export async function revalidateComments(postId: number) {
    revalidateTag(`post-${postId}-comments`);
    revalidatePath(`/posts/${postId}`);
}

export async function updateComment(commentId: number, postId: number, content: string) {
    const token = await getAuthToken();
    
    if (!token) {
        return { error: 'Not authenticated' };
    }

    try {
        const comment = await commentsService.update(commentId, { content }, token);
        await revalidateComments(postId);
        return { success: true, comment };
    } catch (error) {
        console.error('Failed to update comment:', error);
        return { error: 'Failed to update comment' };
    }
}

export async function deleteComment(commentId: number, postId: number) {
    const token = await getAuthToken();
    
    if (!token) {
        return { error: 'Not authenticated' };
    }

    try {
        await commentsService.delete(commentId, token);
        await revalidateComments(postId);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete comment:', error);
        return { error: 'Failed to delete comment' };
    }
}
