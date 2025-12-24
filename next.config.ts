import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  sassOptions: {},
  // 配置外部API代理，解决跨域问题
  rewrites: async () => {
    const ginApiBaseUrl = process.env.NEXT_PUBLIC_GIN_API_BASE_URL;
    return [
      {
        source: '/api/:path((?!set-token).*)',
        destination: `${ginApiBaseUrl}/api/:path*`,
        basePath: false,
      },
    ];
  },
  compress: true,
  output: "standalone"
};

export default nextConfig;
