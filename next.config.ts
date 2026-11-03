import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    appIsrStatus: false,
  },
  webpack: (config, options) => {
    config.cache = false;

    config.module.rules.push({
      test: /\.temp\.tsx?$/,
      use: "ignore-loader",
    });

    return config;
  },
  // membGbCd (사용자 구분 코드)
  // 00 : 금융기관
  // 10 : 법무대리인
  // 20 : 관리자
  async redirects() {
    return [
      {
        source: "/",
        destination: "/financial/home",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "membGbCd",
            value: "00",
          },
        ],
      },
      {
        source: "/",
        destination: "/admin/assign",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "membGbCd",
            value: "20",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
