import { Post } from '@/types/post-type';

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mockPosts: Post[] = [
	...Array.from({ length: 10 }).map((_, index) => ({
		id: index + 1,
		parentId: index === 0 ? null : index,
		createdAt: new Date(),
		updatedAt: new Date(),
		title: `Testing Title ${index + 1}`,
		content: `This is a test post with super long content that should be truncated. After the truncation, the content should be displayed with an show more button.`,
		image:
			index % 2 === 0
				? `https://picsum.photos/id/${randomInt(1, 100)}/2500/1667`
				: null,
		likes: 5,
		comments: 0,
		shares: 0,
		user: {
			id: index + 4,
			name: `User ${index + 1}`,
			image: `https://picsum.photos/id/${randomInt(1, 100)}/200`,
		},
	})),
];
