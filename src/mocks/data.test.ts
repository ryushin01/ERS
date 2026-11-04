import { beforeEach, describe, expect, it, vi } from "vitest";

import { PROC_STAT_CD } from "@constants/code";

/*
 * 데모 목업 데이터가 업무 규칙과 맞는지 확인합니다.
 * (화면은 이 데이터를 실제 API 응답처럼 쓰므로, 데이터가 어긋나면 화면도 어긋나게 보입니다)
 */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ASSIGNED: string[] = [
  PROC_STAT_CD.MATCH,
  PROC_STAT_CD.EXECUTION,
  PROC_STAT_CD.REVIEWING,
  PROC_STAT_CD.RETURN,
  PROC_STAT_CD.COMPLET,
];
const RECEIPT: string[] = [PROC_STAT_CD.REVIEWING, PROC_STAT_CD.RETURN, PROC_STAT_CD.COMPLET];

async function loadData() {
  vi.resetModules();
  return import("./data");
}

beforeEach(() => {
  sessionStorage.clear();
});

describe("의뢰 목업 데이터 (REGISTRATIONS)", async () => {
  const data = await loadData();
  const { REGISTRATIONS, PROC_STAT_CODE_LIST, COMMON_CODES, REQUEST_TAB_STATUS } = data;
  const codeName = (statCd: string) => PROC_STAT_CODE_LIST.find((c) => c.code === statCd)?.codeNm;

  it("의뢰번호는 DEMO-000000 형식이고 중복되지 않는다", () => {
    const numbers = REGISTRATIONS.map((item) => item.rqstNo);
    expect(new Set(numbers).size).toBe(numbers.length);
    numbers.forEach((rqstNo) => expect(rqstNo).toMatch(/^DEMO-\d{6}$/));
  });

  it("날짜는 모두 YYYY-MM-DD 형식이다", () => {
    for (const item of REGISTRATIONS) {
      for (const key of ["crtDtm", "execDt", "seDt"] as const)
        expect(item[key], `${item.rqstNo}.${key}`).toMatch(DATE);
      if (item.mtchDtm) expect(item.mtchDtm).toMatch(DATE);
      if (item.acptRptDtm) expect(item.acptRptDtm).toMatch(DATE);
      item.statHistList.forEach((history) => expect(history.crtDtm).toMatch(DATE));
    }
  });

  it("진행상태 이름은 코드표와 같다", () => {
    for (const item of REGISTRATIONS) expect(item.statNm, item.rqstNo).toBe(codeName(item.statCd));
  });

  it("법무대리인·배정일은 배정 이후 상태에만 있다", () => {
    for (const item of REGISTRATIONS) {
      const assigned = ASSIGNED.includes(item.statCd);
      expect(Boolean(item.lgagMembNm), `${item.rqstNo} ${item.statNm}`).toBe(assigned);
      expect(Boolean(item.mtchDtm), `${item.rqstNo} ${item.statNm}`).toBe(assigned);
    }
  });

  it("접수번호·접수일·접수 여부는 접수 이후 상태(접수검토중·반려·완료)에만 있다", () => {
    for (const item of REGISTRATIONS) {
      const received = RECEIPT.includes(item.statCd);
      expect(Boolean(item.acptNo), `${item.rqstNo} ${item.statNm}`).toBe(received);
      expect(Boolean(item.acptRptDtm), item.rqstNo).toBe(received);
      expect(item.rgstrAcptYn, item.rqstNo).toBe(received ? "Y" : "N");
    }
  });

  it("보완필요 건에는 보완 사유가 있다", () => {
    REGISTRATIONS.filter((item) => item.statCd === PROC_STAT_CD.SUPPLEMENT).forEach((item) =>
      expect(item.procRsnCnts, item.rqstNo).not.toBe(""),
    );
  });

  it("등기고유번호는 숫자 14자리다 (입력칸이 type=number)", () => {
    REGISTRATIONS.filter((item) => item.unqRgstrNo).forEach((item) =>
      expect(item.unqRgstrNo).toMatch(/^\d{14}$/),
    );
  });

  it("진행 이력은 등기의뢰로 시작해 현재 상태로 끝난다 (최근 이력이 앞)", () => {
    for (const item of REGISTRATIONS) {
      expect(item.statHistList.at(0)?.statNm, item.rqstNo).toBe(item.statNm);
      expect(item.statHistList.at(-1)?.statNm, item.rqstNo).toBe("등기의뢰");
    }
  });

  it("코드 값은 공통 코드표에 있다", () => {
    const has = (group: string, code: string) => COMMON_CODES[group].some((c) => c.code === code);
    for (const item of REGISTRATIONS) {
      expect(has("REALE_CD", item.realeCd), item.rqstNo).toBe(true);
      if (item.judtCourtCd) expect(has("JUDT_COURT_CD", item.judtCourtCd), item.rqstNo).toBe(true);
      if (item.regrCd) expect(has("REGR_CD", item.regrCd), item.rqstNo).toBe(true);
    }
  });

  it("의뢰목록 탭은 모든 진행상태를 빠짐없이, 겹치지 않게 나눈다", () => {
    const statuses = Object.values(REQUEST_TAB_STATUS).flat();
    expect(new Set(statuses).size).toBe(statuses.length);
    expect([...statuses].sort()).toEqual(PROC_STAT_CODE_LIST.map((c) => c.code).sort());
  });

  it("데모 화면을 위해 모든 진행상태가 1건 이상 있다", () => {
    for (const { code, codeNm } of PROC_STAT_CODE_LIST) {
      expect(
        REGISTRATIONS.some((item) => item.statCd === code),
        codeNm,
      ).toBe(true);
    }
  });
});

describe("공지사항 목업 데이터 (NOTICES)", async () => {
  const { NOTICES } = await loadData();

  it("번호가 중복되지 않고, 날짜 형식이 맞다", () => {
    expect(new Set(NOTICES.map((notice) => notice.seq)).size).toBe(NOTICES.length);
    NOTICES.forEach((notice) => expect(notice.chgDtm).toMatch(DATE));
  });

  it("최근 공지가 앞에 온다", () => {
    const dates = NOTICES.map((notice) => notice.chgDtm);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("데모 중 데이터 변경", () => {
  it("changeStatus는 상태 이름을 맞추고 진행 이력 맨 앞에 추가한다", async () => {
    const { REGISTRATIONS, changeStatus } = await loadData();
    const target = REGISTRATIONS.find((item) => item.statCd === PROC_STAT_CD.REVIEWING)!;
    const historyLength = target.statHistList.length;

    changeStatus(target, PROC_STAT_CD.COMPLET);

    expect(target).toMatchObject({ statCd: PROC_STAT_CD.COMPLET, statNm: "접수완료" });
    expect(target.statHistList).toHaveLength(historyLength + 1);
    expect(target.statHistList[0].statNm).toBe("접수완료");
  });

  it("createRegistration으로 만든 새 의뢰도 같은 규칙을 지킨다", async () => {
    const { REGISTRATIONS, createRegistration } = await loadData();
    const created = createRegistration({ rqstNo: "DEMO-009999", dbtrNm: "새 채무자" });

    expect(REGISTRATIONS[0]).toBe(created);
    expect(created).toMatchObject({
      statCd: PROC_STAT_CD.REQUEST,
      statNm: "등기의뢰",
      lgagMembNm: "",
      acptNo: "",
      judtCourtNm: "",
      regrNm: "",
      rgstrAcptYn: "N",
    });
    expect(created.crtDtm).toMatch(DATE);
    expect(created.statHistList.map((history) => history.statNm)).toEqual(["등기의뢰"]);
  });
});
