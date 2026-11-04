import { ReactNode, useState } from "react";

import { CommonLayout } from "@components/layout";
import { PROC_STAT_CD } from "@constants/code";
import { REGISTRATIONS } from "@/mocks/data";

/*
 * 스토리 공통 도우미
 * - 데이터가 필요한 화면은 앱과 같은 데모 목업 데이터(src/mocks)를 사용합니다.
 */

type ProcStatCd = (typeof PROC_STAT_CD)[keyof typeof PROC_STAT_CD];

/** 목업 의뢰 중 진행상태가 statCd인 첫 의뢰번호 */
export const rqstNoByStatus = (statCd: ProcStatCd) =>
  REGISTRATIONS.find((item) => item.statCd === statCd)?.rqstNo ?? REGISTRATIONS[0].rqstNo;

/** 화면 경로(usePathname·useParams)를 지정하는 nextjs 파라미터 */
export const routeParameters = (pathname: string, query: Record<string, string> = {}) => ({
  nextjs: {
    appDirectory: true,
    navigation: { pathname, query, segments: Object.entries(query) },
  },
});

/** 모바일 뷰포트로 보여 주는 globals (useResponsive가 화면 폭으로 판단) */
export const mobileViewport = { viewport: { value: "mobile", isRotated: false } };

/** 열고 닫을 수 있는 상태를 스토리 안에서 관리합니다. (모달·드로어 등) */
export function Toggle({
  label = "열기",
  initialOpen = true,
  children,
}: {
  label?: string;
  initialOpen?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <>
      <button
        type="button"
        className="self-start px-4 py-2 rounded-lg bg-ers-main-100 text-ers-grayscale-0"
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>
      {isOpen && children(() => setIsOpen(false))}
    </>
  );
}

/** 실제 화면처럼 헤더·메뉴·푸터(CommonLayout) 안에 스토리를 렌더링합니다. */
export const withCommonLayout = (Story: () => ReactNode) => <CommonLayout>{Story()}</CommonLayout>;
