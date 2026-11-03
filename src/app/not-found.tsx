"use client";

import { useRouter } from "next/navigation";

import { Button } from "@components/button";
import { Typography } from "@components/common";
import { AD_ASSIGN, AD_PATH, FI_HOME } from "@constants/path";
import { useResponsive } from "@hooks";
import { isPathUnder } from "@utils/pathUtil";

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
          {/*  color="grayscale"*/}
          {/*>*/}
          {/*  이전 페이지로 돌아가기*/}
          {/*</Button>*/}

          <Button
            type="button"
            shape="solid"
            size={isMobile ? "sm" : "lg"}
            color="main100"
            onClick={isPathUnder(prevPath, AD_PATH) ? goToADHome : goToFIHome}
          >
            홈으로 이동하기
          </Button>
        </div>
      </div>
    </section>
  );
}
