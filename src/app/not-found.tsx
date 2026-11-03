"use client";

import { useRouter } from "next/navigation";
import { FI_HOME, AD_ASSIGN } from "@constants/path";
import { Typography } from "@components/common";
import { Button } from "@components/button";
import { useResponsive } from "@hooks";

export default function NotFound() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  let prevPath;

  if (typeof window !== "undefined") {
    prevPath = sessionStorage.getItem("prevPath");
  }

  const goToFIHome = () => router.push(FI_HOME);

  const goToADHome = () => router.push(AD_ASSIGN);

  return (
    <section className="_error-page _full">
      <div className="_error-page-inner-wrapper">
        <div>
          <Typography
            as="h1"
            kind={isMobile ? "error-subtitle" : "error-title"}
            isBold={true}
          >
            404
          </Typography>

          <Typography
            as="h2"
            kind={isMobile ? "error-text" : "error-subtitle"}
            isBold={true}
          >
            Not Found
          </Typography>
        </div>

        <div>
          {/*<Button*/}
          {/*  type="button"*/}
          {/*  shape="outline"*/}
          {/*  size={isMobile ? "sm" : "lg"}*/}
          {/*  color="grayscale"*/}
          {/*  onClick={() => router.back()}*/}
          {/*>*/}
          {/*  이전 페이지로 돌아가기*/}
          {/*</Button>*/}

          <Button
            type="button"
            shape="solid"
            size={isMobile ? "sm" : "lg"}
            color="main100"
            onClick={prevPath?.includes("admin") ? goToADHome : goToFIHome}
          >
            홈으로 이동하기
          </Button>
        </div>
      </div>
    </section>
  );
}
