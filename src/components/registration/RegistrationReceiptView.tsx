import InfoTableSection from "@components/common/InfoTableSection";
import {
  DetailVariant,
  getAddressRows,
  getManagerRows,
  RegistrationDetailData,
} from "./rows";

type RegistrationReceiptViewProps = {
  requestNo: string;
  data?: RegistrationDetailData;
  variant: DetailVariant;
  isDesktop?: boolean;
};

/**
 * @name RegistrationReceiptView
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 등기접수증 상세 팝업의 표시 영역입니다. (금융기관 현황조회·관리자 등기관리 공통)
 */
export default function RegistrationReceiptView({
                                                  requestNo,
                                                  data,
                                                  variant,
                                                  isDesktop,
                                                }: RegistrationReceiptViewProps) {
  return (
    <>
      <InfoTableSection title="담보목적물 주소" rows={getAddressRows(data)} isDesktop={isDesktop} />
      <InfoTableSection
        title="기본 정보"
        isDesktop={isDesktop}
        rows={[
          [{ label: "의뢰번호", value: requestNo }, { label: "채무자", value: data?.dbtrNm || "-" }],
          { label: "대출실행일", value: data?.execDt || "-" },
        ]}
      />
      <InfoTableSection
        title="등기접수 정보"
        isDesktop={isDesktop}
        rows={[
          { label: "관할법원", value: data?.judtCourtNm || "-" },
          { label: "등기소", value: data?.regrNm || "-" },
          { label: "접수번호", value: data?.acptNo || "-" },
        ]}
      />
      <InfoTableSection
        title="담당자 정보"
        isDesktop={isDesktop}
        rows={getManagerRows(data, variant, data?.mngrDlvrCnts || "-")}
      />
    </>
  );
}
