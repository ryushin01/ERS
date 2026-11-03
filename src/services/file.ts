import { axiosBasicInstance } from "@services";
import { API_FILES } from "@constants/api-path";

export const getFileDownLoad = ({
  seq,
  filidx,
}: {
  seq: string;
  filidx: string;
}) =>
  axiosBasicInstance.get(`${API_FILES}/download/${seq}/${filidx}`, {
    responseType: "blob", // blob 형식으로 응답 데이터 받기
  });

/* 등기자료 이미지 조회 */
export const getRegistrationImages = (seq: string | null, attcFilCd: string) =>
  axiosBasicInstance.get(
    `${API_FILES}/images?seq=${seq}&attcFilCd=${attcFilCd}`,
  );
