import { useEffect, useState } from "react";
import { Typography } from "@components/common";
import { Button } from "@components/button";
import { PROC_STAT_CD } from "@constants/code";
import { ResponsiveType } from "@types";
import {
  getRegistrationInfoData,
  patchRegistrationHold,
} from "@services/request";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getDetailAddress,
  getManagerInfo,
  formatNumberComma,
} from "@utils/stringUtil";
import { getCompareWithToday } from "@utils/dateUtil";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";

type RegistrationDataProps = {
  requestNo: string;
  onClose?: () => void;
};

export default function RegistrationDataDetail({
                                                 requestNo,
                                                 onClose,
                                                 isDesktop,
                                               }: RegistrationDataProps & ResponsiveType) {
  const openToast = useSetAtom(toastState);
  const [isHoldDisabled, setIsHoldDisabled] = useState(false);

  /* 등기자료 정보 조회 */
  const { data: data } = useQuery({
    queryKey: ["registration-info", requestNo],
    queryFn: async () => await getRegistrationInfoData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

  /* 진행보류 처리 */
  const { mutate: registrationHold } = useMutation({
    mutationKey: ["registration-hold"],
    mutationFn: async () => await patchRegistrationHold(requestNo),
    onSuccess: () => {
      openToast({
        message: "진행보류 상태로 변경되었습니다.\n관리자 확인 후 처리됩니다.",
        position: isDesktop ? "top" : "bottom",
        afterFunc: onClose,
      });
    },
    onError: (error) => {
      console.error(error);
      setIsHoldDisabled(false);
    },
  });

  const handelRegistrationHold = () => {
    registrationHold();
    setIsHoldDisabled(true);
  };

  useEffect(() => {
    /*
    진행보류 버튼 비활성화 조건 
    1. 대출실행일 기준 D-day 부터 비활성화 
    2. 진행상태가 '진행보류' 또는 '진행취소'인 경우 비활성화
    */
    const compareWithToday = getCompareWithToday(data?.execDt);
    if (compareWithToday === "same" || compareWithToday === "past") {
      setIsHoldDisabled(true);
    } else if (
      data?.statCd === PROC_STAT_CD.HOLD ||
      data?.statCd === PROC_STAT_CD.CANCEL
    ) {
      setIsHoldDisabled(true);
    }
  }, [data]);

  return (
    <>
      {/* 담보목적물 주소 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isDesktop ? "title-medium" : "body-large"}
          isBold={true}
          className="_title"
        >
          담보목적물 주소
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">
              담보목적물 주소 표
            </caption>
            <tbody>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  지번
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.lotnumAddr || "-"}
                </Typography>
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  도로명
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.rdnmAddr || "-"}
                </Typography>
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  상세주소
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {getDetailAddress(data?.bldg, data?.unit)}
                </Typography>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 기본 정보 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isDesktop ? "title-medium" : "body-large"}
          isBold={true}
          className="_title"
        >
          기본 정보
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">기본 정보 표</caption>
            <tbody>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  의뢰번호
                </Typography>
              </th>
              <td>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {requestNo}
                </Typography>
              </td>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  채무자
                </Typography>
              </th>
              <td>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.dbtrNm || "-"}
                </Typography>
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  설정약정일
                </Typography>
              </th>
              <td>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.seDt || "-"}
                </Typography>
              </td>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  대출실행일
                </Typography>
              </th>
              <td>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.execDt || "-"}
                </Typography>
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  채권최고액
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.bndMaxAmt
                    ? `${formatNumberComma(data?.bndMaxAmt)} 원`
                    : "-"}
                </Typography>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 담당자 정보 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isDesktop ? "title-medium" : "body-large"}
          isBold={true}
          className="_title"
        >
          담당자 정보
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">담당자 정보 표</caption>
            <tbody>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  법무대리인
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {getManagerInfo(data?.lgagMembNm, data?.lgagMembHpno)}
                </Typography>
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  시스템 관리자
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {getManagerInfo(data?.mngrMembNm, data?.mngrMembHpno)}
                </Typography>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA 버튼 영역 */}
      <section className="_section">
        <div className="_button-wrap">
          <Button
            shape="solid"
            size="md"
            color="grayscale"
            disabled={isHoldDisabled}
            onClick={() => handelRegistrationHold()}
          >
            진행보류
          </Button>
        </div>
      </section>
    </>
  );
}
