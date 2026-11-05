import { act, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";

import { toastState } from "@stores";

import ToastPopup from "./ToastPopup";

describe("ToastPopup 접근성", () => {
  it("토스트가 없을 때도 알림 영역이 있어, 메시지가 뜨면 스크린 리더가 읽을 수 있다", () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ToastPopup />
      </Provider>,
    );

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toBeEmptyDOMElement();

    act(() => store.set(toastState, { message: "저장되었습니다.", position: "top" }));

    expect(screen.getByRole("status")).toBe(liveRegion);
    expect(liveRegion).toHaveTextContent("저장되었습니다.");
  });
});
