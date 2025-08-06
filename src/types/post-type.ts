import { User } from '@/types/user-type';

export type Post = {
	id: number;
	parentId?: number | null;
	title: string;
	content: string;
	image: string | null;
	likes: number;
	comments: number;
	shares: number;
	user: User;
	createdAt: Date;
	updatedAt: Date;
};
