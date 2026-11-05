"use client";

import { useSyncExternalStore } from "react";

/* 화면 구분 기준 (모바일: ~767px, 태블릿: 768~1366px, 그 외 PC) */
export const MOBILE_QUERY = "(min-width: 320px) and (max-width: 767px)";
export const TABLET_QUERY = "(min-width: 768px) and (max-width: 1366px)";
const PORTRAIT_QUERY = "(orientation: portrait)";
const LANDSCAPE_QUERY = "(orientation: landscape)";

/* 미디어 쿼리 결과가 바뀔 때 다시 렌더링하도록 구독 */
const subscribe = (query: string) => (onChange: () => void) => {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
};

/* 쿼리별 구독 함수를 한 번만 만들어 재사용 (렌더링마다 새 함수면 매번 다시 구독함) */
const subscribers = new Map<string, ReturnType<typeof subscribe>>();
const getSubscriber = (query: string) => {
  if (!subscribers.has(query)) subscribers.set(query, subscribe(query));
  return subscribers.get(query)!;
};

/**
 * 미디어 쿼리 일치 여부
 * - 브라우저에서는 첫 렌더링부터 실제 값을 돌려줍니다.
 * - 서버 렌더링과 하이드레이션 때는 false(PC 기준)를 돌려주고, 하이드레이션 직후 실제 값으로 다시 렌더링합니다.
 */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    getSubscriber(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * @name useResponsive
 * @version 2.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 화면 크기·방향을 구분합니다. 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 *              이전에는 값을 useState 초기값(false)으로 두었다가 이펙트에서 바꿨기 때문에,
 *              화면에 들어올 때마다 모바일에서도 PC 레이아웃이 한 번 그려진 뒤 바뀌었습니다(깜빡임).
 *              지금은 useSyncExternalStore로 matchMedia를 직접 읽어, 페이지 이동·모달 등 브라우저에서 새로 그리는 화면은 첫 렌더링부터 맞는 레이아웃을 그립니다.
 */
export default function useResponsive() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);
  const isPortrait = useMediaQuery(PORTRAIT_QUERY);
  const isLandscape = useMediaQuery(LANDSCAPE_QUERY);
  const isDesktop = !(isMobile || isTablet);

  return { isMobile, isTablet, isDesktop, isPortrait, isLandscape };
}
