export const AUTH_LIST = [
  {
    id: 1,
    name: "membGbCd",
    value: "00",
    labelText: "금융기관",
    disabled: false,
  },
  {
    id: 2,
    name: "membGbCd",
    value: "10",
    labelText: "법무대리인",
    disabled: false,
  },
  {
    id: 3,
    name: "membGbCd",
    value: "20",
    labelText: "관리자",
    disabled: false,
  },
];

export const MEMB_GB_CD = {
  FINANCIAL: "00", // 금융기관
  LAWYER: "10", // 법무 대리인
  ADMIN: "20", // 관리자
} as const;

export type MembGbCd = (typeof MEMB_GB_CD)[keyof typeof MEMB_GB_CD];

/* 데모 모드 로그인 시 사용할 금융기관 사용자 정보 (토큰 없음) */
export const DEMO_FINANCIAL_AUTH = {
  lognYn: true,
  resCd: "00",
  membNo: "DEMO",
  membNm: "데모 금융기관",
  membGbCd: MEMB_GB_CD.FINANCIAL,
  membGbNm: "금융기관",
  membHpno: "",
  statCd: "",
  statNm: "",
  accessToken: "",
  refreshToken: "",
};
