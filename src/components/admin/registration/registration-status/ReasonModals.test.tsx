import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { axiosBasicInstance } from "@services";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import RegistrationCancel from "./RegistrationCancel";
import RegistrationRejection from "./RegistrationRejection";

/*
 * 통합 테스트: 관리자 등기관리의 반려·진행취소 팝업에서 제출했을 때 서버로 보내는 사유가 정확한지 확인합니다.
 * (금융 서비스에서 처리 사유는 이력으로 남으므로, 고른 사유·직접 입력한 사유가 그대로 전송되어야 함)
 */

const RQST_NO = "DEMO-002396";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin/registration",
  useSearchParams: () => new URLSearchParams(),
}));

let requests: InternalAxiosRequestConfig[] = [];
const originalAdapter = axiosBasicInstance.defaults.adapter;

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
  requests = [];
  axiosBasicInstance.defaults.adapter = (config) => {
    requests.push(config);
    return (originalAdapter as (c: InternalAxiosRequestConfig) => Promise<never>)(config);
  };
});

afterEach(() => {
  axiosBasicInstance.defaults.adapter = originalAdapter;
});

const waitForMock = () => new Promise((resolve) => setTimeout(resolve, 600));

describe.each([
  {
    name: "반려",
    path: "/api/admin/registration/reject",
    selectId: "reject-progress",
    submitName: /^반려하기/,
    firstReason: "접수증 이미지 불량",
    render: () =>
      renderWithProviders(
        <RegistrationRejection requestNo={RQST_NO} closeRejectionModal={vi.fn()} />,
      ),
  },
  {
    name: "진행취소",
    path: "/api/admin/registration/cancel",
    selectId: "cancel-progress",
    submitName: /^진행 ?취소/,
    firstReason: "대출 취소",
    render: () =>
      renderWithProviders(
        <RegistrationCancel requstNo={RQST_NO} closeCancelProgressModal={vi.fn()} />,
      ),
  },
])("$name 사유 팝업 → 요청 내용 (통합)", ({ path, selectId, submitName, firstReason, render }) => {
  const sent = () => requests.filter((r) => r.method === "patch" && r.url?.endsWith(path));
  const sentBody = (index = 0) => JSON.parse(String(sent()[index].data));
  const select = () => document.getElementById(selectId) as HTMLSelectElement;
  const etcInput = () => screen.getByPlaceholderText("사유를 입력해 주세요");

  async function renderAndWait() {
    render();
    await vi.waitFor(() => expect(select().querySelectorAll("option").length).toBeGreaterThan(2), {
      timeout: 3000,
    });
  }

  it("코드를 고르면 그 사유 이름을 보낸다", async () => {
    await renderAndWait();
    await userEvent.selectOptions(select(), "00");
    await userEvent.click(screen.getByRole("button", { name: submitName }));
    await waitForMock();

    expect(sent()).toHaveLength(1);
    expect(sentBody()).toEqual({ rqstNo: RQST_NO, procRsnCnts: firstReason });
  });

  it("기타(99)를 고르고 입력한 뒤 Enter로 바로 제출해도 입력한 사유를 보낸다", async () => {
    await renderAndWait();
    await userEvent.selectOptions(select(), "99");
    expect(etcInput()).toBeVisible();

    await userEvent.type(etcInput(), "  원본 서류와 내용 불일치  {Enter}");
    await waitForMock();

    expect(sentBody()).toEqual({ rqstNo: RQST_NO, procRsnCnts: "원본 서류와 내용 불일치" });
  });

  it("기타인데 사유를 입력하지 않으면 보내지 않는다", async () => {
    await renderAndWait();
    await userEvent.selectOptions(select(), "99");
    await userEvent.type(etcInput(), "   ");
    await userEvent.click(screen.getByRole("button", { name: submitName }));
    await waitForMock();

    expect(sent()).toHaveLength(0);
  });

  it("연달아 눌러도 한 번만 보내고, 실패하면 다시 보낼 수 있다", async () => {
    await renderAndWait();
    await userEvent.selectOptions(select(), "01");

    // 첫 요청만 서버 오류로 실패시킴
    let failed = false;
    const recording = axiosBasicInstance.defaults.adapter as (
      c: InternalAxiosRequestConfig,
    ) => Promise<never>;
    axiosBasicInstance.defaults.adapter = (config) => {
      if (!failed && config.url?.endsWith(path)) {
        failed = true;
        requests.push(config);
        // 실제 네트워크처럼 응답이 늦게 오는 동안 연속 클릭이 들어오도록 지연 후 실패
        return new Promise((_, reject) =>
          setTimeout(() => reject(new Error("네트워크 오류")), 300),
        );
      }
      return recording(config);
    };
    vi.spyOn(console, "error").mockImplementation(() => {});

    const button = screen.getByRole("button", { name: submitName });
    await userEvent.dblClick(button); // 응답 전 연속 클릭 → 한 번만 전송 (이 요청은 실패)
    await vi.waitFor(() => expect(button).toBeEnabled(), { timeout: 2000 });
    expect(sent()).toHaveLength(1);

    await userEvent.click(button); // 재시도
    await waitForMock();
    expect(sent()).toHaveLength(2);
  });
});
