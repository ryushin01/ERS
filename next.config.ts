import type { NextConfig } from "next";

// GitHub Pages용 정적 빌드. 서버 기능(미들웨어, 리다이렉트, 이미지 최적화)은 쓸 수 없어 브라우저에서 처리한다.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = "/ERS";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        env: {
          NEXT_PUBLIC_BASE_PATH: basePath,
          NEXT_PUBLIC_STATIC_EXPORT: "1",
          NEXT_PUBLIC_STORYBOOK_URL: `${basePath}/storybook/index.html?path=/docs/소개--docs`,
        },
        images: { loader: "custom" as const, loaderFile: "./src/utils/staticImageLoader.ts" },
      }
    : { output: "standalone" as const }),
  reactStrictMode: true,
  // membGbCd (사용자 구분 코드)
  // 00 : 금융기관
  // 10 : 법무대리인
  // 20 : 관리자
  async redirects() {
    if (staticExport) return [];
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
