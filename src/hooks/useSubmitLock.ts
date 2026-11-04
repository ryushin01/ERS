import { useCallback, useRef, useState } from "react";

/**
 * @name useSubmitLock
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 저장 요청의 중복 제출을 막습니다.
 *              - lock(): 잠겨 있지 않으면 잠그고 true, 이미 잠겨 있으면 false (같은 렌더링 안의 연속 클릭도 ref로 즉시 차단)
 *              - unlock(): 실패했을 때 다시 제출할 수 있도록 해제
 *              - isLocked: 버튼 disabled 등 화면 표시에 사용
 * @example
 * const submitLock = useSubmitLock();
 * const handleSubmit = () => {
 *   if (!submitLock.lock()) return;
 *   mutate(undefined, { onError: submitLock.unlock });
 * };
 */
export default function useSubmitLock() {
  const lockedRef = useRef(false);
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => {
    if (lockedRef.current) return false;
    lockedRef.current = true;
    setIsLocked(true);
    return true;
  }, []);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    setIsLocked(false);
  }, []);

  return { isLocked, lock, unlock };
}
