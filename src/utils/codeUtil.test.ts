import { describe, expect, it } from "vitest";

import { getBankOptions, getCodeList, getMemberOptions } from "./codeUtil";

describe("선택 상자 옵션 변환", () => {
  it("getCodeList: 공통 코드 → { value: code, label: codeNm }", () => {
    expect(getCodeList([{ code: "00", codeNm: "아파트" }])).toEqual([
      { value: "00", label: "아파트" },
    ]);
  });

  it("getMemberOptions: 회원 → { value: membNo, label: membNm }", () => {
    expect(getMemberOptions([{ membNo: "LAW1", membNm: "데모 법무법인" }])).toEqual([
      { value: "LAW1", label: "데모 법무법인" },
    ]);
  });

  it("getBankOptions: 금융기관 → { value: bizNo, label: bizNm }", () => {
    expect(getBankOptions([{ bizNo: "000-00-00001", bizNm: "데모 금융기관" }])).toEqual([
      { value: "000-00-00001", label: "데모 금융기관" },
    ]);
  });

  // 조회 전이거나 응답 형식이 다를 때 화면이 깨지지 않도록 빈 목록을 돌려줌
  it.each([undefined, null, {}, "오류"])("목록이 아니면(%o) 빈 배열", (data) => {
    expect(getMemberOptions(data)).toEqual([]);
    expect(getBankOptions(data)).toEqual([]);
  });

  it.each([undefined, null])("getCodeList는 %o이면 빈 배열", (data) => {
    expect(getCodeList(data)).toEqual([]);
  });
});
