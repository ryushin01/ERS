import Image from "next/image";

import { Typography } from "@components/common";
import { CancelIcon } from "@icons36";

type ModalHeaderProps = {
  title: string;
  /* 모달(role="dialog")의 aria-labelledby와 연결할 제목 id */
  titleId?: string;
  onClose: () => void;
};

/**
 * @name ModalHeader
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} title         - 모달 컴포넌트 타이틀
 * @property {string} titleId       - 제목 요소 id (모달의 aria-labelledby에 연결)
 * @property {function} onClose     - 모달 닫기 기능
 */
export default function ModalHeader({ title, titleId, onClose }: ModalHeaderProps) {
  let isMobile;

  if (typeof window !== "undefined") {
    isMobile = sessionStorage.getItem("isMobile");
  }

  return (
    <div className="_modal-header">
      <Typography
        as="h2"
        id={titleId}
        kind={!!isMobile ? "title-medium" : "headline-small"}
        isBold={true}
      >
        {title}
      </Typography>
      <button type="button" onClick={onClose} aria-label="모달 팝업 닫기">
        <Image src={CancelIcon} alt="" width={36} height={36} />
      </button>
    </div>
  );
}
