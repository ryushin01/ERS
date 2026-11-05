"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { resolveRouteRedirect } from "@utils/routeGuard";

/** 미들웨어가 돌지 않는 정적 배포(GitHub Pages)에서 같은 이동 규칙을 브라우저에서 적용한다. */
export default function StaticRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const target = resolveRouteRedirect(pathname, Cookies.get("membGbCd"));
    if (target) router.replace(target);
  }, [pathname, router]);

  return null;
}
