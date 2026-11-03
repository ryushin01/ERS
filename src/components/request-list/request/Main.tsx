"use client";

import { useSearchParams } from "next/navigation";
import { Breadcrumb, Typography } from "@components/common";
import { useResponsive } from "@hooks";
import DesktopFileUploader from "./DesktopFileUploader";
import MobileFileUploader from "./MobileFileUploader";

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
      {!isDesktop &&
        <MobileFileUploader requestNo={requestNo} isTablet={isTablet} isMobile={isMobile} isPortrait={isPortrait} />}
    </section>
  );
}