import { API_COMM_CODE, API_CLIENT_REGISTRATION } from "@constants/api-path";
import { axiosBasicInstance } from "@services";

/* 등기현황 진행상태 조회 */
export const getStatusCdData = () =>
  axiosBasicInstance(`${API_COMM_CODE}/PROC_STAT_CD`).then(
    (response) => response.data,
  );

/* 등기현황 리스트 조회 */
export const getStasusListData = ({
  page,
  size,
  rqstNo,
  statCd,
  acptNo,
  searchType,
  fromDate,
  toDate,
  dbtrNm,
}: {
  page: number;
  size: number;
  rqstNo: string;
  statCd: string;
  acptNo: string;
  searchType: string;
  fromDate: string;
  toDate: string;
  dbtrNm: string;
}) =>
  axiosBasicInstance(
    `${API_CLIENT_REGISTRATION}/list?pageNum=${page}&pageSize=${size}&rqstNo=${rqstNo}&statCd=${statCd}&acptNo=${acptNo}&searchType=${searchType}&fromDate=${fromDate}&toDate=${toDate}&dbtrNm=${dbtrNm}`,
  ).then((response) => response.data);
