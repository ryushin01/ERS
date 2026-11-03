import { PROC_STAT_CD } from "@constants/code";

/**
 * 데모 모드용 목업 데이터
 * - 모든 이름·주소·연락처·번호는 가상의 값입니다.
 * - 날짜는 오늘을 기준으로 생성하여 "오늘 실행 건수" 등이 항상 의미 있게 보이도록 합니다.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/* 오늘 기준 offset일 후의 날짜 (YYYY-MM-DD) */
export const dateFromToday = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const PROC_STAT_CODE_LIST = [
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.REQUEST, codeNm: "등기의뢰" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.SUPPLEMENT, codeNm: "보완필요" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.MATCH, codeNm: "배정완료" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.EXECUTION, codeNm: "대출실행" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.REVIEWING, codeNm: "접수검토중" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.RETURN, codeNm: "접수반려" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.COMPLET, codeNm: "접수완료" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.CANCEL, codeNm: "진행취소" },
  { grpCd: "PROC_STAT_CD", code: PROC_STAT_CD.HOLD, codeNm: "진행보류" },
];

const statNm = (statCd: string) =>
  PROC_STAT_CODE_LIST.find((item) => item.code === statCd)?.codeNm ?? "";

const DEBTORS = [
  "김민준", "이서연", "박도윤", "최하은", "정시우", "강지아",
  "조예준", "윤수아", "장주원", "임채원", "한지호", "오다은",
];

/* 상세주소는 동·호 번호만 저장 (화면에서 "동", "호"를 붙여 표시) */
const ADDRESSES = [
  { rdnmAddr: "서울특별시 중구 예시로 12", lotnumAddr: "서울특별시 중구 예시동 101-1", bldg: "101", unit: "1201" },
  { rdnmAddr: "서울특별시 성북구 샘플로 34", lotnumAddr: "서울특별시 성북구 샘플동 22-3", bldg: "103", unit: "804" },
  { rdnmAddr: "경기도 성남시 분당구 데모로 56", lotnumAddr: "경기도 성남시 분당구 데모동 7", bldg: "", unit: "1502" },
  { rdnmAddr: "인천광역시 연수구 가상로 78", lotnumAddr: "인천광역시 연수구 가상동 45-6", bldg: "", unit: "305" },
];

/* 상태 분포: 의뢰 목록의 4개 탭과 현황조회 필터가 모두 채워지도록 구성 */
const STATUS_SEQUENCE = [
  PROC_STAT_CD.REQUEST, PROC_STAT_CD.SUPPLEMENT, PROC_STAT_CD.MATCH, PROC_STAT_CD.EXECUTION,
  PROC_STAT_CD.REVIEWING, PROC_STAT_CD.COMPLET, PROC_STAT_CD.RETURN, PROC_STAT_CD.COMPLET,
  PROC_STAT_CD.HOLD, PROC_STAT_CD.CANCEL, PROC_STAT_CD.REQUEST, PROC_STAT_CD.MATCH,
  PROC_STAT_CD.EXECUTION, PROC_STAT_CD.COMPLET, PROC_STAT_CD.REVIEWING, PROC_STAT_CD.REQUEST,
  PROC_STAT_CD.COMPLET, PROC_STAT_CD.MATCH, PROC_STAT_CD.SUPPLEMENT, PROC_STAT_CD.COMPLET,
  PROC_STAT_CD.EXECUTION, PROC_STAT_CD.HOLD, PROC_STAT_CD.COMPLET, PROC_STAT_CD.MATCH,
];

export type MockRegistration = {
  rqstNo: string;
  statCd: string;
  statNm: string;
  crtDtm: string;
  execDt: string;
  seDt: string;
  acptNo: string;
  dbtrNm: string;
  bndMaxAmt: number;
  lgagMembNm: string;
  lgagMembHpno: string;
  mngrMembNm: string;
  mngrMembHpno: string;
  judtCourtNm: string;
  regrNm: string;
  procRsnCnts: string;
  rdnmAddr: string;
  lotnumAddr: string;
  bldg: string;
  unit: string;
};

const HAS_LAWYER = (statCd: string) => statCd >= PROC_STAT_CD.MATCH;
const HAS_RECEIPT = (statCd: string) =>
  ([PROC_STAT_CD.REVIEWING, PROC_STAT_CD.RETURN, PROC_STAT_CD.COMPLET] as string[]).includes(statCd);

export const REGISTRATIONS: MockRegistration[] = STATUS_SEQUENCE.map((statCd, i) => {
  const address = ADDRESSES[i % ADDRESSES.length];
  // 최근 의뢰가 앞에 오도록 i가 클수록 과거 날짜
  const crtOffset = -Math.floor(i * 1.5);
  // 앞쪽 일부 건은 대출 실행일을 오늘로 두어 홈의 "오늘 실행 건수"를 채움
  const execOffset = i < 3 ? 0 : crtOffset + 3;

  return {
    rqstNo: `DEMO-${String(2400 - i).padStart(6, "0")}`,
    statCd,
    statNm: statNm(statCd),
    crtDtm: dateFromToday(crtOffset),
    execDt: dateFromToday(execOffset),
    seDt: dateFromToday(crtOffset - 1),
    acptNo: HAS_RECEIPT(statCd) ? `${10000 + i * 37}` : "",
    dbtrNm: DEBTORS[i % DEBTORS.length],
    bndMaxAmt: (12 + (i % 7) * 3) * 10_000_000,
    lgagMembNm: HAS_LAWYER(statCd) ? "데모 법무법인" : "",
    lgagMembHpno: HAS_LAWYER(statCd) ? "010-0000-0000" : "",
    mngrMembNm: "데모 담당자",
    mngrMembHpno: "02-000-0000",
    judtCourtNm: "서울중앙지방법원",
    regrNm: "중부등기소",
    procRsnCnts:
      statCd === PROC_STAT_CD.SUPPLEMENT
        ? "등기자료 이미지가 흐릿합니다. 계약서 전체 페이지를 다시 촬영하여 제출해 주세요."
        : "",
    ...address,
  };
});

/* 의뢰목록 탭 (00:미배정, 01:배정완료, 02:진행보류, 03:진행취소) */
export const REQUEST_TAB_STATUS: Record<string, string[]> = {
  "00": [PROC_STAT_CD.REQUEST, PROC_STAT_CD.SUPPLEMENT],
  "01": [PROC_STAT_CD.MATCH, PROC_STAT_CD.EXECUTION, PROC_STAT_CD.REVIEWING, PROC_STAT_CD.RETURN, PROC_STAT_CD.COMPLET],
  "02": [PROC_STAT_CD.HOLD],
  "03": [PROC_STAT_CD.CANCEL],
};

export const NOTICES = [
  {
    title: "[긴급] 등기소 전산 점검에 따른 접수 지연 안내",
    contents: "등기소 전산 점검으로 인해 금일 18시 이후 접수 건은 익영업일에 처리됩니다.\n이용에 참고 부탁드립니다.",
    emcyYn: true,
    offset: 0,
  },
  {
    title: "전자등기 의뢰 시 등기자료 촬영 가이드",
    contents: "계약서는 모든 페이지가 선명하게 보이도록 촬영해 주세요.\n빛 반사와 그림자가 생기지 않도록 주의해 주세요.",
    emcyYn: false,
    offset: -2,
  },
  {
    title: "개인정보 처리방침 개정 안내",
    contents: "개인정보 처리방침이 개정되어 안내드립니다. 자세한 내용은 첨부파일을 확인해 주세요.",
    emcyYn: false,
    offset: -6,
    hasFile: true,
  },
  {
    title: "설 연휴 고객센터 운영 안내",
    contents: "연휴 기간에는 고객센터 운영이 중단됩니다. 긴급 문의는 이메일로 남겨 주세요.",
    emcyYn: false,
    offset: -15,
  },
  {
    title: "전자등기 관리 시스템 서비스 오픈 안내",
    contents: "전자등기 관리 시스템이 오픈되었습니다. 많은 이용 부탁드립니다.",
    emcyYn: false,
    offset: -30,
  },
].map((notice, i) => ({
  seq: `N${i + 1}`,
  num: i + 1,
  boardTitle: notice.title,
  boardContents: notice.contents,
  emcyYn: notice.emcyYn,
  writerNm: "관리자",
  chgDtm: dateFromToday(notice.offset),
  fileInfoList: notice.hasFile
    ? [{ seq: `N${i + 1}`, filIdx: 1, attcFilNm: "개인정보처리방침_개정안.txt", fileSize: "1KB" }]
    : [],
}));

/* 등기자료/등기접수증 미리보기 이미지 (가상의 문서 형태 SVG) */
export const createDocumentSvg = (title: string, requestNo: string, page: number) => `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840">
  <rect width="600" height="840" fill="#ffffff"/>
  <rect x="24" y="24" width="552" height="792" fill="none" stroke="#d4d4d4" stroke-width="2"/>
  <text x="300" y="110" font-size="34" font-weight="700" text-anchor="middle" fill="#113662" font-family="sans-serif">${title}</text>
  <text x="300" y="155" font-size="18" text-anchor="middle" fill="#767676" font-family="sans-serif">의뢰번호 ${requestNo} · ${page}페이지</text>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="70" y="${210 + i * 36}" width="${460 - (i % 3) * 70}" height="12" rx="6" fill="#ededed"/>`).join("")}
  <text x="300" y="760" font-size="20" text-anchor="middle" fill="#bdbdbd" font-family="sans-serif">SAMPLE · 포트폴리오 데모용 가상 문서</text>
</svg>`;
