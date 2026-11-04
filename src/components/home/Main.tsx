"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { Loading } from "@components/common";
import { useResponsive } from "@hooks";
import { getHomeNoticeListData, getRegistrationListData, getStatisticsData } from "@services/home";
import { authAtom } from "@stores";

import Banner from "./Banner";
import Contents from "./Contents";

import type {
  HomeNoticeListResponse,
  HomeRegistrationListResponse,
  HomeStatisticsResponse,
} from "@types";

import "@styles/home.css";

export default function Main() {
  const authInfo = useAtomValue(authAtom);
  const { isDesktop } = useResponsive();
  const { data } = useQuery<HomeStatisticsResponse>({
    queryKey: ["search-statistics"],
    queryFn: async () => await getStatisticsData(),
    select: (response) => response,
    enabled: true,
  });

  const { data: getRegiListData, isLoading: regiListDataLoading } =
    useQuery<HomeRegistrationListResponse>({
      queryKey: ["search-regiList"],
      queryFn: async () => await getRegistrationListData(),
      select: (response) => response,
      enabled: true,
    });

  const { data: getNotiListData } = useQuery<HomeNoticeListResponse>({
    queryKey: ["search-notiList"],
    queryFn: async () => await getHomeNoticeListData(),
    select: (response) => response,
    enabled: true,
  });

  const regiLilstData: HomeRegistrationListResponse = getRegiListData
    ? { data: getRegiListData.data }
    : { data: { rgstrMasterList: [] } };

  const notiLilstData: HomeNoticeListResponse = getNotiListData
    ? { data: getNotiListData.data }
    : { data: { homeBoardListRes: [] } };

  return (
    <div className="_main">
      {regiListDataLoading && <Loading />}
      <div className="_banner-section">
        <Banner
          name={`${authInfo.membNm}`}
          totalcount={data?.data?.cntExec ?? 0}
          inprogress={data?.data?.cntProg ?? 0}
          application={data?.data?.cntComplete ?? 0}
        />
      </div>

      <div className="_contents-section">
        <Contents
          isDesktop={isDesktop}
          getRegiListData={regiLilstData ?? []}
          getNoticeListData={notiLilstData ?? []}
        />
      </div>
    </div>
  );
}
