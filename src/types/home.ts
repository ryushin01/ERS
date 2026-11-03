/* 금융기관 홈 - 통계 */
export type HomeStatistics = {
  cntExec: number;
  cntProg: number;
  cntComplete: number;
};

/* 금융기관 홈 - 실시간 등기현황 항목 */
export type HomeRegistration = {
  rqstNo: string;
  dbtrNm: string;
  lgagMembNm: string;
  statCdNm: string;
  acptNo: string;
};

/* 금융기관 홈 - 공지사항 항목 */
export type HomeNotice = {
  boardTitles: string;
  crtDtm: string;
  emcyYn: boolean;
};

export type HomeStatisticsResponse = {
  data: HomeStatistics;
};

export type HomeRegistrationListResponse = {
  data: {
    rgstrMasterList: HomeRegistration[];
  };
};

export type HomeNoticeListResponse = {
  data: {
    homeBoardListRes: HomeNotice[];
  };
};
