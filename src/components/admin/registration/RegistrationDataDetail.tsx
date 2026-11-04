import { useQuery } from "@tanstack/react-query";

import RegistrationDataView from "@components/registration/RegistrationDataView";
import { getRegistrationData } from "@services/registrationManagement";
import { ResponsiveType } from "@types";

type RegistrationDataDetailProps = {
  requestNo: string;
};

/**
 * @name RegistrationDataDetail
 * @description 관리자 - 등기자료 상세 팝업 (등기관리·배정관리 공통)
 */
export default function RegistrationDataDetail({
  requestNo,
  isDesktop,
}: RegistrationDataDetailProps & ResponsiveType) {
  /* 등기자료 정보 조회 */
  const { data } = useQuery({
    queryKey: ["admin-registration-data", requestNo],
    queryFn: async () => await getRegistrationData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

  return (
    <RegistrationDataView requestNo={requestNo} data={data} variant="admin" isDesktop={isDesktop} />
  );
}
