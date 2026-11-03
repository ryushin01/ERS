"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@components/button";
import { Loading, PageIndicator, Pagination } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import {
  PAGE_COUNT_MOBILE,
  PAGE_COUNT_PC,
  PAGE_LIMIT_MOBILE,
  PAGE_LIMIT_PC,
} from "@constants/page";
import { FI_REQUEST } from "@constants/path";
import { getRequestListData } from "@services/request";
import { ResponsiveType } from "@types";

import Table from "./Table";

type RequestListDataProps = {
  tabSelection: string;
};

/**
 * @name List
 * @param tabSelection 탭코드 (00:미배정, 01:배정완료, 02:진행보류, 03:진행취소)
 * @param isMobile 모바일 여부
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 금융기관 - 전자등기 의뢰목록 조회
 */
export default function List({
                               tabSelection,
                               isDesktop,
                             }: RequestListDataProps & ResponsiveType) {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(0);
  const [queryTime, setQueryTime] = useState(new Date());
  const router = useRouter();

  const { data: requestListData, isLoading: requestListLoading } = useQuery({
    queryKey: ["request-list", tabSelection, page, pageLimit, queryTime],
    queryFn: async () =>
      await getRequestListData({
        tabSelection: tabSelection,
        page: page,
        size: pageLimit,
      }),
    select: (response) => response.data?.data,
    enabled: !!tabSelection && pageLimit > 0,
  });

  useEffect(() => {
    setPage(1);
  }, [tabSelection]);

  useEffect(() => {
    setPageLimit(isDesktop ? PAGE_LIMIT_PC : PAGE_LIMIT_MOBILE);
  }, [isDesktop]);

  return (
    <>
      {requestListLoading && <Loading />}
      <div className="mt-4 [&>div]:justify-end [&>div>div]:p-0">
        <Grid>
          <GridItem desktop={2} tablet={12} mobile={12}>
            <Button
              shape="solid"
              size="md"
              color="main100"
              onClick={() => router.push(FI_REQUEST)}
            >
              전자등기 의뢰하기
            </Button>
          </GridItem>
        </Grid>
      </div>

      <div className="_responsive-table-outer-wrapper">
        <PageIndicator
          total={requestListData?.totalElements}
          page={page}
          limit={isDesktop ? PAGE_LIMIT_PC : PAGE_LIMIT_MOBILE}
        />
        <Table
          data={requestListData}
          isDesktop={isDesktop}
          setQueryTime={setQueryTime}
        />
        <Pagination
          total={requestListData?.totalElements}
          page={page}
          limit={isDesktop ? PAGE_LIMIT_PC : PAGE_LIMIT_MOBILE}
          pageCount={isDesktop ? PAGE_COUNT_PC : PAGE_COUNT_MOBILE}
          setPage={setPage}
        />
      </div>
    </>
  );
}
