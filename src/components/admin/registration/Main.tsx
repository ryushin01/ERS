"use client";

import { useState } from "react";
import { TabGroup, Typography } from "@components/common";
import { useResponsive } from "@hooks";
import List from "./List";

export type TabCountData = {
  total: number;
  rqst: number;
  mtchCmpt: number;
  loanExec: number;
  rqstProg: number;
  rqstRtun: number;
  rqstCmpt: number;
  progHold: number;
  progCncl: number;
};

export default function Main() {
  const { isDesktop } = useResponsive();
  const [tabSelection, setTabSelection] = useState<string>("");
  const [tabCount, setTabCount] = useState<TabCountData>({
    total: 0,
    rqst: 0,
    mtchCmpt: 0,
    loanExec: 0,
    rqstProg: 0,
    rqstRtun: 0,
    rqstCmpt: 0,
    progHold: 0,
    progCncl: 0,
  });

  const TAB_LIST = [
    {
      id: "total",
      label: "전체",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.total,
    },
    {
      id: "mtchCmpt",
      label: "배정완료",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.mtchCmpt,
    },
    {
      id: "loanExec",
      label: "대출실행",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.loanExec,
    },
    {
      id: "rqstProg",
      label: "접수검토중",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.rqstProg,
    },
    {
      id: "rqstRtun",
      label: "접수반려",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.rqstRtun,
    },
    {
      id: "rqstCmpt",
      label: "접수완료",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.rqstCmpt,
    },
    {
      id: "progHold",
      label: "진행보류",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.progHold,
    },
    {
      id: "progCncl",
      label: "진행취소",
      content: (
        <List
          tabSelection={tabSelection}
          setTabCount={setTabCount}
          isDesktop={isDesktop}
        />
      ),
      count: tabCount.progCncl,
    },
  ];

  const handleTabChange = (index: number) => {
    switch (index) {
      case 0: //전체
        return setTabSelection("");
      case 1: //배정완료
        return setTabSelection("20");
      case 2: //대출실행
        return setTabSelection("30");
      case 3: //접수검토중
        return setTabSelection("40");
      case 4: //접수반려
        return setTabSelection("50");
      case 5: //접수완료
        return setTabSelection("60");
      case 6: //진행취소
        return setTabSelection("80");
      case 7: //진행보류
        return setTabSelection("70");
    }
  };

  return (
    <section className="pb-5">
      <Typography as="h2" kind="headline-medium" isBold={true} className="py-6">
        등기관리
      </Typography>

      <TabGroup items={TAB_LIST} defaultTab={0} onTabChange={handleTabChange} />
    </section>
  );
}
