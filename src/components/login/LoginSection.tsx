"use client";

import { Typography } from "@components/common";
import { useResponsive } from "@hooks";

import LoginForm from "./LoginForm";
import LoginNotice from "./LoginNotice";
import StorybookLink from "./StorybookLink";

export default function LoginSection() {
  const { isDesktop } = useResponsive();

  return (
    <section className="_login-section">
      <Typography
        as="h2"
        kind={isDesktop ? "headline-large" : "headline-small"}
        isBold={true}
        className="text-ers-main-100"
      >
        전자등기 관리 시스템
      </Typography>
      <LoginForm isDesktop={isDesktop} />
      <LoginNotice isDesktop={isDesktop} />
      <StorybookLink isDesktop={isDesktop} />
    </section>
  );
}
