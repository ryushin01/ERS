import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { axiosBasicInstance } from "@services";
import {
  mockDesktopMatchMedia,
  pickAvailableDay,
  renderWithProviders,
} from "@/test/renderWithProviders";

import DesktopFileUploader from "./DesktopFileUploader";

/*
 * 통합 테스트: 금융기관 전자등기 의뢰(PC) 화면에서 제출했을 때 서버로 보내는 요청이 정확한지 확인합니다.
 * - 신규: execDt + 첨부 파일(multipartFiles)
 * - 수정: rqstCrtReq JSON(의뢰번호·대출실행일·유지할 기존 파일 목록) + 새로 첨부한 파일
 * - 버튼을 연달아 눌러도 한 번만 제출
 */

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/financial/request-list/request",
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

const fileInput = () => document.querySelector<HTMLInputElement>('input[type="file"]')!;
const dateInput = () => document.querySelector<HTMLInputElement>("._datepicker input")!;
const submitButton = () => screen.getByRole("button", { name: /^제출하기/ });
const submitted = (method: "post" | "patch") =>
  requests.filter((r) => r.method === method && r.url?.endsWith("/api/client/request"));
const waitForMock = () => new Promise((resolve) => setTimeout(resolve, 600));

describe("전자등기 의뢰(PC) → 요청 내용 (통합)", () => {
  it("신규: 대출실행일과 첨부한 파일을 그대로 보낸다", async () => {
    renderWithProviders(<DesktopFileUploader requestNo={null} />);

    const files = [
      new File(["1"], "계약서_1.png", { type: "image/png" }),
      new File(["2"], "계약서_2.png", { type: "image/png" }),
    ];
    await userEvent.upload(fileInput(), files);
    const execDt = await pickAvailableDay(dateInput(), 2);

    await userEvent.click(submitButton());
    await waitForMock();

    const [request] = submitted("post");
    const form = request.data as FormData;
    expect(form.get("execDt")).toBe(execDt);
    expect((form.getAll("multipartFiles") as File[]).map((f) => f.name)).toEqual([
      "계약서_1.png",
      "계약서_2.png",
    ]);
  });

  it("수정: 지운 기존 파일은 빠지고, 남긴 파일 목록과 새 파일만 보낸다", async () => {
    const { REGISTRATIONS } = await import("@/mocks/data");
    const target = REGISTRATIONS.find((item) => item.statNm === "보완필요")!;
    renderWithProviders(<DesktopFileUploader requestNo={target.rqstNo} />);

    // 기존 등기자료 3개가 목록에 나타날 때까지 기다림
    const list = await screen.findByText(/등기자료_1\.svg/, {}, { timeout: 3000 });
    const items = within(list.closest("ul")!).getAllByRole("listitem");
    expect(items).toHaveLength(3);

    // 첫 번째 기존 파일 삭제, 새 파일 추가
    await userEvent.click(within(items[0]).getByRole("button", { name: "해당 이미지 삭제" }));
    await userEvent.upload(
      fileInput(),
      new File(["new"], "보완_재촬영.png", { type: "image/png" }),
    );

    await userEvent.click(submitButton());
    await waitForMock();

    const [request] = submitted("patch");
    const form = request.data as FormData;
    const body = JSON.parse(String(form.get("rqstCrtReq")));
    expect(body).toMatchObject({
      rqstNo: target.rqstNo,
      execDt: target.execDt.replaceAll("-", ""), // 기존 대출실행일 유지
    });
    expect(
      body.imageInfo.map((img: { filIdx: string; attcFilNm: string }) => img.attcFilNm),
    ).toEqual(["등기자료_2.svg", "등기자료_3.svg"]);
    expect((form.getAll("multipartFiles") as File[]).map((f) => f.name)).toEqual([
      "보완_재촬영.png",
    ]);
  });

  it("제출 버튼을 연달아 눌러도 한 번만 제출된다", async () => {
    renderWithProviders(<DesktopFileUploader requestNo={null} />);
    await userEvent.upload(fileInput(), new File(["1"], "계약서.png", { type: "image/png" }));
    await pickAvailableDay(dateInput(), 2);

    await userEvent.dblClick(submitButton());
    await userEvent.click(submitButton());
    await waitForMock();

    expect(submitted("post")).toHaveLength(1);
  });
});
