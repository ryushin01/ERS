import React, { ReactNode } from "react";
import { Gnb, Header } from "@components/layout";

/**
 * @name CommonLayout
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 */
export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="_main-outer-wrapper">
      <Header />

      {/* TODO: 법무대리인인 경우 미노출 */}
      <Gnb />
      <main>
        <div className="_main-inner-wrapper">{children}</div>
      </main>
    </div>
  );
}