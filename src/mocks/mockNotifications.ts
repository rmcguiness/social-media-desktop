import { Notification } from '@/types/notification-type';

export const mockNotifications: Notification[] = [
	{
		id: 1,
		type: 'follow',
		data: {
			user: {
				id: 1,
				name: 'John Doe',
				username: 'johndoe',
				email: 'john@example.com',
				image: 'https://via.placeholder.com/150',
			},
			time: new Date(),
		},
	},
	{
		id: 2,
		type: 'like',
		data: {
			user: {
				id: 2,
				name: 'Jane Doe',
				username: 'janedoe',
				email: 'jane@example.com',
				image: 'https://via.placeholder.com/150',
			},
			time: new Date(),
		},
	},
	{
		id: 3,
		type: 'subscribed',
		data: {
			user: {
				id: 3,
				name: 'Jim Doe',
				username: 'jimdoe',
				email: 'jim@example.com',
				image: 'https://via.placeholder.com/150',
			},
			time: new Date(),
		},
	},
	{
		id: 4,
		type: 'comment',
		data: {
			user: {
				id: 4,
				name: 'Jim Doe',
				username: 'jimdoe2',
				email: 'jim2@example.com',
				image: 'https://via.placeholder.com/150',
			},
			time: new Date(),
		},
	},
];
