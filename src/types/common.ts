import type { ChangeEvent } from "react";

/* input change 핸들러 */
export type ChangeInputType = (event: ChangeEvent<HTMLInputElement>) => void;

/* useResponsive 결과 기반 반응형 props */
export type ResponsiveType = {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isPortrait?: boolean;
  isLandscape?: boolean;
};

/* 공통 코드 셀렉트 옵션 */
export type CodeOption = {
  value: string;
  label: string;
};
