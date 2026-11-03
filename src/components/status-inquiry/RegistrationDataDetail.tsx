import { useEffect, useState } from "react";
import { Button } from "@components/button";
import { PROC_STAT_CD } from "@constants/code";
import { ResponsiveType } from "@types";
import {
  getRegistrationInfoData,
  patchRegistrationHold,
} from "@services/request";
import { useQuery, useMutation } from "@tanstack/react-query";
import RegistrationDataView from "@components/registration/RegistrationDataView";
import { getCompareWithToday } from "@utils/dateUtil";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";

type RegistrationDataProps = {
  requestNo: string;
  onClose?: () => void;
};

/**
 * @name RegistrationDataDetail
 * @description 금융기관 - 등기자료 상세 팝업 (진행보류 처리 포함)
 */
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
    <RegistrationDataView
      requestNo={requestNo}
      data={data}
      variant="financial"
      isDesktop={isDesktop}
    >
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
    </RegistrationDataView>
  );
}
