const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 정적 배포(GitHub Pages)의 이미지 주소. 최적화 서버가 없어 원본을 쓰고, 저장소 하위 경로를 붙인다. */
export default function staticImageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // import한 이미지(/ERS/_next/...)에는 Next가 이미 경로를 붙여 준다.
  const needsBase = src.startsWith("/") && !src.startsWith(`${BASE_PATH}/`);
  return needsBase ? `${BASE_PATH}${src}` : src;
}
