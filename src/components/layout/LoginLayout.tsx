import React, { ReactNode } from "react";

import { Header } from "@components/layout/index";

/**
 * @name LoginLayout
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="_login-outer-wrapper">
      <a href="#main-content" className="_skip-link">
        본문 바로가기
      </a>
      <Header />

      <main id="main-content" tabIndex={-1}>
        <div className="_login-inner-wrapper">{children}</div>
      </main>
    </div>
  );
}
