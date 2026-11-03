import { adminURI } from "@/constants/env";
import { API_ADMIN_MATCH, API_COMM_SEQUENCE } from "@constants/api-path";
import { axiosBasicInstance } from "@services";

/* 배정관리 목록 조회 */
export const getSupplimentListData = ({
  searchRqstNo,
  tabSelection,
  sortOrder,
  pageNum,
  pageSize,
}: {
  searchRqstNo: string;
  tabSelection: string;
  sortOrder: string;
  pageNum: number;
  pageSize: number;
}) =>
  axiosBasicInstance(
    `${API_ADMIN_MATCH}/list?searchRqstNo=${searchRqstNo}&tabSelection=${tabSelection}&sortOrder=${sortOrder}&pageNum=${pageNum}&pageSize=${pageSize}`,
    { baseURL: adminURI },
  ).then((response) => response.data);

/* 배정 등록정보 조회 */
export const getSupplimentData = (rqstNo: string) =>
  axiosBasicInstance(`${API_ADMIN_MATCH}/${rqstNo}`, {
    baseURL: adminURI,
  }).then((response) => response.data);

// 전자등기 신규등록 > 의뢰번호 조회
export const getRqstNoData = () =>
  axiosBasicInstance(`${API_COMM_SEQUENCE}?sequence=RQST_NO`).then(
    (response) => response.data,
  );

// 배정 신규등록
export const postCreateAssign = (form: FormData) =>
  axiosBasicInstance.post(`${API_ADMIN_MATCH}`, form, {
    baseURL: adminURI,
    headers: { "Content-Type": "multipart/form-data" },
  });

// axiosBasicInstance.post(`${API_ADMIN_MATCH}`, form, {
//   baseURL: adminURI,
//   headers: { "Content-Type": "multipart/form-data" },
// });

// export const postCreateAssign = (form: FormData) =>
//   axiosBasicInstance.post(`${API_ADMIN_MATCH}`, form, {
//     baseURL: adminURI,
//     headers: { "Content-Type": "multipart/form-data" },
//   });
