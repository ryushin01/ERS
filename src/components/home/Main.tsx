"use client";

import { Loading } from "@components/common";
import { useResponsive } from "@hooks";
import { useAtomValue } from "jotai";
import { authAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import {
  getStatisticsData,
  getRegistrationListData,
  getHomeNoticeListData,
} from "@services/home";
import type { HomeStatisticsResponse, HomeRegistrationListResponse, HomeNoticeListResponse } from "@types";
import Banner from "./Banner";
import Contents from "./Contents";
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

  const {
    data: getRegiListData,
    isLoading: regiListDataLoading,
  } = useQuery<HomeRegistrationListResponse>({
    queryKey: ["search-regiList"],
    queryFn: async () => await getRegistrationListData(),
    select: (response) => response,
    enabled: true,
  });

  const { data: getNotiListData } =
    useQuery<HomeNoticeListResponse>({
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
