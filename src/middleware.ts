import { NextResponse } from "next/server";

import { PUBLIC_FILES_REG_EXP } from "@constants/reg-exp";
import { resolveRouteRedirect } from "@utils/routeGuard";

import type { NextRequest } from "next/server";

/**
 * @name middleware
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 정적 파일은 로그인·사용자 유형과 상관없이 통과
  if (pathname.match(PUBLIC_FILES_REG_EXP)) return NextResponse.next();

  const target = resolveRouteRedirect(
    pathname,
    request.cookies.get("membGbCd")?.value || undefined,
  );
  return target ? NextResponse.redirect(new URL(target, request.url)) : NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
