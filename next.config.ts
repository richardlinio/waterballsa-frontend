import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'world.waterballsa.tw',
				pathname: '/world/courses/**',
			},
		],
	},
};

export default nextConfig;
