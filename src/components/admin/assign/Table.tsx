"use client";

import { useState } from "react";
import { ATTC_FIL_CD } from "@constants/code";
import { ResponsiveSwiper, Typography } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import { Button } from "@components/button";
import { Modal } from "@components/modal";
import { useDisclosure } from "@hooks";
import type { AssignListItem } from "@types";
import RegistrationDataDetail from "./RegistrationDataDetail";
import "@styles/responsive-table.css";

interface DefineProps {
  isDesktop: boolean;
  data: AssignListItem[];
}

export default function Table({ isDesktop, data }: DefineProps) {
  const [rqstNo, setRqstNo] = useState("");
  const {
    isOpen: isRegistrationDataModalOpen,
    open: openRegistrationDataModal,
    close: closeRegistrationDataModal,
  } = useDisclosure();

  const handleOpenRegiDataModal = (rqstNo: string) => {
    openRegistrationDataModal();
    setRqstNo(rqstNo);
  };

  return (
    <>
      <div className="_responsive-table-inner-wrapper _has-thead">
        <table className="_responsive-table _col-8-type">
          <caption className="_hidden-table-caption">배정관리 목록 표</caption>
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
                의뢰번호
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                의뢰자
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
                의뢰일시
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                배정일시
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
          </tr>
          </thead>
          <tbody>
          {data?.map((item, idx) => {
            const {
              statNm,
              rqstNo,
              clientNm,
              bndNm,
              dbtrNm,
              crtDtm,
              mtchDtm,
            } = item;
            return (
              <tr key={`${idx}-${rqstNo}`}>
                <td>
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
                    {rqstNo}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                    className="_status"
                  >
                    {clientNm}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                    className="_status"
                  >
                    {bndNm}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {dbtrNm}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {crtDtm}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {mtchDtm}
                  </Typography>
                </td>
                <td>
                  <Button
                    shape="outline"
                    size="sm"
                    color="grayscale"
                    onClick={() => handleOpenRegiDataModal(rqstNo)}
                  >
                    등기자료
                  </Button>
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
                requestNo={rqstNo!}
                attachFileCode={ATTC_FIL_CD.REGISTRATION_DATA}
              />
            </GridItem>
            <GridItem desktop={7} tablet={12} mobile={12}>
              <RegistrationDataDetail isDesktop={isDesktop} requestNo={rqstNo!} />
            </GridItem>
          </Grid>
        </Modal>
      )}
    </>
  );
}
