import { axiosBasicInstance } from "@services";
import { API_COMM_CODE } from "@constants/api-path";

/* 공통 코드 리스트 조회 */
export const getCommonCodeList = (groupCode: string) =>
  axiosBasicInstance.get(`${API_COMM_CODE}/${groupCode}`);
