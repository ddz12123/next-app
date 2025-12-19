import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {},
  // 配置外部API代理，解决跨域问题
  rewrites: async () => {
    const ginApiBaseUrl = process.env.NEXT_PUBLIC_GIN_API_BASE_URL;
    return [
      {
        source: "/gin/:path*",
        destination: `${ginApiBaseUrl}/:path*`,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
