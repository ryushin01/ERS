"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

/**
 * @name useResponsive
 * @version 1.1.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 */

export default function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const isMobileResolution = useMediaQuery({
    query: "(min-width: 320px) and (max-width: 767px)",
  });
  const isTabletResolution = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1366px)",
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  const isDesktop = !(isMobile || isTablet);

  useEffect(() => {
    setIsMobile(isMobileResolution);
  }, [isMobileResolution]);

  useEffect(() => {
    setIsTablet(isTabletResolution);
  }, [isTabletResolution]);

  if (typeof window !== "undefined") {
    if (isMobile) {
      sessionStorage.setItem("isMobile", "true");
      sessionStorage.setItem("isTablet", "");
    } else {
      sessionStorage.setItem("isTablet", "true");
      sessionStorage.setItem("isMobile", "");
    }
  }

  return { isMobile, isTablet, isDesktop, isPortrait, isLandscape };
}
