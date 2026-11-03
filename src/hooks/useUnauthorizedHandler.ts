"use client";

import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { toastState } from "@stores";
import { useResponsive } from "@hooks";
import Cookies from "js-cookie";

export const useUnauthorizedHandler = () => {
  const router = useRouter();
  const openToast = useSetAtom(toastState);
  const { isMobile } = useResponsive();

  // 401 에러 : 리프레시토큰이 만료된 경우에 세션스토리지 로그인 정보 제거 및 쿠키의 사용자 유형 삭제, 토스트팝업 노출 및 로그인화면으로 이동
  return () => {
    sessionStorage.removeItem("auth");

    Cookies.remove("membGbCd");

    openToast({
      message: "토큰이 만료되어 자동으로 로그아웃 되었습니다.",
      position: isMobile ? "bottom" : "top",
      afterFunc: () => router.push("/"),
    });
  };
};
