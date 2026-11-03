export const appURI = process.env.NEXT_PUBLIC_APP_URI;

export const adminURI = process.env.NEXT_PUBLIC_ADMIN_URI;

export const apiURI = process.env.NEXT_PUBLIC_API_URI;

/**
 * 포트폴리오(데모) 모드
 * - 기본 활성화: 백엔드 없이 로그인 버튼만 누르면 금융기관 화면으로 진입합니다.
 * - 실제 로그인 API를 사용하려면 환경 변수 NEXT_PUBLIC_DEMO_MODE=false 로 설정합니다.
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
