"use client";

import { useRouter } from "next/navigation";

import { Button } from "@components/button";
import { Typography } from "@components/common";
import { PROC_STAT_CD } from "@constants/code";
import { AD_ASSIGN_DETAIL } from "@constants/path";

import type { AssignListItem } from "@types";

import "@styles/responsive-table.css";

interface DefineProps {
  isDesktop: boolean;
  data: AssignListItem[];
}

export default function Table({ isDesktop, data }: DefineProps) {
  const router = useRouter();

  return (
    <>
      <div className="_responsive-table-inner-wrapper _has-thead">
        <table className="_responsive-table _col-6-type">
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
                대출실행일
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
                의뢰일시
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                배정
              </Typography>
            </th>
          </tr>
          </thead>
          <tbody>
          {data.map((item, idx) => {
            const { statNm, statCd, rqstNo, execDt, clientNm, crtDtm } = item;

            return (
              <tr key={`${idx}-${rqstNo}`}>
                <td>
                  {/* NOTE: 보완필요 케이스는 _supplement 클래스까지 넣어서 더블 클래스 필요 */}
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                    className={`_status ${
                      statCd === PROC_STAT_CD.SUPPLEMENT ? "_supplement" : ""
                    }`}
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
                  >
                    {execDt}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {clientNm}
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
                    <span className="_table-button-wrapper">
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
                    </span>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </>
  );
}
