export function getCodeList(
  data: { grpCd: string; code: string; codeNm: string }[],
) {
  return data?.map((item) => ({
    value: item.code,
    label: item.codeNm,
  }));
}
