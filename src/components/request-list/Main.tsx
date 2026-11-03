"use client";

import { useState } from "react";
import { TabGroup, Typography } from "@components/common";
import { useResponsive } from "@hooks";
import List from "./List";

/**
 * @name Main
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 금융기관 - 전자등기 의뢰목록
 */
export default function Main() {
  const { isDesktop } = useResponsive();
  const [tabSelection, setTabSelection] = useState<string>("00");

  const TAB_LIST = [
    {
      label: "미배정",
      content: <List tabSelection={tabSelection} isDesktop={isDesktop} />,
    },
    {
      label: "배정완료",
      content: <List tabSelection={tabSelection} isDesktop={isDesktop} />,
    },
    {
      label: "진행보류",
      content: <List tabSelection={tabSelection} isDesktop={isDesktop} />,
    },
    {
      label: "진행취소",
      content: <List tabSelection={tabSelection} isDesktop={isDesktop} />,
    },
  ];

  const handleTabChange = (index: number) => {
    switch (index) {
      case 0:
        return setTabSelection("00");
      case 1:
        return setTabSelection("01");
      case 2:
        return setTabSelection("02");
      case 3:
        return setTabSelection("03");
    }
  };

  return (
    <>
      <section>
        <Typography
          as="h2"
          kind={isDesktop ? "headline-medium" : "title-large"}
          isBold={true}
          className={isDesktop ? "py-6" : "pb-4"}
        >
          전자등기 의뢰목록
        </Typography>

        <TabGroup
          items={TAB_LIST}
          defaultTab={0}
          onTabChange={handleTabChange}
          isDesktop={isDesktop}
        />
      </section>
    </>
  );
}
