"use client";

import { useEffect, useState } from "react";
import {
  PAGE_LIMIT_ADMIN,
  PAGE_LIMIT_MOBILE,
  PAGE_COUNT_PC,
  PAGE_COUNT_MOBILE,
} from "@constants/page";
import { Loading, PageIndicator, Pagination } from "@components/common";
import { ResponsiveType } from "@types";
import { getStasusListData } from "@services/statusInquiry";
import { useQuery } from "@tanstack/react-query";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import FilterTable from "./FilterTable";
import Table from "./Table";

export type filters = {
  rqstNo: string;
  statCd: string;
  acptNo: string;
  searchType: string;
  fromDate: string;
  toDate: string;
  dbtrNm: string;
  queryTime: Date | null;
};

export default function List({ isDesktop }: ResponsiveType) {
  const openToast = useSetAtom(toastState);

  const [page, setPage] = useState(1);
  const [rqstNo, setRqstNo] = useState<string>("");
  const [queryTime, setQueryTime] = useState(new Date());
  const [filters, setFilters] = useState<filters>({
    rqstNo: "",
    statCd: "",
    acptNo: "",
    searchType: "", // 초기값 : 대출실행
    fromDate: "", // 초기값 : 당일
    toDate: "", // 초기값 : 당일
    dbtrNm: "",
    queryTime: null,
  }); // 필터 상태 관리
  const [data, setData] = useState([]); // 테이블 데이터
  const [total, setTotal] = useState(0); // 전체 데이터 개수
  const [pageLimit, setPageLimit] = useState(0);

  //헤더 의뢰번호 검색 후 처리
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRqstNo = sessionStorage.getItem("bank-rqstno");
      if (storedRqstNo) {
        setRqstNo(storedRqstNo); // ✅ null이 아닐 때만 설정
        setFilters((prev) => ({ ...prev, rqstNo: storedRqstNo }));
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("bank-rqstno");
      }
    };
  }, []);

  const { data: statusListData, isLoading: statusListDataLoading } = useQuery({
    queryKey: ["search-statuslist", page, filters, pageLimit, queryTime],
    queryFn: async () =>
      await getStasusListData({
        page,
        size: pageLimit,
        rqstNo: filters.rqstNo!,
        statCd: filters.statCd,
        acptNo: filters.acptNo,
        searchType: !!filters.searchType ? filters.searchType : "EXEC",
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        dbtrNm: filters.dbtrNm,
      }),
    select: (response) => {
      return response?.data;
    },
    enabled: !!page && pageLimit > 0,
  });

  useEffect(() => {
    if (statusListData) {
      setData(statusListData.rgstrList || []); // data set
      setTotal(statusListData.totalElements || 0); //total set

      //등기의뢰번호 및 검색일자 조회 시 데이터 없을 경우 처리
      if (
        (!!filters.rqstNo ||
          !!filters.fromDate ||
          !!filters.toDate ||
          !!filters.statCd ||
          !!filters.acptNo ||
          !!filters.dbtrNm) &&
        statusListData?.totalElements === 0
      ) {
        openToast({
          message: "일치하는 검색결과가 없습니다",
          position: isDesktop ? "top" : "bottom",
        });
      }
    }
    // 아래 값이 바뀔 때만 실행하도록 의도된 이펙트입니다. (그 외 값은 실행 시점의 최신 값을 읽기만 함)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusListData]);

  useEffect(() => {
    setPageLimit(isDesktop ? PAGE_LIMIT_ADMIN : PAGE_LIMIT_MOBILE);
  }, [isDesktop]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <>
      <FilterTable
        isDesktop={isDesktop}
        setFilters={setFilters}
        rqstNo={rqstNo}
      />
      <div className="_responsive-table-outer-wrapper">
        <PageIndicator
          total={total}
          page={page}
          limit={isDesktop ? PAGE_LIMIT_ADMIN : PAGE_LIMIT_MOBILE}
        />
        {statusListDataLoading && <Loading />}
        <Table isDesktop={isDesktop} data={data} setQueryTime={setQueryTime} />
        <Pagination
          total={total}
          page={page}
          limit={isDesktop ? PAGE_LIMIT_ADMIN : PAGE_LIMIT_MOBILE}
          pageCount={isDesktop ? PAGE_COUNT_PC : PAGE_COUNT_MOBILE}
          setPage={setPage}
        />
      </div>
    </>
  );
}
