import { Notification } from '@/types/notifcation-type';

export const mockNotifications: Notification[] = [
	{
		id: 1,
		type: 'follow',
		data: {
			user: {
				id: 1,
				name: 'John Doe',
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
				image: 'https://via.placeholder.com/150',
			},
			time: new Date(),
		},
	},
];
