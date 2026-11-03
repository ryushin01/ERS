import { PAGE_LIMIT_PC } from "@constants/page";
import { axiosBasicInstance } from "@services";
import {
  API_CLIENT_REQUEST,
  API_CLIENT_REGISTRATION,
} from "@constants/api-path";

/* 금융기관 - 전자등기 의뢰목록 조회 */
export const getRequestListData = ({
  tabSelection = "00",
  page = 1,
  size = PAGE_LIMIT_PC,
}: {
  tabSelection: string;
  page: number;
  size: number;
}) =>
  axiosBasicInstance.get(
    `${API_CLIENT_REQUEST}/list?tabSelection=${tabSelection}&pageNum=${page}&pageSize=${size}`,
  );

/* 금융기관 - 등기자료(보완필요) 팝업 조회 */
export const getRequestInfoData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_CLIENT_REQUEST}/info?rqstno=${rqstno}`);

/* 금융기관 - 등기자료 진행보류 처리 */
export const patchRegistrationHold = (rqstNo: string) =>
  axiosBasicInstance.patch(`${API_CLIENT_REGISTRATION}/hold`, {
    rqstNo,
  });

/* 금융기관 - 등기자료 팝업 조회 */
export const getRegistrationInfoData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_CLIENT_REGISTRATION}/data?rqstno=${rqstno}`);

/* 금융기관 - 등기접수증 팝업 조회 */
export const getRegistrationAcceptData = (rqstno: string) =>
  axiosBasicInstance.get(`${API_CLIENT_REGISTRATION}/accept?rqstno=${rqstno}`);

/* 금융기관 - 파일 업로드 및 제출하기 */
export const postRequestData = (form: FormData) =>
  axiosBasicInstance.post(`${API_CLIENT_REQUEST}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* 금융기관 - 등기자료 수정 */
export const patchRequestData = (form: FormData) =>
  axiosBasicInstance.patch(`${API_CLIENT_REQUEST}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
