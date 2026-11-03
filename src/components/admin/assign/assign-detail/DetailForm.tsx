"use client";

import { useEffect, useRef, useState } from "react";
import { ATTC_FIL_CD, REALE_CD } from "@constants/code";
import { FILE_MAXIMUM_NUMBER, FILE_MAXIMUM_SIZE } from "@constants/file";
import { Loading } from "@components/common";
import { Grid, GridItem } from "@components/layout";
// import { Form } from "@components/form";
// import { Button } from "@components/button";
import { useQuery } from "@tanstack/react-query";
import { getSupplimentData } from "@services/adminAssign";
import { getMemberListData } from "@services/assignDetail";
import { getCommonCodeList } from "@services/common";
import { getRegistrationImages } from "@services/file";
import { useFileUpload } from "@hooks";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import Table from "./Table";
import ResponsiveSwiper from "./ResponsiveSwiper";

interface DefineProps {
  isDesktop?: boolean;
  rqstNo: string;
}

export default function CreateForm({ isDesktop, rqstNo }: DefineProps) {
  const openToast = useSetAtom(toastState);
  const { handleFileChange, handleFileDelete, previewImageList, imageList } =
    useFileUpload();
  const [data, setData] = useState({
    rqstNo: "",
    execDt: "",
    bndNm: "",
    bndBizNo: "",
  });
  const [realeCd, setRealeCd] = useState([{ grpCd: "", code: "", codeNm: "" }]);

  const [membList, setMembList] = useState([
    {
      membNo: "",
      membNm: "",
      bizNo: "",
      bizNm: "",
    },
  ]);

  /* 배정등록 상세정보 조회 api */
  const {
    data: spplData = {
      rqstNo: "",
      execDt: "",
      bndNm: "",
      bndBizNo: "",
    },
    isLoading: spplDataLoading,
  } = useQuery({
    queryKey: ["search-sppldata"],
    queryFn: async () => await getSupplimentData(rqstNo),
    select: (response) => response.data,
    enabled: rqstNo !== "",
  });

  /* 배정등록 상세정보 데이터 set 해주기 */
  useEffect(() => {
    setData((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(spplData);
      return isSame ? prev : spplData;
    });
  }, [spplData]);

  /* 부동산구분코드 조회 api */
  const {
    data: realeCdData,
    // isLoading: realeCdDataLoading,
  } = useQuery({
    queryKey: ["search-realecode"],
    queryFn: async () => await getCommonCodeList(REALE_CD),
    select: (response) => response.data,
    enabled: true,
  });
  /* 부동산구분코드 데이터 set 해주기 */
  useEffect(() => {
    if (realeCdData?.data?.commCodeList) {
      setRealeCd(realeCdData.data.commCodeList);
    }
  }, [realeCdData]);

  /* 회원 목록 조회 api */
  const {
    data: memberListData = {
      membNo: "",
      membNm: "",
      bizNo: "",
      bizNm: "",
    },
    // isLoading: realeCdDataLoading,
  } = useQuery({
    queryKey: ["search-memberlist"],
    queryFn: async () => await getMemberListData("10"),
    select: (response) => response.data,
    enabled: true,
  });

  /* 회원 목록 데이터 set 해주기 */
  useEffect(() => {
    if (Array.isArray(memberListData)) {
      setMembList(memberListData);
    } else {
      setMembList([]); // 만약 배열이 아니라면 빈 배열로 초기화
    }
  }, [memberListData]);

  /* 등기자료 이미지 정보 조회 */
  const { data: imageData, isLoading: imageLoading } = useQuery({
    queryKey: ["registration-images", rqstNo],
    queryFn: async () =>
      await getRegistrationImages(rqstNo!, ATTC_FIL_CD.REGISTRATION_DATA!),
    select: (response) => response.data?.data,
    enabled: !!rqstNo,
  });
  // 기존이미지
  const apiImages = (imageData?.imgData ?? []).map(
    (img: { filIdx: string; filSize: { toString: () => string } }) => ({
      ...img,
      filIdx: String(img.filIdx),
      filSize: img.filSize?.toString(),
      source: "api" as const,
    }),
  );
  // 추가이미지
  const propImages = (previewImageList ?? []).map((src, idx) => ({
    seq: `prop-${idx}`,
    filIdx: `${idx}`,
    src,
    attcFilNm: `image-${idx}.jpg`,
    source: "prop" as const,
  }));

  // 기존이미지 + 추가이미지
  const mergedImages = [...apiImages, ...propImages];

  // 기존 이미지 길이 체크
  const apiImageLength = imageData?.imgData?.length ?? 0;

  /* 등기자료추가 */
  // 첨부 가능 개수 제어
  const isMaxFileExceeded = mergedImages?.length >= FILE_MAXIMUM_NUMBER;
  const isMaxSizeExceeded =
    imageList?.reduce((total, file) => total + (file.size ?? 0), 0) >
    FILE_MAXIMUM_SIZE;

  const isUploadDisabled = isMaxFileExceeded || isMaxSizeExceeded;

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (isMaxFileExceeded && !toastShownRef.current) {
      openToast({
        message: `최대 ${FILE_MAXIMUM_NUMBER}개까지 업로드할 수 있습니다.`,
        position: "top",
      });
      toastShownRef.current = true;
    }

    if (!isMaxFileExceeded) {
      toastShownRef.current = false;
    }
  }, [isMaxFileExceeded, openToast]);

  return (
    <>
      {/* <Form
        onSubmit={() => {}}
        onChange={() => {}}
        legendText="전자등기 신규등록 양식"
        isHiddenLegend={true}
      > */}
      {spplDataLoading && <Loading />}
      <Grid className="_without-padding">
        <GridItem desktop={6} tablet={6} mobile={12}>
          {previewImageList.length > 0 ? (
            <ResponsiveSwiper
              isDesktop={isDesktop}
              imageList={mergedImages}
              apiImageLength={apiImageLength}
              handleFileDelete={handleFileDelete}
              imageLoading={imageLoading}
              requestNo={rqstNo}
            />
          ) : (
            <ResponsiveSwiper
              isDesktop={isDesktop}
              imageList={mergedImages}
              apiImageLength={apiImageLength}
            />
          )}

          <div className="w-[108px] mt-2">
            <label
              htmlFor="registration-data-input-file"
              // className={`_file-uploader ${
              //   isUploadDisabled ? "opacity-40 pointer-events-none" : ""
              // }`}
              className={`_file-uploader`}
            >
              등기자료 추가
            </label>
            <input
              type="file"
              id="registration-data-input-file"
              className="hidden"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={handleFileChange}
              // onChange={isUploadDisabled ? undefined : handleFileChange}
            />
          </div>
        </GridItem>
        <GridItem desktop={6} tablet={6} mobile={12}>
          <Table
            requstNo={rqstNo}
            data={data}
            realeGbCd={realeCd}
            membList={membList}
            imageList={mergedImages}
            isUploadDisabled={isUploadDisabled}
            isMaxFileExceeded={isMaxFileExceeded}
            isMaxSizeExceeded={isMaxSizeExceeded}
          />
        </GridItem>
      </Grid>
      {/* </Form> */}
    </>
  );
}
