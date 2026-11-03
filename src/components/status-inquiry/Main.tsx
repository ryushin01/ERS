"use client";

import { Typography } from "@components/common";
import { useResponsive } from "@hooks";
import List from "./List";

export default function Main() {
  const { isDesktop } = useResponsive();

  return (
    <section className="pb-8">
      <Typography
        as="h2"
        kind={isDesktop ? "headline-medium" : "title-large"}
        isBold={true}
        className={isDesktop ? "py-6" : "pb-4"}
      >전자등기 현황조회</Typography>

      <List isDesktop={isDesktop} />
    </section>
  );
}