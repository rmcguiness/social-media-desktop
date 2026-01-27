import { User } from '@/types/user-type';

export type Notification = {
	id: number;
	type: 'follow' | 'like' | 'subscribed' | 'comment';
	data: {
		user: User;
		others?: User[];
		time: Date;
	};
};
