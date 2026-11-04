import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { axiosBasicInstance } from "@services";
import {
  mockDesktopMatchMedia,
  pickAvailableDay,
  renderWithProviders,
} from "@/test/renderWithProviders";

import DetailForm from "./DetailForm";

/*
 * 통합 테스트: 관리자 전자등기 배정(배정 상세) 화면에서 배정하기·보완요청을 했을 때
 * 서버로 보내는 요청 내용이 입력값과 같은지, 연속 클릭에도 한 번만 전송되는지 확인합니다.
 */

const RQST_NO = "DEMO-002400"; // 목업의 미배정(등기의뢰) 건
const PICKED_ADDRESS = {
  roadAddr: "서울특별시 중구 예시동 101-1", // 지번
  rdnmAddr: "서울특별시 중구 예시로 12 (예시빌딩)", // 도로명
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => `/admin/assign/assign-detail/${RQST_NO}`,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("../AddressSearchModal", () => ({
  default: ({
    onSelect,
    onClose,
  }: {
    onSelect: (a: typeof PICKED_ADDRESS) => void;
    onClose: () => void;
  }) => (
    <button
      type="button"
      onClick={() => {
        onSelect(PICKED_ADDRESS);
        onClose();
      }}
    >
      테스트 주소 선택
    </button>
  ),
}));

let requests: InternalAxiosRequestConfig[] = [];
const originalAdapter = axiosBasicInstance.defaults.adapter;

beforeEach(() => {
  sessionStorage.clear();
  mockDesktopMatchMedia();
  document.body.insertAdjacentHTML("beforeend", '<div id="portal"></div>');
  requests = [];
  axiosBasicInstance.defaults.adapter = (config) => {
    requests.push(config);
    return (originalAdapter as (c: InternalAxiosRequestConfig) => Promise<never>)(config);
  };
});

afterEach(() => {
  axiosBasicInstance.defaults.adapter = originalAdapter;
  document.getElementById("portal")?.remove();
});

const waitForMock = () => new Promise((resolve) => setTimeout(resolve, 600));
const sent = (method: string, path: string) =>
  requests.filter((r) => r.method === method && r.url?.endsWith(path));

async function renderAndWait() {
  renderWithProviders(<DetailForm isDesktop rqstNo={RQST_NO} />);
  await screen.findByText(RQST_NO, {}, { timeout: 3000 });
  await vi.waitFor(
    () => expect(document.querySelectorAll("#lgag-memb-no option").length).toBeGreaterThan(1),
    { timeout: 3000 },
  );
}

async function fillAssignment() {
  await userEvent.type(screen.getByPlaceholderText("채무자 입력"), "김민준");
  await userEvent.selectOptions(document.getElementById("reale-cd")!, "02");
  await userEvent.click(screen.getByRole("button", { name: /^주소 검색/ }));
  await userEvent.click(screen.getByRole("button", { name: "테스트 주소 선택" }));
  await userEvent.type(document.querySelector('input[name="bldg"]')!, "101");
  await userEvent.type(document.querySelector('input[name="unit"]')!, "1201");
  await userEvent.click(screen.getByRole("button", { name: /^고유번호 조회/ }));
  await vi.waitFor(
    () =>
      expect(document.querySelector<HTMLInputElement>('input[name="unqRgstrNo"]')!.value).toMatch(
        /^\d{14}$/,
      ),
    { timeout: 3000 },
  );
  await userEvent.type(document.getElementById("bnd-max-amt")!, "250,000,000");
  const seDt = await pickAvailableDay(document.getElementById("se-dt") as HTMLInputElement, 3);
  await userEvent.selectOptions(document.getElementById("lgag-memb-no")!, "LAW1");
  return { seDt };
}

describe("전자등기 배정(배정 상세) → 요청 내용 (통합)", () => {
  it("배정하기: 입력한 값이 req JSON에 정확히 담긴다", async () => {
    await renderAndWait();
    const { seDt } = await fillAssignment();

    await userEvent.click(screen.getByRole("button", { name: /^배정하기/ }));
    await waitForMock();

    const [request] = sent("patch", "/api/admin/match");
    const req = JSON.parse(String((request.data as FormData).get("req")));
    expect(req).toMatchObject({
      rqstNo: RQST_NO,
      dbtrNm: "김민준",
      realeCd: "02",
      lotnumAddr: PICKED_ADDRESS.roadAddr,
      rdnmAddr: PICKED_ADDRESS.rdnmAddr,
      lotnumAddrCd: "01",
      bldg: "101",
      unit: "1201",
      unqRgstrNo: expect.stringMatching(/^\d{14}$/),
      bndMaxAmt: 250000000,
      seDt,
      lgagMembNo: "LAW1",
    });
  });

  it("배정하기를 연달아 눌러도 한 번만 전송된다", async () => {
    await renderAndWait();
    await fillAssignment();

    const button = screen.getByRole("button", { name: /^배정하기/ });
    await userEvent.dblClick(button);
    await userEvent.click(button);
    await waitForMock();

    expect(sent("patch", "/api/admin/match")).toHaveLength(1);
  });

  it("보완요청: 고른 사유를 보내고, 연달아 눌러도 한 번만 전송된다", async () => {
    await renderAndWait();

    await userEvent.click(screen.getByRole("button", { name: /^보완요청/ }));
    const reason = await screen.findByRole(
      "combobox",
      { name: /보완요청 사유/ },
      { timeout: 3000 },
    );
    await vi.waitFor(() => expect(reason.querySelectorAll("option").length).toBeGreaterThan(1), {
      timeout: 3000,
    });
    await userEvent.selectOptions(reason, "01");

    const submit = screen.getByRole("button", { name: /^보완 요청하기/ });
    await userEvent.dblClick(submit);
    await waitForMock();

    const requestsSent = sent("patch", "/api/admin/registration/supplementation");
    expect(requestsSent).toHaveLength(1);
    expect(JSON.parse(String(requestsSent[0].data))).toMatchObject({
      rqstNo: RQST_NO,
      procRsnCnts: "필수 서류 누락",
    });
  });
});
