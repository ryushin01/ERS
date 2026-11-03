import Image from "next/image";

import { Typography } from "@components/common";
import { CancelIcon } from "@icons36";

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
}

/**
 * @name ModalHeader
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} title         - 모달 컴포넌트 타이틀
 * @property {function} onClose     - 모달 닫기 기능
 */
export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  let isMobile;

  if (typeof window !== "undefined") {
    isMobile = sessionStorage.getItem("isMobile");
  }

  return (
    <div className="_modal-header">
      <Typography as="h1" kind={!!isMobile ? "title-medium" : "headline-small"} isBold={true}>{title}</Typography>
      <button type="button" onClick={onClose} aria-label="모달 팝업 닫기">
        <Image src={CancelIcon} alt="모달 팝업 닫기 아이콘" width={36} height={36} />
      </button>
    </div>
  );
};
