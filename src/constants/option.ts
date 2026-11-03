// 필터 테이블 > 기간 선택
export const PERIOD_OPTION = [
  {
    value: "EXEC",
    label: "대출실행일",
  },
  {
    value: "RQST",
    label: "의뢰일",
  },
];

export const PERIOD_EXPANDED_OPTION = [
  {
    value: "EXEC",
    label: "대출실행일",
  },
  {
    value: "RQST",
    label: "의뢰일",
  },
  {
    value: "STEF",
    label: "설정약정일",
  },
];

export const PERIOD_SORT_OPTION = [
  {
    value: "00",
    label: "의뢰일 순",
  },
  {
    value: "01",
    label: "대출실행일 순",
  },
];

export const NUMERIC_SORT_OPTION = [
  {
    value: "50",
    label: "50개씩 보기",
  },
  {
    value: "100",
    label: "100개씩 보기",
  },
];

export const BANK_LIST_OPTION = [
  {
    value: "bank-list-option-1",
    label: "우리은행",
  },
  {
    value: "bank-list-option-2",
    label: "신한은행",
  },
];

export const REAL_ESTATE_OPTION = [
  {
    value: "real-estate-option-1",
    label: "전체",
  },
  {
    value: "real-estate-option-2",
    label: "집합건물",
  },
  {
    value: "real-estate-option-3",
    label: "토지",
  },
  {
    value: "real-estate-option-4",
    label: "건물",
  },
];

export const LAND_LOT_OPTION = [
  {
    id: "lotnumAddrCd01",
    name: "lotnumAddrCd",
    value: "01",
    labelText: "동+호",
    disabled: false,
  },
  {
    id: "lotnumAddrCd02",
    name: "lotnumAddrCd",
    value: "02",
    labelText: "동",
    disabled: false,
  },
  {
    id: "lotnumAddrCd03",
    name: "lotnumAddrCd",
    value: "03",
    labelText: "호",
    disabled: false,
  },
  {
    id: "lotnumAddrCd04",
    name: "lotnumAddrCd",
    value: "04",
    labelText: "없음",
    disabled: false,
  },
];

export const LAWYER_LIST_OPTION = [
  {
    value: "lawyer-list-option-1",
    label: "류창선 1",
  },
  {
    value: "lawyer-list-option-2",
    label: "류창선 2",
  },
];

export const SUPPLEMENT_REQUEST_OPTION = [
  {
    value: "supplement-request-option-1",
    label:
      "등록된 이미지가 깨져 확인이 어렵습니다. 등기자료를 다시 등록해 주세요.",
  },
  {
    value: "supplement-request-option-2",
    label:
      "전체 페이지가 모두 등록되지 않았습니다. 등기자료를 다시 등록해 주세요.",
  },
  {
    value: "supplement-request-option-3",
    label:
      "설정계약서가 아닌 다른 서류가 등록되었습니다. 등기자료를 다시 등록해 주세요.",
  },
  {
    value: "supplement-request-option-4",
    label: "대출 실행을 다시 확인해 주세요.",
  },
  {
    value: "supplement-request-option-5",
    label: "기타",
  },
];

export const CANCEL_PROGRESS_OPTION = [
  {
    value: "cancel-progress-option-1",
    label:
      "등록된 이미지가 깨져 확인이 어렵습니다. 등기접수증을 다시 등록해 주세요.",
  },
  {
    value: "cancel-progress-option-2",
    label:
      "등기신청사건의 처리현황이 조회되지 않습니다. 등기접수증과 접수정보를 다시 확인해 주세요.",
  },
  {
    value: "cancel-progress-option-3",
    label: "기타",
  },
];

export const COURT_OPTION = [
  {
    value: "court-option-1",
    label: "관할법원 1",
  },
  {
    value: "court-option-2",
    label: "관할법원 2",
  },
  {
    value: "court-option-3",
    label: "관할법원 3",
  },
];

export const REGISTRY_OFFICE_OPTION = [
  {
    value: "registry-office-option-1",
    label: "등기소 1",
  },

  {
    value: "registry-office-option-2",
    label: "등기소 2",
  },

  {
    value: "registry-office-option-3",
    label: "등기소 3",
  },
];

export const REJECTION_OPTION = [
  {
    value: "rejection-option-1",
    label: "대출이 취소됨",
  },
  {
    value: "rejection-option-2",
    label: "다른 대출을 잘못 의뢰함",
  },
  {
    value: "rejection-option-3",
    label: "의뢰 내용이 변경되어 새롭게 의뢰할 예정임",
  },
  {
    value: "rejection-option-4",
    label: "시스템에 대한 불만족으로 취소 요청함",
  },
  {
    value: "rejection-option-5",
    label: "기타",
  },
];
