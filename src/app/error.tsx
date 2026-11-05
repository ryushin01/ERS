"use client";

import { useEffect } from "react";

import { Error as ErrorNotice } from "@components/error-boundary";

/**
 * 페이지에 CustomErrorBoundary가 없거나 그 바깥에서 난 오류를 받습니다. (로그인, 금융기관 홈 등)
 */
export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorNotice onReset={reset} />;
}
