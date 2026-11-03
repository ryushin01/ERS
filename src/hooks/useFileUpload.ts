import { ChangeEvent, useState } from "react";
import { FILE_MAXIMUM_SIZE, FILE_MAXIMUM_SIZE_STRING } from "@constants/file";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";

/**
 * @name useFileUpload
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 */
export default function useFileUpload() {
  // 선택된 이미지 파일들을 저장할 상태
  const [imageList, setImageList] = useState<File[]>([]);
  // 선택된 이미지 파일의 미리보기 URL을 저장할 상태
  const [previewImageList, setPreviewImageList] = useState<string[]>([]);
  const openToast = useSetAtom(toastState);

  // 파일 선택 시의 이벤트 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // 선택된 파일이 있는지 확인
    if (e.target.files) {
      const fileList = Array.from(e.target.files);

      // 기존의 이미지 파일들에 새로운 파일들을 추가
      const newImageList = [...imageList, ...fileList];

      // 전체 용량 계산
      const totalSize = newImageList.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > FILE_MAXIMUM_SIZE) {
        openToast({
          message: `업로드 가능한 전체 용량은 최대 ${FILE_MAXIMUM_SIZE_STRING}입니다.`,
          position: "top",
        });
        // return;
      }

      // 이미지 리스트 상태 업데이트
      setImageList(newImageList);

      // 미리보기 URL을 업데이트하기 위한 임시 배열
      const newPreviewImageList = [...previewImageList];

      // 각 파일에 대해 FileReader를 사용하여 미리보기 URL을 생성
      fileList.forEach((file) => {
        const reader = new FileReader();

        // 파일 읽기가 끝났을 때 실행될 콜백을 정의
        reader.onloadend = () => {
          // 생성된 미리보기 URL을 임시 배열에 추가
          newPreviewImageList.push(reader.result as string);

          // 모든 파일의 미리보기 URL이 준비되었는지 확인하고, 준비되었다면 상태를 업데이트함
          if (newPreviewImageList.length === newImageList.length) {
            setPreviewImageList(newPreviewImageList);
          }
        };

        // 파일을 Data URL 형태로 읽음. 이 URL은 미리보기 이미지로 사용됨
        reader.readAsDataURL(file);
      });
    }
  };

  // 개별 파일 이미지 삭제
  const handleFileDelete = (index: number): void => {
    const newImageFiles = imageList.filter(
      (_, fileIndex) => fileIndex !== index,
    );
    setImageList(newImageFiles);

    const newPreviewUrls = previewImageList.filter(
      (_, urlIndex) => urlIndex !== index,
    );
    setPreviewImageList(newPreviewUrls);

    openToast({
      message: "해당 파일이 삭제되었습니다.",
      position: "top",
    });
  };

  return {
    handleFileChange,
    handleFileDelete,
    previewImageList,
    imageList,
  };
}
