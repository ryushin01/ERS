import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { ImageWithAuth } from "@components/common";
import { appURI } from "@constants/env";
import { CancelWhiteIcon } from "@icons14";

import { FileProps } from "./MobileFileUploader";

type MobileFileListItemProps = {
  imageList: FileProps[];
  setImageList: Dispatch<SetStateAction<FileProps[]>>;
  fileList: File[];
  setFileList: Dispatch<SetStateAction<File[]>>;
  setIsExistingImageList: Dispatch<SetStateAction<FileProps[]>>;
};

export default function MobileFileListItem({
  imageList,
  setImageList,
  fileList,
  setFileList,
  setIsExistingImageList,
}: MobileFileListItemProps) {
  const handleFileDelete = (image: FileProps) => {
    if (image.seq) {
      // 서버 이미지: 유지할 서버 이미지 목록에서만 뺌 (서버로 보낼 새 파일과는 무관)
      setIsExistingImageList((prev) => prev?.filter((item) => item.attcFilNm !== image.attcFilNm));
    } else {
      // 새 이미지: fileList는 새 이미지 순서대로 쌓이므로, 서버 이미지를 뺀 순번으로 같은 파일을 찾아 뺌
      const fileIndex = imageList.filter((item) => !item.seq).indexOf(image);
      setFileList(fileList.filter((_, index) => index !== fileIndex));
    }

    setImageList((prev) => prev?.filter((item) => item.uid !== image.uid));
  };

  return (
    <>
      {imageList?.map((image: FileProps, index: number) => {
        return (
          <li key={image.uid}>
            {image.seq ? (
              <ImageWithAuth
                src={`${appURI}/api${image.src!}`}
                alt={`임시 업로드 ${index + 1}번 이미지`}
                width={100}
                height={100}
              />
            ) : (
              <Image
                src={image.src!}
                alt={`임시 업로드 ${index + 1}번 이미지`}
                width={100}
                height={100}
                unoptimized={true}
              />
            )}
            <button
              type="button"
              aria-label="해당 이미지 삭제"
              onClick={() => {
                handleFileDelete(image);
              }}
              className="_delete-single-file-button"
            >
              <span>
                <Image src={CancelWhiteIcon} alt="" width={14} height={14} />
              </span>
            </button>
          </li>
        );
      })}
    </>
  );
}
