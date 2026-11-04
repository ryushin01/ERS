import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { axiosBasicInstance } from "@services";
import {
  mockDesktopMatchMedia,
  pickAvailableDay,
  renderWithProviders,
} from "@/test/renderWithProviders";

import CreateForm from "./CreateForm";

/*
 * 통합 테스트: 전자등기 신규 등록 폼에 값을 입력하고 제출했을 때,
 * 서버로 보내는 요청(req JSON·첨부 파일)이 입력한 값과 정확히 같은지 확인합니다.
 * - 데이터는 데모 목업 API를 그대로 거치고, axios 어댑터를 감싸 요청 내용만 기록합니다.
 * - 주소검색은 외부 우편번호 서비스라, 고른 주소를 바로 넘겨주는 가짜 모달로 대신합니다.
 */

const PICKED_ADDRESS = {
  roadAddr: "경기 성남시 분당구 삼평동 681", // 지번
  rdnmAddr: "경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)", // 도로명
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin/assign/assign-create",
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

const pickDay = (inputId: string, nth: number) =>
  pickAvailableDay(document.getElementById(inputId) as HTMLInputElement, nth);

/** 신규 등록 요청(POST /api/admin/match)의 req JSON과 첨부 파일 */
function createRequest() {
  const config = requests.find((r) => r.method === "post" && r.url?.endsWith("/api/admin/match"));
  if (!config) return null;
  const form = config.data as FormData;
  return {
    req: JSON.parse(String(form.get("req"))),
    files: form.getAll("multipartFiles") as File[],
  };
}

async function fillForm({ amount }: { amount: string }) {
  renderWithProviders(<CreateForm />);

  // 의뢰번호가 발급되고, 채권자·법무대리인 목록이 채워질 때까지 기다림
  await screen.findByText(/^DEMO-\d{6}$/, {}, { timeout: 3000 });
  await vi.waitFor(
    () => expect(document.querySelectorAll("#bnd-memb-no option").length).toBeGreaterThan(1),
    {
      timeout: 3000,
    },
  );

  const file = new File(["계약서"], "계약서.png", { type: "image/png" });
  await userEvent.upload(
    document.getElementById("registration-data-input-file") as HTMLInputElement,
    file,
  );

  const execDt = await pickDay("exec-dt", 5);
  await userEvent.selectOptions(document.getElementById("bnd-memb-no")!, "000-00-00002");
  await userEvent.type(screen.getByPlaceholderText("채무자 입력"), "홍길동");
  await userEvent.selectOptions(document.querySelector('select[name="realeCd"]')!, "01");

  await userEvent.click(screen.getByRole("button", { name: /^주소 검색/ }));
  await userEvent.click(screen.getByRole("button", { name: "테스트 주소 선택" }));
  await userEvent.type(document.querySelector('input[name="bldg"]')!, "101");
  await userEvent.type(document.querySelector('input[name="unit"]')!, "1001");

  await userEvent.click(screen.getByRole("button", { name: /^고유번호 조회/ }));
  await vi.waitFor(
    () =>
      expect(document.querySelector<HTMLInputElement>('input[name="unqRgstrNo"]')!.value).toMatch(
        /^\d{14}$/,
      ),
    {
      timeout: 3000,
    },
  );

  await userEvent.type(document.getElementById("bnd-max-amt")!, amount);
  const seDt = await pickDay("se-dt", 3);
  await userEvent.selectOptions(document.getElementById("lgag-memb-no")!, "LAW2");
  await userEvent.type(screen.getByPlaceholderText(/법무대리인에게 전달사항/), "원본 서류 지참");

  return { file, execDt, seDt };
}

const submit = async () => {
  fireEvent.submit(screen.getByRole("button", { name: /^배정하기/ }).closest("form")!);
  await new Promise((resolve) => setTimeout(resolve, 600)); // 목업 응답 지연
};

describe("전자등기 신규 등록 → 요청 내용 (통합)", () => {
  it("입력한 값이 req JSON에 정확히 담기고, 첨부 파일이 함께 전송된다", async () => {
    const { file, execDt, seDt } = await fillForm({ amount: "300000000" });
    expect(execDt).toMatch(/^\d{8}$/);
    expect(document.getElementById("bnd-max-amt")).toHaveValue("300,000,000");

    await submit();

    const sent = createRequest();
    expect(sent).not.toBeNull();
    expect(sent!.req).toMatchObject({
      rqstNo: expect.stringMatching(/^DEMO-\d{6}$/),
      execDt,
      bndBizNo: "000-00-00002",
      dbtrNm: "홍길동",
      realeCd: "01",
      lotnumAddr: PICKED_ADDRESS.roadAddr, // 지번
      rdnmAddr: PICKED_ADDRESS.rdnmAddr, // 도로명
      lotnumAddrCd: "01",
      bldg: "101",
      unit: "1001",
      unqRgstrNo: expect.stringMatching(/^\d{14}$/),
      bndMaxAmt: 300000000,
      seDt,
      lgagMembNo: "LAW2",
      lgagDlvrCnts: "원본 서류 지참",
    });
    expect(typeof sent!.req.bndMaxAmt).toBe("number");
    expect(sent!.files.map((f) => f.name)).toEqual([file.name]);
  });

  it("금액 입력의 부호·소수점·문자는 무시하고 원 단위 정수로 보낸다", async () => {
    await fillForm({ amount: "-1,2a34.5" });
    expect(document.getElementById("bnd-max-amt")).toHaveValue("12,345");

    await submit();
    expect(createRequest()!.req.bndMaxAmt).toBe(12345);
  });

  it("배정하기를 여러 번 눌러도(응답 전·후 모두) 한 번만 등록된다", async () => {
    await fillForm({ amount: "300000000" });
    const button = screen.getByRole("button", { name: /^배정하기/ });

    await userEvent.dblClick(button); // 응답 전 연속 클릭
    await new Promise((resolve) => setTimeout(resolve, 600)); // 목업 응답 이후 (완료 토스트 후 이동 전)
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const posts = requests.filter(
      (r) => r.method === "post" && r.url?.endsWith("/api/admin/match"),
    );
    expect(posts).toHaveLength(1);
  });

  it("등록 요청이 실패하면 다시 제출할 수 있다", async () => {
    await fillForm({ amount: "300000000" });

    // 첫 번째 등록 요청만 서버 오류로 실패시킴
    let failed = false;
    const recordingAdapter = axiosBasicInstance.defaults.adapter as (
      c: InternalAxiosRequestConfig,
    ) => Promise<never>;
    axiosBasicInstance.defaults.adapter = (config) => {
      if (!failed && config.method === "post" && config.url?.endsWith("/api/admin/match")) {
        failed = true;
        requests.push(config);
        return Promise.reject(new Error("네트워크 오류"));
      }
      return recordingAdapter(config);
    };
    vi.spyOn(console, "error").mockImplementation(() => {});

    const button = screen.getByRole("button", { name: /^배정하기/ });
    await userEvent.click(button);
    await vi.waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const posts = requests.filter(
      (r) => r.method === "post" && r.url?.endsWith("/api/admin/match"),
    );
    expect(posts).toHaveLength(2);
  });

  it("채권최고액이 0원이면 제출하지 않는다", async () => {
    await fillForm({ amount: "0" });
    await submit();

    expect(createRequest()).toBeNull();
  });
});
