import { forwardRef, useEffect, useImperativeHandle } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { axiosBasicInstance } from "@services";
import {
  mockDesktopMatchMedia,
  pickAvailableDay,
  renderWithProviders,
} from "@/test/renderWithProviders";

import MobileFileUploader from "./MobileFileUploader";

/*
 * 통합 테스트: 모바일 전자등기 의뢰에서 촬영 → 업로드 → 제출했을 때 서버로 보내는 요청을 확인합니다.
 * 카메라는 jsdom에 없으므로 react-webcam만 대신합니다. (촬영할 때마다 내용이 다른 사진을 돌려줌)
 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/financial/request-list/request",
  useSearchParams: () => new URLSearchParams(),
}));

let shots = 0;
let cameraDenied = false;

vi.mock("react-webcam", () => ({
  default: forwardRef(function Webcam(
    { onUserMedia, onUserMediaError }: { onUserMedia?: () => void; onUserMediaError?: () => void },
    ref,
  ) {
    useImperativeHandle(ref, () => ({
      getScreenshot: () => `data:image/jpeg;base64,${btoa("x".repeat(++shots))}`,
    }));
    // 실제 라이브러리처럼 마운트할 때 한 번만 결과를 알림
    useEffect(() => {
      if (cameraDenied) onUserMediaError?.();
      else onUserMedia?.();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  }),
}));

let requests: InternalAxiosRequestConfig[] = [];
const originalAdapter = axiosBasicInstance.defaults.adapter;

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
  shots = 0;
  cameraDenied = false;
  requests = [];
  axiosBasicInstance.defaults.adapter = (config) => {
    requests.push(config);
    return (originalAdapter as (c: InternalAxiosRequestConfig) => Promise<never>)(config);
  };
});

afterEach(() => {
  axiosBasicInstance.defaults.adapter = originalAdapter;
});

const takeAndUpload = async () => {
  await userEvent.click(screen.getByRole("button", { name: /사진 촬영/ }));
  // 카메라 화면이 열리면 같은 이름의 버튼이 둘이 되므로, 마지막(셔터)을 누름
  await screen.findByRole("button", { name: "카메라 끄기" });
  await userEvent.click(screen.getAllByRole("button", { name: "사진 촬영" }).at(-1)!);
  await userEvent.click(await screen.findByRole("button", { name: "사진 업로드하기" }));
};
const submit = () => screen.getByRole("button", { name: /^제출하기/ });
const posted = () =>
  requests.filter((r) => r.method === "post" && r.url?.endsWith("/api/client/request"));
const postedFiles = () => (posted()[0].data as FormData).getAll("multipartFiles") as File[];

describe("MobileFileUploader", () => {
  it("카메라를 쓸 수 없으면 로딩을 끝내고 카메라 화면을 닫아 양식을 계속 쓸 수 있다", async () => {
    cameraDenied = true;
    renderWithProviders(<MobileFileUploader isMobile isPortrait />);

    await userEvent.click(screen.getByRole("button", { name: /사진 촬영/ }));

    await waitFor(() => expect(screen.queryByAltText("로딩 스피너")).not.toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "카메라 끄기" })).not.toBeInTheDocument();
  });

  it("사진 없이 제출하면 요청을 보내지 않는다", async () => {
    renderWithProviders(<MobileFileUploader isMobile isPortrait />);

    await userEvent.click(submit());

    expect(posted()).toHaveLength(0);
  });

  it("대출실행일 없이 제출하면 요청을 보내지 않는다", async () => {
    renderWithProviders(<MobileFileUploader isMobile isPortrait />);

    await takeAndUpload();
    await userEvent.click(submit());

    expect(posted()).toHaveLength(0);
  });

  it("촬영한 사진과 대출실행일을 함께 보내고 연속 클릭에도 한 번만 보낸다", async () => {
    renderWithProviders(<MobileFileUploader isMobile isPortrait />);

    await takeAndUpload();
    await pickAvailableDay(document.querySelector<HTMLInputElement>("._datepicker input")!);
    await userEvent.dblClick(submit());

    await waitFor(() => expect(posted()).toHaveLength(1));
    expect(postedFiles()).toHaveLength(1);
    expect((posted()[0].data as FormData).get("execDt")).toMatch(/^\d{8}$/);
  });

  it("첫 번째 사진을 지우면 그 사진만 빠지고 두 번째 사진을 보낸다", async () => {
    renderWithProviders(<MobileFileUploader isMobile isPortrait />);

    await takeAndUpload();
    await takeAndUpload();
    await userEvent.click(screen.getAllByRole("button", { name: "해당 이미지 삭제" })[0]);
    await pickAvailableDay(document.querySelector<HTMLInputElement>("._datepicker input")!);
    await userEvent.click(submit());

    await waitFor(() => expect(posted()).toHaveLength(1));
    expect(postedFiles().map((file) => file.size)).toEqual([2]);
  });
});
