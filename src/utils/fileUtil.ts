import type { UploadFile } from "antd";

export const FILE_MAXIMUM_SIZE: number = 1024 ** 2 * 20;

export const checkUploadFileSize = (file: UploadFile) => {
  const size = file.size || 0;

  if (FILE_MAXIMUM_SIZE < size) {
    return false;
  }
  return true;
};

export const checkFileSize = (file: File) => {
  const size = file.size || 0;

  if (FILE_MAXIMUM_SIZE < size) {
    return false;
  }
  return true;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formatMegaBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const dm = decimals < 0 ? 0 : decimals;

  return parseFloat((bytes / 1024 / 1024).toFixed(dm)) + " MB";
};
