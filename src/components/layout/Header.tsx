"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { KoserLogo } from "@logos";
import { AD_ASSIGN, AD_PATH, FI_HOME, FI_PATH } from "@constants/path";
import { isPathUnder } from "@utils/pathUtil";
import HeaderRightArea from "./HeaderRightArea";

/**
 * @name Header
 * @version 1.1.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function Header() {
  const pathname = usePathname();

  /* 로고 클릭 시 이동할 사용자 유형별 홈 (로그인 화면·기타 경로는 이동 없음) */
  // TODO: 법무대리인 화면 구현 시 LA_PATH 분기 추가
  const homePath = isPathUnder(pathname, FI_PATH)
    ? FI_HOME
    : isPathUnder(pathname, AD_PATH)
      ? AD_ASSIGN
      : "";

  return (
    <header className="_header">
      <div className="_header-inner-wrap">
        <h1 className={pathname === "/" ? "_login" : ""}>
          <Link href={homePath}>
            <Image src={KoserLogo} alt="전자등기 관리 시스템 로고" fill />
          </Link>
        </h1>

        {pathname !== "/" &&
          <HeaderRightArea />
        }
      </div>
    </header>
  );
}