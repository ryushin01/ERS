/* 업로드/수정 화면의 파일 항목 (신규 파일은 uid·file, 서버 파일은 seq·filIdx 사용) */
export type FileData = {
  uid?: string;
  seq?: string;
  filIdx?: number;
  attcFilNm?: string;
  filSize?: number;
  src?: string;
  file?: File;
};

/* 서버에 이미 저장된 파일 항목 */
export type UpdateFileData = Omit<FileData, "uid" | "file">;

/* 이미지 조회 API(/api/files/images) 응답 항목 */
export type SwiperImage = {
  seq: string;
  filIdx: string;
  src: string;
  attcFilNm: string;
  filSize?: string;
};

/* 공지사항 첨부파일 항목 */
export type AttachedFile = {
  seq: string;
  filIdx: number;
  attcFilNm: string;
  fileSize: string;
};
