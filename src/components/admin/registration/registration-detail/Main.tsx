"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, Typography } from "@components/common";
import { useResponsive } from "@hooks";
import List from "./List";

export default function Main() {
  const { isDesktop } = useResponsive();
  const pathname = usePathname();
  const pathArray = pathname.split("/").slice(2);
  const requestNo = pathArray[pathArray.length - 1];

  return (
    <section className="_registration-detail">
      <Breadcrumb />

      <Typography
        as="h2"
        kind={isDesktop ? "headline-medium" : "title-large"}
        isBold={true}
        className={isDesktop ? "py-6" : "pb-4"}
      >
        등기관리 상세
      </Typography>

      <List requestNo={requestNo} isDesktop={isDesktop} />
    </section>
  );
}
