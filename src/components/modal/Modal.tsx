"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import ReactDOM from "react-dom";

import { ModalHeader } from "@components/modal";

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

/* 키보드로 포커스를 받을 수 있는 요소 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/*
 * 열려 있는 모달 목록 (나중에 열린 모달이 뒤). 모달 위에 모달이 열릴 수 있으므로,
 * Esc·Tab 처리와 배경 잠금 해제는 맨 위(마지막) 모달 기준으로만 합니다.
 */
const openModals: string[] = [];

/* 모달이 열려 있는 동안 포털 밖의 페이지 내용을 보조기기·키보드에서 숨김 (inert) */
const setBackgroundInert = (portal: HTMLElement, inert: boolean) => {
  Array.from(document.body.children).forEach((element) => {
    if (element === portal || element.contains(portal)) return;
    if (inert) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
  });
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
  const portal = document.getElementById("portal");
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const dialogRef = useRef<HTMLElement>(null);
  // 렌더링마다 새로 만들어지는 onClose가 바뀌어도 이펙트(포커스 이동 등)를 다시 실행하지 않도록 ref로 보관
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!portal || !dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const isTopModal = () => openModals[openModals.length - 1] === modalId;

    openModals.push(modalId);
    document.body.style.overflow = "hidden";
    setBackgroundInert(portal, true);

    // 모달 자체에 포커스를 두어 스크린 리더가 제목(aria-labelledby)부터 읽도록 함
    dialog.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopModal()) return;

      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openModals.splice(openModals.indexOf(modalId), 1);

      // 마지막 모달이 닫힐 때만 배경 잠금 해제
      if (openModals.length === 0) {
        document.body.style.overflow = "";
        setBackgroundInert(portal, false);
      }

      // 모달을 연 요소로 포커스 복귀 (그 요소가 아직 화면에 있을 때)
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [portal, modalId]);

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
