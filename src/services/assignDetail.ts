import { adminURI, apiURI } from "@constants/env";
import {
  API_ADMIN_REGISTRATION,
  API_ADMIN_MATCH,
  API_API_IROS,
} from "@constants/api-path";
import { axiosBasicInstance } from "@services";

/* 배정관리 - 회원 구분에 따른 회원목록 조회 */
export const getMemberListData = (membGbNo: string) =>
  axiosBasicInstance(`${API_ADMIN_MATCH}/members/${membGbNo}`, {
    baseURL: adminURI,
  }).then((response) => response.data);

/* 배정관리 - 등기 보완요청 진행 */
export const patchRegiSupplement = (form: {
  rqstNo: string;
  procRsnCnts: string;
}) =>
  axiosBasicInstance
    .patch(`${API_ADMIN_REGISTRATION}/supplementation`, form, {
      baseURL: adminURI,
    })
    .then((response) => response.data);

/* 배정관리 - 등기 진행취소 진행 */
export const patchRegiCancel = (form: {
  rqstNo: string;
  procRsnCnts: string;
}) =>
  axiosBasicInstance
    .patch(`${API_ADMIN_REGISTRATION}/cancel`, form, { baseURL: adminURI })
    .then((response) => response.data);

/* 배정관리 - 등기자료 배정하기(수정) */
// export const patchAccignmentForm = (form: FormData) =>
//   axiosAdminInstance.post(`${API_ADMIN_MATCH}`, form);

export const patchAccignmentForm = (form: FormData) =>
  axiosBasicInstance.patch(`${API_ADMIN_MATCH}`, form, {
    baseURL: adminURI,
    // headers: { "Content-Type": "multipart/form-data" },
  });

/* 등기관리 - 등기 반려 진행 */
export const patchRegiReject = (form: {
  rqstNo: string;
  procRsnCnts: string;
}) =>
  axiosBasicInstance
    .patch(`${API_ADMIN_REGISTRATION}/reject`, form, { baseURL: adminURI })
    .then((response) => response.data);

/* 인터넷등기소 - 등기고유번호 조회 */
export const getUnqRgsrtNo = ({
  rdnmAddr,
  lotnumAddrCd,
  bldg,
  unit,
}: {
  rdnmAddr: string;
  lotnumAddrCd: string;
  bldg: string;
  unit: string;
}) =>
  axiosBasicInstance(
    `${API_API_IROS}/unqrgstrno?rdnmAddr=${rdnmAddr}&lotnumAddrCd=${lotnumAddrCd}&bldg=${bldg}&unit=${unit}`,
    { baseURL: apiURI },
  ).then((response) => response.data);
