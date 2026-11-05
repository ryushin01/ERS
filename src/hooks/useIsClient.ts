import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * @name useIsClient
 * @description 서버 렌더링과 하이드레이션 중에는 false, 그 뒤 브라우저에서는 true입니다.
 *              서버와 결과가 달라지는 값(브라우저 정보, 포털 등)을 그릴 때 씁니다.
 */
export default function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
