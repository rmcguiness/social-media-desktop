import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
			{
				protocol: 'https',
				hostname: 'ui-avatars.com',
			},
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
			},
			{
				protocol: 'https',
				hostname: 'i.pravatar.cc'
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: '**.gstatic.com', // Google images (wildcard)
			},
			{
				protocol: 'https',
				hostname: '**.googleusercontent.com', // Google user content
			},
			{
				protocol: 'https',
				hostname: 'imgur.com',
			},
			{
				protocol: 'https',
				hostname: 'i.imgur.com',
			},
		],
	},
};

export default nextConfig;
