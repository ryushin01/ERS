import {
  AD_ASSIGN,
  AD_PATH,
  FI_HOME,
  FI_PATH,
  LA_PATH,
  LOGIN_PATH,
  STORYBOOK_PATH,
} from "@constants/path";

import { isPathUnder } from "./pathUtil";

/**
 * 로그인 상태와 사용자 유형으로 이동할 주소를 정한다. 그대로 두면 null이다.
 * 서버가 있으면 미들웨어가, GitHub Pages처럼 정적으로 올리면 브라우저(StaticRouteGuard)가 쓴다.
 */
export function resolveRouteRedirect(
  pathname: string,
  membGbCd: string | undefined,
): string | null {
  const isFinancialPage = isPathUnder(pathname, FI_PATH);
  const isAdminPage = isPathUnder(pathname, AD_PATH);
  const isMemberPage = [FI_PATH, AD_PATH, LA_PATH].some((path) => isPathUnder(pathname, path));

  if (isPathUnder(pathname, STORYBOOK_PATH)) return null;
  // 금융기관 로그인 상태에서 금융기관 권한 외 접근 시
  if (membGbCd === "00" && !isFinancialPage) return FI_HOME;
  // 관리자 로그인 상태에서 관리자 권한 외 접근 시
  if (membGbCd === "20" && !isAdminPage) return AD_ASSIGN;
  // 미 로그인 상태에서 권한 페이지 접근 시
  if (!membGbCd && isMemberPage) return LOGIN_PATH;
  return null;
}
