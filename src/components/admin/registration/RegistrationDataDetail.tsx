import { Typography } from "@components/common";
import { ResponsiveType } from "@types";
import { getRegistrationData } from "@services/registrationManagement";
import { useQuery } from "@tanstack/react-query";
import {
  getDetailAddress,
  getManagerInfo,
  formatNumberComma,
} from "@utils/stringUtil";

type RegistrationDataDetailProps = {
  requestNo: string;
};

export default function RegistrationDataDetail({
                                                 requestNo,
                                                 isDesktop,
                                               }: RegistrationDataDetailProps & ResponsiveType) {
  /* 등기자료 정보 조회 */
  const { data: data } = useQuery({
    queryKey: ["admin-registration-data", requestNo],
    queryFn: async () => await getRegistrationData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

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
                  금융기관
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {getManagerInfo(data?.bndMembNm, data?.bndMembHpno)}
                </Typography>
              </td>
            </tr>
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
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  전달사항
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {data?.lgagDlvrCnts || ""}
                </Typography>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
