import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PROC_STAT_CD } from "@constants/code";
import { axiosBasicInstance } from "@services";
import { mockDesktopMatchMedia, renderWithProviders } from "@/test/renderWithProviders";

import RegistrationInformation from "./RegistrationInformation";

/*
 * 통합 테스트: 관리자 등기접수 정보 등록에서 제출했을 때 서버로 보내는 요청(reqVo JSON·접수증 파일)이
 * 입력값과 같은지, 연속 클릭에도 한 번만 전송되는지 확인합니다.
 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin/registration/registration-detail",
  useSearchParams: () => new URLSearchParams(),
}));

let requests: InternalAxiosRequestConfig[] = [];
const originalAdapter = axiosBasicInstance.defaults.adapter;

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
  vi.stubGlobal(
    "URL",
    Object.assign(URL, { createObjectURL: () => "blob:preview", revokeObjectURL: () => {} }),
  );
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
const acceptRequests = () =>
  requests.filter((r) => r.method === "post" && r.url?.endsWith("/api/admin/registration/accept"));

async function fill() {
  const { REGISTRATIONS } = await import("@/mocks/data");
  // 아직 접수 정보가 없는 대출실행 건
  const target = REGISTRATIONS.find((item) => item.statCd === PROC_STAT_CD.EXECUTION)!;
  renderWithProviders(
    <RegistrationInformation requestNo={target.rqstNo} onClose={vi.fn()} isDesktop />,
  );

  await screen.findByText(target.rqstNo, {}, { timeout: 3000 });
  await vi.waitFor(
    () => expect(document.querySelectorAll("#court option").length).toBeGreaterThan(1),
    { timeout: 3000 },
  );

  const receipt = new File(["receipt"], "등기접수증.png", { type: "image/png" });
  await userEvent.upload(document.getElementById("fileInput") as HTMLInputElement, receipt);
  await userEvent.selectOptions(document.getElementById("court")!, "02"); // 수원지방법원 성남지원
  await vi.waitFor(
    () => expect(document.querySelectorAll("#registry-office option").length).toBeGreaterThan(1),
    { timeout: 3000 },
  );
  // 고른 법원 관할의 등기소만 보여야 함
  const officeCodes = Array.from(
    document.querySelectorAll<HTMLOptionElement>("#registry-office option"),
  )
    .map((option) => option.value)
    .filter((value) => /^\d+$/.test(value)); // 안내 문구 옵션 제외
  expect(officeCodes).toEqual(["0201", "0202"]);
  await userEvent.selectOptions(document.getElementById("registry-office")!, "0201");
  await userEvent.type(screen.getByPlaceholderText("접수번호를 입력해 주세요"), "12345");
  await userEvent.type(screen.getByPlaceholderText(/시스템 관리자에게 전달사항/), "원본 확인 완료");

  return { target, receipt };
}

describe("등기접수 정보 등록 → 요청 내용 (통합)", () => {
  it("입력한 법원·등기소·접수번호와 접수증 파일을 그대로 보낸다", async () => {
    const { target, receipt } = await fill();

    await userEvent.click(screen.getByRole("button", { name: /^등록/ }));
    await waitForMock();

    const [request] = acceptRequests();
    const form = request.data as FormData;
    expect(JSON.parse(String(form.get("reqVo")))).toMatchObject({
      rqstNo: target.rqstNo,
      judtCourtCd: "02",
      regrCd: "0201",
      acptNo: "12345",
      mngrDlvrCnts: "원본 확인 완료",
    });
    expect((form.getAll("multipartFiles") as File[]).map((f) => f.name)).toEqual([receipt.name]);
  });

  it("등록 버튼을 연달아 눌러도 한 번만 전송된다", async () => {
    await fill();

    await userEvent.dblClick(screen.getByRole("button", { name: /^등록/ }));
    await waitForMock();

    expect(acceptRequests()).toHaveLength(1);
  });
});
