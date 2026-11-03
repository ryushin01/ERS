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
  const handleFileDelete = (uid: string, attcFilNm: string, index: number) => {
    // uid 기준으로 이미지 삭제
    setImageList((prev) => prev?.filter((item) => item.uid !== uid));

    // attcFilNm 기준으로 이미지 삭제
    setIsExistingImageList((prev) =>
      prev?.filter((item) => item.attcFilNm !== attcFilNm),
    );

    // index 기준으로 파일 삭제 후 반영
    fileList.splice(index, 1);
    setFileList(fileList);
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
                handleFileDelete(image.uid!, image.attcFilNm!, index);
              }}
              className="_delete-single-file-button"
            >
              <span>
                <Image
                  src={CancelWhiteIcon}
                  alt="단일 이미지 삭제 아이콘"
                  width={14}
                  height={14}
                />
              </span>
            </button>
          </li>
        );
      })}
    </>
  );
}
