import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // membGbCd (사용자 구분 코드)
  // 00 : 금융기관
  // 10 : 법무대리인
  // 20 : 관리자
  async redirects() {
    return [
      // Storybook 빌드 결과물(public/storybook)은 정적 파일이라 폴더 주소로는 열리지 않으므로 index.html로 이동
      // (rewrite로 연결하면 주소가 /storybook으로 남아 상대 경로 파일(./sb-manager 등)을 찾지 못함)
      { source: "/storybook", destination: "/storybook/index.html", permanent: false },
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
