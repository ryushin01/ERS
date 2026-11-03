import { adminURI } from "@constants/env";
import { PAGE_LIMIT_ADMIN } from "@constants/page";
import { axiosBasicInstance } from "@services";
import { API_ADMIN_REGISTRATION } from "@constants/api-path";

/* 관리자 - 등기관리 목록 조회 */
export const getRegistrationListData = ({
  tabSelection = "",
  rqstNo = "",
  searchType = "EXEC",
  fromDate = "",
  toDate = "",
  sortOrder = "",
  page = 1,
  size = PAGE_LIMIT_ADMIN,
}: {
  tabSelection: string;
  rqstNo: string;
  searchType: string;
  fromDate: string;
  toDate: string;
  sortOrder: string;
  page: number;
  size: number;
}) =>
  axiosBasicInstance.get(
    `${API_ADMIN_REGISTRATION}/list?tabSelection=${tabSelection}&searchRqstNo=${rqstNo}&searchType=${searchType}&fromDate=${fromDate}&toDate=${toDate}&sortOrder=${sortOrder}&pageNum=${page}&pageSize=${size}`,
    { baseURL: adminURI },
  );

/* 관리자 - 등기관리 상세 조회 */
export const getRegistrationDetailData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_ADMIN_REGISTRATION}/detail?rqstno=${rqstno}`, {
    baseURL: adminURI,
  });

/* 관리자 - 등기자료 팝업 조회 */
export const getRegistrationData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_ADMIN_REGISTRATION}/data?rqstno=${rqstno}`, {
    baseURL: adminURI,
  });

/* 관리자 - 등기접수증 팝업 조회 */
export const getRegistrationAcceptData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_ADMIN_REGISTRATION}/accept?rqstno=${rqstno}`, {
    baseURL: adminURI,
  });

/* 관리자 - 등기접수등록 팝업 조회 */
export const getRegistrationInformationData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_ADMIN_REGISTRATION}/info?rqstno=${rqstno}`, {
    baseURL: adminURI,
  });

/* 관리자 - 접수정보 등록 */
export const postRegistrationAccept = (form: FormData) =>
  axiosBasicInstance.post(`${API_ADMIN_REGISTRATION}/accept`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    baseURL: adminURI,
  });

/* 관리자 - 등기접수증 승인 */
export const patchRegistrationApproval = (rqstNo: string) =>
  axiosBasicInstance.patch(
    `${API_ADMIN_REGISTRATION}/approval`,
    { rqstNo: rqstNo },
    {
      baseURL: adminURI,
    },
  );

/* 등기관리 - 등기 반려처리 진행 */
export const patchRegistrationReject = (form: {
  rqstNo: string;
  procRsnCnts: string;
}) =>
  axiosBasicInstance
    .patch(`${API_ADMIN_REGISTRATION}/reject`, form, { baseURL: adminURI })
    .then((response) => response.data);
