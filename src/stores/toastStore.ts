/* jotai atom import */
import { atom } from "jotai";

/**
 * @name Toast
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} message     - 토스트팝업에 표시될 메세지
 * @property {string} position    - 토스트팝업 위치
 * @property {function} afterFunc - 토스트팝업 노출후 진행 할 동작
 * @property {boolean} isOpen     - 토스트팝업 상태
 */

/* toast-popup 구조 */
interface ToastItems {
  message: string;
  position: "top" | "bottom";
  afterFunc?: (() => void) | null;
}

/* toast-popup open 여부 */
interface ToastStatus extends ToastItems {
  isOpen: boolean;
}

/* atom 초기값 설정 */
const toastAtom = atom<ToastStatus>({
  isOpen: false,
  message: "",
  position: "top",
  afterFunc: null,
});

/* atom 생성 */
const toastState = atom(
  (get) => get(toastAtom),
  (get, set, state: ToastItems) => {
    /* 3초 후 토스트팝업 사라짐 */
    setTimeout(() => {
      set(toastAtom, { ...state, isOpen: false });
      state.afterFunc?.();
    }, 3000);

    set(toastAtom, { ...state, isOpen: true });
  },
);

/* atom 내보내기 */
export { toastState };
