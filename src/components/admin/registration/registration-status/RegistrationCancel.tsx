"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { Button } from "@components/button";
import { Loading, Typography } from "@components/common";
import { Form, InputField, Label, Select } from "@components/form";
import { PROC_CLS_GB_CD } from "@constants/code";
import { CANCEL_PROGRESS_INFORMATION_LIST } from "@constants/information";
import { AD_REGISTRATION } from "@constants/path";
import { useSubmitLock } from "@hooks";
import { patchRegiCancel } from "@services/assignDetail";
import { getCommonCodeList } from "@services/common";
import { toastState } from "@stores";
import { ETC_REASON_CODE, getCodeList, getReasonText } from "@utils/codeUtil";

import type { CodeOption } from "@types";

import "@styles/responsive-table.css";

type RegistrationCancelProps = {
  requstNo: string;
  closeCancelProgressModal: () => void;
};

export default function RegistrationCancel({
  requstNo,
  closeCancelProgressModal,
}: RegistrationCancelProps) {
  const router = useRouter();
  const openToast = useSetAtom(toastState);
  const [selectCancelProgress, setSelectedCancelProgress] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cnclError, setCnclError] = useState(false);
  const [cancelCodeList, setCancelCodeList] = useState<CodeOption[]>([]);
  // 중복 제출 방지 (실패 시에만 다시 제출 가능)
  const submitLock = useSubmitLock();

  /* 진행취소 사유 코드 조회 */
  const { data: cancelCodeData, isLoading: procCancelCdLoading } = useQuery({
    queryKey: ["cancel-code-list"],
    queryFn: async () => await getCommonCodeList(PROC_CLS_GB_CD),
    select: (response) => response.data?.data?.commCodeList,
    enabled: true,
  });

  /* 진행취소 코드리스트 세팅 */
  useEffect(() => {
    if (!!cancelCodeData) {
      setCancelCodeList(getCodeList(cancelCodeData));
    }
  }, [cancelCodeData]);

  /* 진행취소 요청 */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 고른 사유(기타면 직접 입력한 문구)를 보낼 사유로 변환
    const procRsnCnts = getReasonText(selectCancelProgress, cancelCodeList, cancelReason);
    if (!procRsnCnts) {
      setCnclError(true);
      openToast({
        message: "진행취소 사유를 입력해 주세요.",
        position: "top",
      });
      return;
    }
    setCnclError(false);

    if (!submitLock.lock()) return;
    // 진행취소 요청 api 호출
    regiCancel({ rqstNo: requstNo, procRsnCnts });
  };

  /* 진행취소 처리 */
  const { mutate: regiCancel, isPending: registrationCancelPending } = useMutation({
    mutationKey: ["registration-cancel"],
    // 요청 데이터는 mutate 인자로 직접 받음 (상태를 바꾼 직후 호출해도 항상 방금 만든 값을 전송)
    mutationFn: async (payload: { rqstNo: string; procRsnCnts: string }) =>
      await patchRegiCancel(payload),
    onSuccess: (res) => {
      if (res.code === "00") {
        // 토스트팝업 노출 & 등기관리 페이지로 이동
        openToast({
          message: "진행취소 상태로 변경되었습니다.",
          position: "top",
        });

        setTimeout(() => {
          router.push(AD_REGISTRATION);
        }, 3000);
      } else {
        submitLock.unlock();
      }
    },
    onError: (error) => {
      console.error(error);
      submitLock.unlock();
    },
  });

  return (
    <>
      {procCancelCdLoading && registrationCancelPending && <Loading />}
      <Form
        onSubmit={handleSubmit}
        legendText="취소 사유 선택 양식"
        isHiddenLegend={true}
        className="px-4"
      >
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="cancel-progress" required={true} labelText="취소사유" labelSize="md" />
          <Select
            id="cancel-progress"
            name="procRsnCnts"
            selectSize="md"
            placeholder="사유 선택"
            options={cancelCodeList}
            value={selectCancelProgress}
            onChange={(e) => setSelectedCancelProgress(e.target.value)}
            isError={cnclError && !selectCancelProgress}
            required={true}
          />

          {/* 기타(99)를 고르면 사유 직접 입력 */}
          <InputField
            type="text"
            name="rejectEtc"
            className={selectCancelProgress === ETC_REASON_CODE ? "" : "_hidden"}
            defaultValue={""}
            required={selectCancelProgress === ETC_REASON_CODE}
            placeholder={"사유를 입력해 주세요"}
            isError={cnclError && selectCancelProgress === ETC_REASON_CODE && !cancelReason.trim()}
            inputSize="md"
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>

        <ul className="_information-list mt-5 mb-8">
          {CANCEL_PROGRESS_INFORMATION_LIST.map((item) => {
            const { id, content } = item;

            return (
              <li key={id}>
                <Typography kind="body-medium" className="text-ers-grayscale-90">
                  {content}
                </Typography>
              </li>
            );
          })}
        </ul>

        <div className="flex [&>button:first-child]:flex-2 [&>button:last-child]:flex-3 gap-x-3">
          <Button shape="solid" size="md" color="grayscale" onClick={closeCancelProgressModal}>
            취소
          </Button>
          <Button
            type="submit"
            shape="solid"
            size="md"
            color="main100"
            disabled={submitLock.isLocked}
          >
            진행 취소하기
          </Button>
        </div>
      </Form>
    </>
  );
}
