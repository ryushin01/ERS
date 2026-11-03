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
      <Header />
      
      <main>
        <div className="_login-inner-wrapper">{children}</div>
      </main>
    </div>
  );
}