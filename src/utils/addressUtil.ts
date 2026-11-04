import type { Address } from "react-daum-postcode";

/**
 * 담보목적물 주소 입력값 (전자등기 신규 등록·배정 상세 공통)
 *
 * 필드 이름 주의: API 요청 필드명에 맞춰 둔 이름이라 의미와 다릅니다.
 * - roadAddr: **지번** 주소 (요청 시 lotnumAddr로 전송)
 * - rdnmAddr: **도로명** 주소 (건물명 포함)
 */
export type AddressForm = {
  roadAddr: string;
  rdnmAddr: string;
  /* 상세주소 유형 01: 동+호, 02: 동, 03: 호, 04: 없음 */
  lotnumAddrCd: string;
  bldg: string;
  unit: string;
};

/**
 * @name toAddressFields
 * @description 우편번호 검색 결과를 주소 입력값으로 바꿉니다.
 *              도로명 주소에는 건물명을 괄호로 붙이고, 지번 주소는 자동 지번(autoJibunAddress)이 있으면 그것을 씁니다.
 */
export function toAddressFields(
  data: Pick<Address, "roadAddress" | "buildingName" | "jibunAddress" | "autoJibunAddress">,
): Pick<AddressForm, "roadAddr" | "rdnmAddr"> {
  return {
    rdnmAddr: `${data.roadAddress} (${data.buildingName ?? ""})`,
    roadAddr: data.autoJibunAddress || data.jibunAddress,
  };
}

/**
 * @name isAddressFormComplete
 * @description 상세주소 유형(lotnumAddrCd)에 따라 필요한 주소 입력값이 모두 채워졌는지 확인합니다.
 *              - 01(동+호): 모든 값 / 02(동): 지번·도로명·동 / 03(호): 지번·도로명·호 / 04(없음): 지번·도로명
 */
export function isAddressFormComplete(addrForm: AddressForm) {
  const hasAddress = addrForm.roadAddr !== "" && addrForm.rdnmAddr !== "";

  switch (addrForm.lotnumAddrCd) {
    case "01":
      return Object.values(addrForm).every((value) => value !== "");
    case "02":
      return hasAddress && addrForm.bldg !== "";
    case "03":
      return hasAddress && addrForm.unit !== "";
    case "04":
      return hasAddress;
    default:
      return false;
  }
}
