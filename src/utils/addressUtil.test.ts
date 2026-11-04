import { describe, expect, it } from "vitest";

import { type AddressForm, isAddressFormComplete, toAddressFields } from "./addressUtil";

const filled: AddressForm = {
  roadAddr: "경기 성남시 분당구 삼평동 681",
  rdnmAddr: "경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)",
  lotnumAddrCd: "01",
  bldg: "101",
  unit: "1001",
};

describe("toAddressFields", () => {
  const postcode = {
    roadAddress: "경기 성남시 분당구 판교역로 235",
    buildingName: "에이치스퀘어 엔동",
    jibunAddress: "경기 성남시 분당구 삼평동 681",
    autoJibunAddress: "",
  };

  it("도로명 주소(rdnmAddr)에 건물명을 붙이고, 지번 주소는 roadAddr에 담는다", () => {
    expect(toAddressFields(postcode)).toEqual({
      rdnmAddr: "경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)",
      roadAddr: "경기 성남시 분당구 삼평동 681",
    });
  });

  it("자동 지번 주소가 있으면 그것을 쓴다", () => {
    expect(
      toAddressFields({ ...postcode, jibunAddress: "", autoJibunAddress: "자동 지번" }),
    ).toMatchObject({
      roadAddr: "자동 지번",
    });
  });
});

describe("isAddressFormComplete", () => {
  it.each([
    ["01", { bldg: "" }, false],
    ["01", { unit: "" }, false],
    ["01", {}, true],
    ["02", { unit: "" }, true],
    ["02", { bldg: "" }, false],
    ["03", { bldg: "" }, true],
    ["03", { unit: "" }, false],
    ["04", { bldg: "", unit: "" }, true],
  ])("상세주소 유형 %s, 변경 %o → %s", (lotnumAddrCd, override, expected) => {
    expect(isAddressFormComplete({ ...filled, lotnumAddrCd, ...override })).toBe(expected);
  });

  it("지번·도로명 주소가 없으면 어떤 유형이든 미완료", () => {
    for (const lotnumAddrCd of ["01", "02", "03", "04"]) {
      expect(isAddressFormComplete({ ...filled, lotnumAddrCd, rdnmAddr: "" })).toBe(false);
    }
  });

  it("알 수 없는 유형은 미완료", () => {
    expect(isAddressFormComplete({ ...filled, lotnumAddrCd: "" })).toBe(false);
  });
});
