/**
 * 금액(원) 입력 처리 유틸
 *
 * 규칙
 * - 원 단위 정수만 다룹니다. 입력에서 숫자가 아닌 문자(부호·소수점·공백 등)는 무시합니다.
 * - 최대 15자리까지 받습니다. (16자리부터는 JavaScript 숫자로 바꿀 때 정밀도를 잃을 수 있음)
 * - 빈 입력은 빈 문자열로 둡니다. 0원은 유효한 금액이 아닙니다(isValidAmount).
 */

export const MAX_AMOUNT_DIGITS = 15;

/* 숫자만 남기고, 앞의 0을 지우고, 최대 자릿수로 자름 */
const toDigits = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "")
    .slice(0, MAX_AMOUNT_DIGITS);

/**
 * @name formatAmountInput
 * @description 입력값을 천 단위 콤마가 있는 금액 문자열로 바꿉니다. (예: "1234567" → "1,234,567")
 *              로케일과 관계없이 항상 콤마를 씁니다.
 */
export function formatAmountInput(value: string) {
  return toDigits(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @name parseAmount
 * @description 금액 문자열(콤마 포함)을 숫자로 바꿉니다. 비어 있으면 0을 돌려줍니다.
 */
export function parseAmount(value: string) {
  const digits = toDigits(value);
  return digits === "" ? 0 : Number(digits);
}

/**
 * @name isValidAmount
 * @description 제출할 수 있는 금액인지 확인합니다. (1원 이상, 정밀도 손실이 없는 정수)
 */
export function isValidAmount(amount: number) {
  return Number.isSafeInteger(amount) && amount > 0;
}
