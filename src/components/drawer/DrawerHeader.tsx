import Image from "next/image";

import { IconButton } from "@components/button";
import { CancelIcon } from "@icons24";

type DrawerHeaderProps = {
  onClose: () => void;
};

/**
 * @name DrawerHeader
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {function} onClose     - 드로어 닫기 기능
 */
export default function DrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <div className="_drawer-header">
      <h2 className="_hidden">비밀번호 변경, 로그아웃, 서비스 이용문의 정보 제공 섹션</h2>
      <IconButton
        size="md"
        onClick={onClose}
        icon={<Image src={CancelIcon} alt="" width={24} height={24} />}
      >
        계정 메뉴 닫기
      </IconButton>
    </div>
  );
}
