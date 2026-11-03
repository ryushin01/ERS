import { DrawerContent, DrawerFooter, DrawerHeader } from "@components/drawer";

import "@styles/drawer.css";

type DrawerProps = {
  level: string;
  onClose: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  profileData?: string;
  imgSrc?: string;
};

/**
 * @name Drawer
 * @version 1.0.1
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} level           - 회원 권한 정의
 * @property {function} onClose       - 드로어 닫기 기능
 * @property {string} profileData     - 회원명
 * @property {string} imgSrc          - 로고 앰블럼
 */

/**
 * @name membGbCd(사용자구분코드)
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * 00 : 금융기관
 * 10 : 법무대리인
 * 20 : 관리자
 */

export default function Drawer({
  level,
  onClose,
  isModalOpen,
  openModal,
  closeModal,
  profileData,
  imgSrc,
}: DrawerProps) {
  return (
    <>
      <div className="_drawer-backdrop" onClick={onClose} />
      <section className="_drawer-container animate-drawer">
        <div className="_drawer-container-wrap">
          <DrawerHeader onClose={onClose} />
          <DrawerContent
            level={level}
            isModalOpen={isModalOpen}
            openModal={openModal}
            closeModal={closeModal}
            profileData={profileData}
            imgSrc={imgSrc!}
          />
          <DrawerFooter />
        </div>
      </section>
    </>
  );
}
