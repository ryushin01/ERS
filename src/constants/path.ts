// 금융기관
export const FI = "financial";

// 관리자
export const AD = "admin";

// 법무대리인
export const LA = "lawyer";

export const HOME = "home";

export const NOTICE = "notice";

export const REQUEST_LIST = "request-list";

export const REQUEST = "request";

export const STATUS_INQUIRY = "status-inquiry";

export const ASSIGN = "assign";

export const REGISTRATION = "registration";

export const CREATE = "create";

export const DETAIL = "detail";

export const MEMBER = "member";

export const ACCEPTANCE = "acceptance";

// 로그인
export const LOGIN_PATH = "/";

// 금융기관
export const FI_PATH = `/${FI}`;

// 금융기관 > 홈
export const FI_HOME = `/${FI}/${HOME}`;

// 금융기관 > 공지사항
export const FI_NOTICE = `/${FI}/${HOME}/${NOTICE}`;

// 금융기관 > 의뢰목록
export const FI_REQUEST_LIST = `/${FI}/${REQUEST_LIST}`;

// 금융기관 > 전자등기 의뢰
export const FI_REQUEST = `/${FI}/${REQUEST_LIST}/${REQUEST}`;

// 금융기관 > 현황조회
export const FI_STATUS_INQUIRY = `/${FI}/${STATUS_INQUIRY}`;

// 관리자
export const AD_PATH = `/${AD}`;

// 관리자 > 배정관리
export const AD_ASSIGN = `/${AD}/${ASSIGN}`;

// 관리자 > 배정관리 > 전자등기 신규등록
export const AD_ASSIGN_CREATE = `/${AD}/${ASSIGN}/${ASSIGN}-${CREATE}`;

// 관리자 > 배정관리 > 배정
export const AD_ASSIGN_DETAIL = `/${AD}/${ASSIGN}/${ASSIGN}-${DETAIL}`;

// 관리자 > 등기관리
export const AD_REGISTRATION = `/${AD}/${REGISTRATION}`;

// 관리자 > 등기관리 > 등기관리 상세
export const AD_REGISTRATION_DETAIL = `/${AD}/${REGISTRATION}/${REGISTRATION}-${DETAIL}`;

// 관리자 > 등기관리 > 승인
export const AD_REGISTRATION_ACCEPTANCE = `/${AD}/${REGISTRATION}/${REGISTRATION}-${ACCEPTANCE}`;

// 관리자 > 회원관리
export const AD_MEMBER = `/${AD}/${MEMBER}`;

// 관리자 > 공지관리
export const AD_NOTICE = `/${AD}/${NOTICE}`;

// 법무대리인
export const LA_PATH = `/${LA}`;