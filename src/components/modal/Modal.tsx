"use client";

import { ReactNode, useId, useRef } from "react";
import ReactDOM from "react-dom";

import { ModalHeader } from "@components/modal";
import { useDialog } from "@hooks";

import "@styles/modal.css";

type ModalProps = {
  children: ReactNode;
  title: string;
  onClose: () => void;
  size?:
    | "xs" // 미할당
    | "sm" // 436x202
    | "md" // 640x530
    | "lg" // 700x987
    | "xl"; // 1104x800
};

/**
 * @name Modal
 * @version 2.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 *              WAI-ARIA 대화상자(dialog) 패턴을 따릅니다.
 *              - role="dialog", aria-modal, 제목(aria-labelledby) 연결
 *              - 열면 모달 안으로 포커스 이동, Tab·Shift+Tab은 모달 안에서만 순환, 닫으면 연 요소로 포커스 복귀
 *              - 열려 있는 동안 뒤 페이지는 inert(보조기기·키보드 접근 차단), 스크롤 잠금
 *              - 닫기: 닫기 버튼, 백드롭 클릭, Esc (모달이 겹쳐 있으면 맨 위 모달만 닫힘)
 * @property {string} title         - 모달 타이틀
 * @property {function} onClose     - 모달 닫기 기능
 * @property {string} size          - 모달 규격(기본값: xl)
 */
export default function Modal({ children, title, onClose, size = "xl" }: ModalProps) {
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const dialogRef = useRef<HTMLElement>(null);
  const portal = useDialog(dialogRef, onClose);

  if (!portal) return null;

  return ReactDOM.createPortal(
    <>
      <div className="_modal-backdrop" onClick={onClose} aria-hidden="true" />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`_modal-container shadow-modal _${size} outline-none`}
      >
        <div className="_modal-container-wrapper">
          <ModalHeader title={title} titleId={titleId} onClose={onClose} />
          <div className="_modal-content">
            <div className="_modal-content-inner-wrapper">{children}</div>
          </div>
        </div>
      </section>
    </>,
    portal as Element,
  );
}
