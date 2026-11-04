import Image from "next/image";

import { Typography } from "@components/common";
import { useResponsive } from "@hooks";
import { AlertTriangleIcon20 } from "@icons20";

import type { HomeNotice } from "@types";

import "@styles/responsive-table.css";

type NoticeListProps = {
  data: HomeNotice[];
};

export default function Announcement({ data }: NoticeListProps) {
  const { isDesktop } = useResponsive();

  return (
    <div className="_responsive-table-inner-wrapper _has-thead">
      <table className="_responsive-table _col-2-type">
        <caption className="_hidden-table-caption">공지사항 표</caption>
        <thead>
          <tr>
            <th>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"} isBold={true}>
                공지사항 제목
              </Typography>
            </th>
            <th>
              <Typography kind={isDesktop ? "title-medium" : "body-medium"} isBold={true}>
                등록일
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={`${idx}${item.crtDtm}`} className={item.emcyYn === true ? "_emergency" : ""}>
              <th>
                <span className="_table-content-wrapper">
                  {item.emcyYn === true ? (
                    <Image src={AlertTriangleIcon20} alt="긴급점검 아이콘" width={20} height={20} />
                  ) : null}
                  <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                    {!!item.boardTitles ? item.boardTitles : "-"}
                  </Typography>
                </span>
              </th>
              <td>
                <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
                  {!!item.crtDtm ? item.crtDtm : "-"}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
