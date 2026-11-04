import { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PROC_STAT_CD } from "@constants/code";

/** 테스트마다 모듈을 새로 불러와 목업 데이터를 초기 상태로 만듭니다. (sessionStorage에 저장된 값은 그대로 읽음) */
async function loadAdapter() {
  vi.resetModules();
  const { mockAdapter } = await import("./adapter");
  return async (method: string, url: string, data?: unknown) => {
    const pending = mockAdapter({
      method,
      url,
      data,
      headers: {},
    } as unknown as InternalAxiosRequestConfig).then((response) => response.data);
    // 타이머를 돌리는 동안 거절되어도 "처리되지 않은 거절"이 되지 않도록 미리 처리기를 붙여 둠 (결과는 아래에서 그대로 전달)
    pending.catch(() => {});
    await vi.runAllTimersAsync(); // 응답 지연(setTimeout) 건너뛰기
    return pending;
  };
}

describe("mockAdapter (데모 모드 목업 API)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("관리자 배정관리 미배정 탭은 등기의뢰·보완필요만 돌려준다", async () => {
    const request = await loadAdapter();
    const { data } = await request(
      "get",
      "/api/admin/match/list?tabSelection=00&searchRqstNo=&sortOrder=00&pageNum=1&pageSize=50",
    );

    expect(data.mtchList.length).toBeGreaterThan(0);
    expect(data.unMtchCnt).toBe(data.mtchList.length);
    for (const item of data.mtchList) {
      expect([PROC_STAT_CD.REQUEST, PROC_STAT_CD.SUPPLEMENT]).toContain(item.statCd);
    }
  });

  it("관리자 등기관리 목록의 탭 건수 합계는 전체 건수와 같다", async () => {
    const request = await loadAdapter();
    const { data } = await request(
      "get",
      "/api/admin/registration/list?tabSelection=&pageNum=1&pageSize=50",
    );
    const { total, ...tabs } = data.rgstrStatistics;

    expect(data.totalElements).toBe(total);
    expect(Object.values(tabs).reduce((sum: number, count) => sum + Number(count), 0)).toBe(total);
  });

  it("등기접수증을 승인하면 접수완료가 되고 진행 이력이 추가된다", async () => {
    const request = await loadAdapter();
    const { data: list } = await request(
      "get",
      "/api/admin/registration/list?tabSelection=40&pageNum=1&pageSize=50",
    );
    const { rqstNo } = list.rgstrMngrList[0];

    const result = await request(
      "patch",
      "/api/admin/registration/approval",
      JSON.stringify({ rqstNo }),
    );
    expect(result.code).toBe("00");

    const { data: detail } = await request(
      "get",
      `/api/admin/registration/detail?rqstno=${rqstNo}`,
    );
    expect(detail.statCd).toBe(PROC_STAT_CD.COMPLET);
    expect(detail.statHistList[0].statNm).toBe("접수완료");
  });

  it("보완요청 사유는 금융기관 의뢰 정보에도 반영된다", async () => {
    const request = await loadAdapter();
    const { data: list } = await request(
      "get",
      "/api/admin/match/list?tabSelection=00&pageNum=1&pageSize=50",
    );
    const { rqstNo } = list.mtchList.find(
      (item: { statCd: string }) => item.statCd === PROC_STAT_CD.REQUEST,
    );

    await request(
      "patch",
      "/api/admin/registration/supplementation",
      JSON.stringify({ rqstNo, procRsnCnts: "필수 서류 누락" }),
    );

    const { data: info } = await request("get", `/api/client/request/info?rqstno=${rqstNo}`);
    expect(info.statCd).toBe(PROC_STAT_CD.SUPPLEMENT);
    expect(info.procRsnCnts).toBe("필수 서류 누락");
  });

  it("multipart(FormData의 req JSON)로 신규 등록하면 새 의뢰번호로 목록에 추가된다", async () => {
    const request = await loadAdapter();
    const { data: rqstNo } = await request("get", "/api/comm/sequence?sequence=RQST_NO");

    const form = new FormData();
    form.append(
      "req",
      JSON.stringify({ rqstNo, dbtrNm: "테스트채무자", lgagMembNo: "LAW1", execDt: "20261110" }),
    );
    expect((await request("post", "/api/admin/match", form)).code).toBe("00");

    const { data: created } = await request("get", `/api/admin/match/${rqstNo}`);
    // 폼이 보내는 YYYYMMDD 날짜는 YYYY-MM-DD로 저장하고, 접수 전이므로 법원·등기소는 비어 있음
    expect(created).toMatchObject({
      rqstNo,
      dbtrNm: "테스트채무자",
      execDt: "2026-11-10",
      statCd: PROC_STAT_CD.MATCH,
      lgagMembNm: "데모 법무법인",
      judtCourtNm: "",
      regrNm: "",
    });
  });

  it("변경 내용은 sessionStorage에 저장되어 새로고침(모듈 재로딩) 후에도 유지된다", async () => {
    let request = await loadAdapter();
    const { data: list } = await request(
      "get",
      "/api/admin/registration/list?tabSelection=40&pageNum=1&pageSize=50",
    );
    const { rqstNo } = list.rgstrMngrList[0];
    await request("patch", "/api/admin/registration/approval", JSON.stringify({ rqstNo }));

    request = await loadAdapter();
    const { data: detail } = await request(
      "get",
      `/api/admin/registration/detail?rqstno=${rqstNo}`,
    );
    expect(detail.statCd).toBe(PROC_STAT_CD.COMPLET);
  });

  it("등록되지 않은 API는 404로 거절한다", async () => {
    const request = await loadAdapter();
    await expect(request("get", "/api/unknown")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
