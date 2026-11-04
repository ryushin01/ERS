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

/* 사유 코드에서 "기타"(직접 입력)를 뜻하는 코드 */
export const ETC_REASON_CODE = "99";

/**
 * @name getReasonText
 * @description 사유 선택 상자에서 고른 값을 서버로 보낼 사유 문구로 바꿉니다.
 *              - 기타(99): 직접 입력한 문구 (앞뒤 공백 제거)
 *              - 그 외: 고른 코드의 이름
 *              선택하지 않았거나, 기타인데 입력이 비어 있거나, 목록에 없는 코드면 null을 돌려줍니다.
 */
export function getReasonText(code: string, options: SelectOption[], etcText: string) {
  if (!code) return null;
  if (code === ETC_REASON_CODE) return etcText.trim() || null;
  return options.find((option) => option.value === code)?.label ?? null;
}
