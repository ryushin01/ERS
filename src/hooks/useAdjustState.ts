import { useState } from "react";

/**
 * @name useAdjustState
 * @description 값이 바뀔 때 상태를 함께 맞춥니다. 이펙트와 달리 옛 상태로 한 번 그렸다가 다시 그리지 않습니다.
 *              React 문서의 "렌더링 중 상태 조정" 패턴입니다. 첫 렌더링에도 한 번 실행합니다.
 *              - adjust에서는 이 컴포넌트의 상태만 바꿉니다. 렌더링 중이므로 토스트 같은 다른 컴포넌트 상태는 이펙트에서 바꿉니다.
 *              - deps에는 렌더링마다 새로 만들어지지 않는 값을 넣습니다.
 * @see https://react.dev/reference/react/useState#storing-information-from-previous-renders
 */
export default function useAdjustState(deps: readonly unknown[], adjust: () => void) {
  const [previous, setPrevious] = useState<readonly unknown[] | null>(null);

  if (!previous || deps.some((value, index) => !Object.is(value, previous[index]))) {
    setPrevious(deps);
    adjust();
  }
}
