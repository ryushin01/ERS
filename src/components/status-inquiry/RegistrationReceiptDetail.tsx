import { useQuery } from "@tanstack/react-query";

import RegistrationReceiptView from "@components/registration/RegistrationReceiptView";
import { getRegistrationAcceptData } from "@services/request";
import { ResponsiveType } from "@types";

type RegistrationReceiptDataProps = {
  requestNo: string;
};

/**
 * @name RegistrationReceiptDetail
 * @description 금융기관 - 등기접수증 상세 팝업
 */
export default function RegistrationReceiptDetail({
                                                    requestNo,
                                                    isDesktop,
                                                  }: RegistrationReceiptDataProps & ResponsiveType) {
  /* 등기접수증 정보 조회 */
  const { data } = useQuery({
    queryKey: ["registration-receipt", requestNo],
    queryFn: async () => await getRegistrationAcceptData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

  return (
    <RegistrationReceiptView
      requestNo={requestNo}
      data={data}
      variant="financial"
      isDesktop={isDesktop}
    />
  );
}
