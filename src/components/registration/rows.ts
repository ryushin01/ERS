import { getDetailAddress, getManagerInfo } from "@utils/stringUtil";

import type { InfoRow } from "@components/common/InfoTableSection";

/* 등기자료·등기접수증 상세 API 응답 중 화면에서 사용하는 필드 */
export type RegistrationDetailData = {
  lotnumAddr?: string;
  rdnmAddr?: string;
  bldg?: string;
  unit?: string;
  dbtrNm?: string;
  seDt?: string;
  execDt?: string;
  bndMaxAmt?: number;
  judtCourtNm?: string;
  regrNm?: string;
  acptNo?: string;
  bndMembNm?: string;
  bndMembHpno?: string;
  lgagMembNm?: string;
  lgagMembHpno?: string;
  mngrMembNm?: string;
  mngrMembHpno?: string;
  lgagDlvrCnts?: string;
  mngrDlvrCnts?: string;
};

/* 금융기관 화면은 담당자 정보에서 금융기관·전달사항을 제외 */
export type DetailVariant = "financial" | "admin";

/* 담보목적물 주소 */
export const getAddressRows = (data?: RegistrationDetailData): InfoRow[] => [
  { label: "지번", value: data?.lotnumAddr || "-" },
  { label: "도로명", value: data?.rdnmAddr || "-" },
  { label: "상세주소", value: getDetailAddress(data?.bldg, data?.unit) },
];

/* 담당자 정보 (관리자 화면은 금융기관을 맨 앞에, 전달사항을 맨 뒤에 추가) */
export const getManagerRows = (
  data: RegistrationDetailData | undefined,
  variant: DetailVariant,
  deliveryContents?: string,
): InfoRow[] => [
  ...(variant === "admin"
    ? [{ label: "금융기관", value: getManagerInfo(data?.bndMembNm, data?.bndMembHpno) }]
    : []),
  { label: "법무대리인", value: getManagerInfo(data?.lgagMembNm, data?.lgagMembHpno) },
  { label: "시스템 관리자", value: getManagerInfo(data?.mngrMembNm, data?.mngrMembHpno) },
  ...(variant === "admin" ? [{ label: "전달사항", value: deliveryContents }] : []),
];
