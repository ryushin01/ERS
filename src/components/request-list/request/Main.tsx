"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { Breadcrumb, Loading, Typography } from "@components/common";
import { useResponsive } from "@hooks";

/*
 * 기기에 따라 둘 중 하나만 그리므로 필요한 쪽만 불러옵니다.
 * - PC: antd Upload를 쓰는 DesktopFileUploader
 * - 모바일·태블릿: 카메라(react-webcam)를 쓰는 MobileFileUploader
 * 둘 다 정적으로 import하면 쓰지 않는 쪽 라이브러리까지 첫 로딩에 포함됩니다.
 */
const DesktopFileUploader = dynamic(() => import("./DesktopFileUploader"), {
  loading: () => <Loading />,
});
const MobileFileUploader = dynamic(() => import("./MobileFileUploader"), {
  loading: () => <Loading />,
});

export default function Main() {
  const searchParams = useSearchParams();
  const requestNo = searchParams.get("requestNo");
  const { isDesktop, isTablet, isMobile, isPortrait } = useResponsive();

  return (
    <section className="pb-8">
      <Breadcrumb />

      <Typography
        as="h2"
        kind={isDesktop ? "headline-medium" : "title-large"}
        isBold={true}
        className={isDesktop ? "py-6" : "pb-4"}
      >
        전자등기 의뢰
      </Typography>

      {isDesktop && <DesktopFileUploader requestNo={requestNo} />}
      {!isDesktop && (
        <MobileFileUploader
          requestNo={requestNo}
          isTablet={isTablet}
          isMobile={isMobile}
          isPortrait={isPortrait}
        />
      )}
    </section>
  );
}
