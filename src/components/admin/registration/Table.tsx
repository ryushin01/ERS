"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AD_ASSIGN_DETAIL,
  AD_REGISTRATION_DETAIL,
  AD_REGISTRATION_ACCEPTANCE,
} from "@constants/path";
import { ATTC_FIL_CD, PROC_STAT_CD } from "@constants/code";
import { ResponsiveSwiper, Typography } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import { Button } from "@components/button";
import { Modal } from "@components/modal";
import { useDisclosure } from "@hooks";
import { ResponsiveType } from "@types";
import RegistrationDataDetail from "./RegistrationDataDetail";
import RegistrationReceiptDetail from "./RegistrationReceiptDetail";
import "@styles/responsive-table.css";

type RegistrationListDataProps = {
  data: RegistrationListData;
};

type RegistrationListData = {
  totalPages: number;
  totalElements: number;
  rgstrMngrList: RegistrationItemData[];
};

type RegistrationItemData = {
  statNm: string;
  execDt: string;
  acptRptDtm: string;
  rqstNo: string;
  bndMembNm: string;
  dbtrNm: string;
  lgagMembNm: string;
  statCd: string;
};

export default function Table({
                                data,
                                isDesktop,
                              }: RegistrationListDataProps & ResponsiveType) {
  const router = useRouter();
  const [requestNo, setRequestNo] = useState<string>("");

  const {
    isOpen: isRegistrationDataModalOpen,
    open: openRegistrationDataModal,
    close: closeRegistrationDataModal,
  } = useDisclosure();

  const {
    isOpen: isRegistrationReceiptModalOpen,
    open: openRegistrationReceiptModal,
    close: closeRegistrationReceiptModal,
  } = useDisclosure();

  const handleClick = (requestNo: string, openModalFunction: () => void) => {
    setRequestNo(requestNo);
    openModalFunction();
  };

  return (
    <>
      <div className="_responsive-table-inner-wrapper _has-thead">
        <table className="_responsive-table _col-9-type">
          <caption className="_hidden-table-caption">등기관리 표</caption>
          <thead>
          <tr>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                진행상태
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                대출실행일
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                접수보고일시
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                의뢰번호
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                채권자
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                채무자
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                법무대리인
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                등기자료
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                등기접수증
              </Typography>
            </th>
          </tr>
          </thead>
          <tbody>
          {data?.rgstrMngrList?.map((item: RegistrationItemData) => {
            const {
              statNm,
              execDt,
              acptRptDtm,
              rqstNo,
              bndMembNm,
              dbtrNm,
              lgagMembNm,
              statCd,
            } = item;
            return (
              <tr key={rqstNo}>
                <td>
                  {/* NOTE: 보완필요 케이스는 _supplement 클래스까지 넣어서 더블 클래스 필요 */}
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                    className="_status"
                  >
                    {statNm}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {execDt}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {acptRptDtm || "-"}
                  </Typography>
                </td>
                <td>
                  <Link href={AD_REGISTRATION_DETAIL + `/${rqstNo}`}>
                    <Typography
                      kind={isDesktop ? "title-medium" : "body-medium"}
                    >
                      {rqstNo}
                    </Typography>
                  </Link>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {bndMembNm || "-"}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {dbtrNm || "-"}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {lgagMembNm || "-"}
                  </Typography>
                </td>
                <td>
                  {statCd === PROC_STAT_CD.REQUEST ||
                  statCd === PROC_STAT_CD.SUPPLEMENT ? (
                    /* 배정완료 이전까지는 배정버튼 노출 */
                    <Button
                      shape="solid"
                      size="sm"
                      color="main100"
                      onClick={() =>
                        router.push(AD_ASSIGN_DETAIL + `/${rqstNo}`)
                      }
                    >
                      배정
                    </Button>
                  ) : (
                    /* 배정완료 또는 진행보류, 진행취소 이후 등기자료 버튼 노출 */
                    <Button
                      shape="outline"
                      size="sm"
                      color="grayscale"
                      onClick={() =>
                        handleClick(rqstNo, openRegistrationDataModal)
                      }
                    >
                      등기자료
                    </Button>
                  )}
                </td>
                <td>
                  {statCd === PROC_STAT_CD.REVIEWING ? (
                    /* 접수보고 시  승인 버튼 노출 */
                    <Button
                      shape="solid"
                      size="sm"
                      color="main100"
                      onClick={() =>
                        router.push(AD_REGISTRATION_ACCEPTANCE + `/${rqstNo}`)
                      }
                    >
                      승인
                    </Button>
                  ) : (
                    /* 접수보고 이전까지 버튼 비활성화 */
                    <Button
                      shape="outline"
                      size="sm"
                      color="grayscale"
                      onClick={() =>
                        handleClick(rqstNo, openRegistrationReceiptModal)
                      }
                      disabled={!acptRptDtm}
                    >
                      등기접수증
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {/* 등기자료 모달 */}
      {isRegistrationDataModalOpen && (
        <Modal title="등기자료" onClose={closeRegistrationDataModal}>
          <Grid>
            <GridItem desktop={5} tablet={12} mobile={12}>
              <ResponsiveSwiper
                isDesktop={isDesktop}
                requestNo={requestNo}
                attachFileCode={ATTC_FIL_CD.REGISTRATION_DATA}
              />
            </GridItem>
            <GridItem desktop={7} tablet={12} mobile={12}>
              <RegistrationDataDetail
                isDesktop={isDesktop}
                requestNo={requestNo}
              />
            </GridItem>
          </Grid>
        </Modal>
      )}

      {/* 등기접수증 모달 */}
      {isRegistrationReceiptModalOpen && (
        <Modal title="등기접수증" onClose={closeRegistrationReceiptModal}>
          <Grid>
            <GridItem desktop={5} tablet={12} mobile={12}>
              <ResponsiveSwiper
                isDesktop={isDesktop}
                requestNo={requestNo}
                attachFileCode={ATTC_FIL_CD.REGISTRATION_RECEIPT}
              />
            </GridItem>
            <GridItem desktop={7} tablet={12} mobile={12}>
              <RegistrationReceiptDetail
                isDesktop={isDesktop}
                requestNo={requestNo}
              />
            </GridItem>
          </Grid>
        </Modal>
      )}
    </>
  );
}
