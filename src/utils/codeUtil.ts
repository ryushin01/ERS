/* 선택 상자(Select) 옵션 */
export type SelectOption = { value: string; label: string };

/**
 * @name getCodeList
 * @description 공통 코드 목록을 선택 상자 옵션으로 바꿉니다. (value: code, label: codeNm)
 *              목록이 없으면(조회 전 등) 빈 배열을 돌려줍니다.
 */
export function getCodeList(
  data: { code: string; codeNm: string }[] | null | undefined,
): SelectOption[] {
  return (data ?? []).map((item) => ({
    value: item.code,
    label: item.codeNm,
  }));
}

/**
 * @name getMemberOptions
 * @description 회원 목록(법무대리인 등)을 선택 상자 옵션으로 바꿉니다. (value: membNo, label: membNm)
 */
export function getMemberOptions(data: unknown): SelectOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item: { membNo: string; membNm: string }) => ({
    value: item.membNo,
    label: item.membNm,
  }));
}

/**
 * @name getBankOptions
 * @description 금융기관(채권자) 목록을 선택 상자 옵션으로 바꿉니다. (value: bizNo, label: bizNm)
 */
export function getBankOptions(data: unknown): SelectOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item: { bizNo: string; bizNm: string }) => ({
    value: item.bizNo,
    label: item.bizNm,
  }));
}
