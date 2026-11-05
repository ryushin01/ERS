"use client";

import { RefObject, useEffect, useRef } from "react";

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
 * 열려 있는 대화상자 목록 (열린 순서). 모달·드로어가 겹칠 수 있으므로,
 * Esc·Tab 처리는 맨 위 대화상자만 하고 배경 잠금은 마지막 대화상자가 닫힐 때 해제합니다.
 */
const openDialogs: symbol[] = [];

/*
 * 대화상자가 열려 있는 동안 포털 밖의 페이지 내용을 보조기기·키보드에서 숨김 (inert)
 * 토스트 같은 알림 영역(data-live-region)은 숨기면 스크린 리더에 전달되지 않으므로 제외합니다.
 */
const setBackgroundInert = (portal: HTMLElement, inert: boolean) => {
  Array.from(document.body.children).forEach((element) => {
    if (element === portal || element.contains(portal)) return;
    if (element.hasAttribute("data-live-region")) return;
    if (inert) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
  });
};

/**
 * @name useDialog
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 모달·드로어 공통 대화상자 동작 (WAI-ARIA dialog 패턴)
 *              - 열리면 대화상자로 포커스 이동, 닫히면 연 요소로 복귀
 *              - Esc로 닫기, Tab은 대화상자 안에서만 순환
 *              - 배경 스크롤 잠금, 배경 inert
 * @returns 대화상자를 띄울 #portal 요소
 */
export default function useDialog(dialogRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const portal = document.getElementById("portal");
  // 렌더링마다 새로 만들어지는 onClose가 바뀌어도 이펙트(포커스 이동 등)를 다시 실행하지 않도록 ref로 보관
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!portal || !dialog) return;

    const dialogKey = Symbol("dialog");
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const isTopDialog = () => openDialogs[openDialogs.length - 1] === dialogKey;

    openDialogs.push(dialogKey);
    document.body.style.overflow = "hidden";
    setBackgroundInert(portal, true);

    // 대화상자 자체에 포커스를 두어 스크린 리더가 제목부터 읽도록 함
    dialog.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopDialog()) return;

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
      openDialogs.splice(openDialogs.indexOf(dialogKey), 1);

      // 마지막 대화상자가 닫힐 때만 배경 잠금 해제
      if (openDialogs.length === 0) {
        document.body.style.overflow = "";
        setBackgroundInert(portal, false);
      }

      // 대화상자를 연 요소로 포커스 복귀 (그 요소가 아직 화면에 있을 때)
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [portal, dialogRef]);

  return portal;
}
