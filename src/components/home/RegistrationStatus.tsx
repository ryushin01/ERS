import { Typography } from "@components/common";
import { useResponsive } from "@hooks";

import type { HomeRegistration } from "@types";

import "@styles/responsive-table.css";

type RegiStratusListProps = {
  data: HomeRegistration[];
};

export default function RegistrationStratus({ data }: RegiStratusListProps) {
  const { isDesktop } = useResponsive();

  return (
    <div className="_responsive-table-inner-wrapper _has-thead">
      <table className="_responsive-table _col-5-type">
        <caption className="_hidden-table-caption">실시간 등기현황 표</caption>
        <thead>
        <tr>
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
              진행상태
            </Typography>
          </th>
          <th>
            <Typography
              kind={isDesktop ? "title-medium" : "body-medium"}
              isBold={true}
            >
              등기접수번호
            </Typography>
          </th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, idx) => (
          <tr key={`${idx}${item.dbtrNm}`}>
            <td>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                {!!item.rqstNo ? item.rqstNo : "-"}
              </Typography>
            </td>
            <td>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                {!!item.dbtrNm ? item.dbtrNm : "-"}
              </Typography>
            </td>
            <td>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                {!!item.lgagMembNm ? item.lgagMembNm : "-"}
              </Typography>
            </td>
            <td>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                {!!item.statCdNm ? item.statCdNm : "-"}
              </Typography>
            </td>
            <td>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                {!!item.acptNo ? item.acptNo : "-"}
              </Typography>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
