import { API_FILES } from "@constants/api-path";
import { axiosBasicInstance } from "@services";

export const getFileDownLoad = ({ seq, filidx }: { seq: string; filidx: string }) =>
  axiosBasicInstance.get(
    `${API_FILES}/download/${encodeURIComponent(seq)}/${encodeURIComponent(filidx)}`,
    {
      responseType: "blob", // blob 형식으로 응답 데이터 받기
    },
  );

/* 등기자료 이미지 조회 */
export const getRegistrationImages = (seq: string | null, attcFilCd: string) =>
  // seq가 없으면(null) 파라미터를 보내지 않음 (이전에는 문자열 "null"이 전달됨)
  axiosBasicInstance.get(`${API_FILES}/images`, { params: { seq: seq ?? undefined, attcFilCd } });
