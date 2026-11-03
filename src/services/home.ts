import { adminURI } from "@/constants/env";
import {
  API_CLIENT_HOME,
  API_AUTH,
  API_CLIENT_REGISTRATION,
  API_ADMIN_REGISTRATION,
} from "@constants/api-path";
import { axiosBasicInstance } from "@services";

/* 프로필조회 */
export const getProfileData = () =>
  axiosBasicInstance(`${API_AUTH}/profile`).then((response) => response.data);

/* 실시간배정현황 */
export const getStatisticsData = () =>
  axiosBasicInstance(`${API_CLIENT_HOME}/statistics`).then(
    (response) => response.data,
  );

/* 실시간등기현황조회 */
export const getRegistrationListData = () =>
  axiosBasicInstance(`${API_CLIENT_HOME}/registration-list`).then(
    (response) => response.data,
  );

/* 실시간공지사항조회 */
export const getHomeNoticeListData = () =>
  axiosBasicInstance(`${API_CLIENT_HOME}/board-list`).then(
    (response) => response.data,
  );

/* 공지사항리스트조회 */
export const getNoticeBoardList = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) =>
  axiosBasicInstance.get(
    `/api/client/board/list?pageNum=${page}&pageSize=${size}`,
  );

/* 금융기관 - 의뢰번호 조회 */
export const getSearchBankRgstData = (rqstno: string) =>
  axiosBasicInstance(`${API_CLIENT_REGISTRATION}/search?rqstno=${rqstno}`).then(
    (response) => response.data,
  );

/* 관리자 - 의뢰번호 조회 */
export const getSearchAdminRgstData = (rqstno: string) =>
  axiosBasicInstance(`${API_ADMIN_REGISTRATION}/search?rqstno=${rqstno}`, {
    baseURL: adminURI,
  }).then((response) => response.data);
