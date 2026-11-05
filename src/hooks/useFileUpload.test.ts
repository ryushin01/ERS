import { ChangeEvent } from "react";
import { createElement, ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";

import { FILE_MAXIMUM_SIZE } from "@constants/file";
import { toastState } from "@stores";

import useFileUpload from "./useFileUpload";

function setup() {
  const store = createStore();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store }, children);
  return { store, ...renderHook(() => useFileUpload(), { wrapper }) };
}

const change = (files: File[] | null) =>
  ({ target: { files } }) as unknown as ChangeEvent<HTMLInputElement>;
const file = (name: string, size = 3) => new File(["x".repeat(size)], name, { type: "image/png" });

describe("useFileUpload", () => {
  it("선택한 파일을 쌓고 미리보기를 만든다", async () => {
    const { result } = setup();

    act(() => result.current.handleFileChange(change([file("a.png"), file("b.png")])));

    expect(result.current.imageList.map((item) => item.name)).toEqual(["a.png", "b.png"]);
    await waitFor(() => expect(result.current.previewImageList).toHaveLength(2));
    expect(result.current.previewImageList[0]).toMatch(/^data:/);
  });

  it("파일을 고르지 않으면 아무것도 바꾸지 않는다", () => {
    const { result } = setup();

    act(() => result.current.handleFileChange(change(null)));

    expect(result.current.imageList).toEqual([]);
  });

  it("개별 삭제는 그 파일만 빼고 알림을 띄운다", async () => {
    const { result, store } = setup();
    act(() => result.current.handleFileChange(change([file("a.png"), file("b.png")])));
    await waitFor(() => expect(result.current.previewImageList).toHaveLength(2));

    act(() => result.current.handleFileDelete(0));

    expect(result.current.imageList.map((item) => item.name)).toEqual(["b.png"]);
    expect(result.current.previewImageList).toHaveLength(1);
    expect(store.get(toastState).message).toBe("해당 파일이 삭제되었습니다.");
  });

  it("전체 용량을 넘으면 알림을 띄운다", () => {
    const { result, store } = setup();
    const huge = file("huge.png");
    Object.defineProperty(huge, "size", { value: FILE_MAXIMUM_SIZE + 1 });

    act(() => result.current.handleFileChange(change([huge])));

    expect(store.get(toastState).message).toContain("업로드 가능한 전체 용량");
  });
});
