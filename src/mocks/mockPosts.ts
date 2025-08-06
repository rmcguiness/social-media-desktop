import { Post } from '@/types/post-type';

export const mockPosts: Post[] = [
	{
		id: 1,
		title: 'Hello World',
		content: 'This is a test post',
		image: 'https://picsum.photos/id/10/2500/1667',
		likes: 10,
		comments: 5,
		shares: 2,
		user: {
			id: 1,
			name: 'John Doe',
			image: 'https://picsum.photos/id/2/200',
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 2,
		title: 'Hello World 2',
		content:
			'This is a test post with super long content that should be truncated. After the truncation, the content should be displayed with an show more button.',
		image: null,
		likes: 5,
		comments: 0,
		shares: 0,
		user: {
			id: 2,
			name: 'Jane Doe',
			image: 'https://picsum.photos/id/3/200',
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
