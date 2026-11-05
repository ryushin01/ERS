import { useEffect, useRef } from "react";

import { DrawerContent, DrawerFooter } from "@components/drawer";

import "@styles/account-layer.css";

type AccountLayerProps = {
  level: string;
  onClose: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  profileData?: string;
  imgSrc?: string;
};

/**
 * @name AccountLayer
 * @version 1.0.1
 * @author 류창선 <ryushin0167@gmail.com>
 * @property {string} level           - 회원 권한 정의
 * @property {string} profileData     - 회원명
 * @property {string} imgSrc          - 로고 앰블럼
 */

/**
 * @name membGbCd(사용자 구분 코드)
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * 00 : 금융기관
 * 10 : 법무대리인
 * 20 : 관리자
 */

export default function AccountLayer({
  level,
  onClose,
  isModalOpen,
  openModal,
  closeModal,
  profileData,
  imgSrc,
}: AccountLayerProps) {
  const targetRef = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  /* 키보드 사용자를 위해 Esc로 닫고, 연 버튼으로 포커스를 돌려줌 */
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      opener.current?.focus();
      onClose();
    }
  };

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    // clean-up effect
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <div className="_account-layer-wrapper">
      <section ref={targetRef} className="_account-layer">
        <h2 className="_hidden">비밀번호 변경, 로그아웃, 서비스 이용문의 정보 제공 섹션</h2>
        <DrawerContent
          level={level}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          profileData={profileData}
          imgSrc={imgSrc}
        />
        <DrawerFooter />
      </section>
    </div>
  );
}
