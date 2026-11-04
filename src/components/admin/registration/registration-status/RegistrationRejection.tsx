"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { Button } from "@components/button";
import { Loading, Typography } from "@components/common";
import { Form, InputField, Label, Select } from "@components/form";
import { RTUN_GB_CD } from "@constants/code";
import { REJECTION_INFORMATION_LIST } from "@constants/information";
import { AD_REGISTRATION } from "@constants/path";
import { useSubmitLock } from "@hooks";
import { getCommonCodeList } from "@services/common";
import { patchRegistrationReject } from "@services/registrationManagement";
import { toastState } from "@stores";
import { ETC_REASON_CODE, getCodeList, getReasonText } from "@utils/codeUtil";

import type { CodeOption } from "@types";

import "@styles/responsive-table.css";

type RegistrationRejectionProps = {
  requestNo: string;
  closeRejectionModal: () => void;
};

export default function RegistrationRejection({
  requestNo,
  closeRejectionModal,
}: RegistrationRejectionProps) {
  const router = useRouter();
  const openToast = useSetAtom(toastState);
  const [selectRejection, setSelectRejection] = useState("");
  const [rejectCodeList, setRejectCodeList] = useState<CodeOption[]>([]);
  const [rejecReason, setRejecReson] = useState("");
  const [isError, setIslError] = useState(false);
  // 중복 제출 방지 (실패 시에만 다시 제출 가능)
  const submitLock = useSubmitLock();

  /* 반려사유 코드 조회 */
  const { data: rejectCodeData } = useQuery({
    queryKey: ["reject-code-list"],
    queryFn: async () => await getCommonCodeList(RTUN_GB_CD),
    select: (response) => response.data?.data?.commCodeList,
    enabled: true,
  });

  /* 반려 처리 */
  const { mutate: registratioinReject, isPending: registrationRejectPending } = useMutation({
    mutationKey: ["registration-reject"],
    // 요청 데이터는 mutate 인자로 직접 받음 (상태를 바꾼 직후 호출해도 항상 방금 만든 값을 전송)
    mutationFn: async (payload: { rqstNo: string; procRsnCnts: string }) =>
      await patchRegistrationReject(payload),
    onSuccess: (res) => {
      if (res.code === "00") {
        openToast({
          message: "반려 처리되었습니다.",
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 고른 사유(기타면 직접 입력한 문구)를 보낼 사유로 변환
    const procRsnCnts = getReasonText(selectRejection, rejectCodeList, rejecReason);
    if (!procRsnCnts) {
      setIslError(true);
      openToast({
        message: "반려 사유를 입력해 주세요.",
        position: "top",
      });
      return;
    }
    setIslError(false);

    if (!submitLock.lock()) return;
    registratioinReject({ rqstNo: requestNo, procRsnCnts });
  };

  /* 반려사유 코드리스트 세팅 */
  useEffect(() => {
    if (!!rejectCodeData) {
      setRejectCodeList(getCodeList(rejectCodeData));
    }
  }, [rejectCodeData]);

  return (
    <>
      {registrationRejectPending && <Loading />}
      <Form
        onSubmit={handleSubmit}
        legendText="반려 사유 선택 양식"
        isHiddenLegend={true}
        className="px-4"
      >
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="reject-progress" required={true} labelText="반려사유" labelSize="md" />
          <Select
            id="reject-progress"
            name="reject-progress"
            selectSize="md"
            placeholder="사유 선택"
            options={rejectCodeList}
            value={selectRejection}
            onChange={(e) => setSelectRejection(e.target.value)}
            isError={isError && !selectRejection}
            required={true}
          />

          {/* 기타(99)를 고르면 사유 직접 입력 */}
          <InputField
            type="text"
            name="rejectEtc"
            className={selectRejection === ETC_REASON_CODE ? "" : "_hidden"}
            defaultValue={""}
            required={selectRejection === ETC_REASON_CODE}
            placeholder={"사유를 입력해 주세요"}
            isError={isError && selectRejection === ETC_REASON_CODE && !rejecReason.trim()}
            inputSize="md"
            onChange={(e) => setRejecReson(e.target.value)}
          />
        </div>

        <ul className="_information-list mt-5 mb-8">
          {REJECTION_INFORMATION_LIST.map((item) => {
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
          <Button shape="solid" size="md" color="grayscale" onClick={closeRejectionModal}>
            취소
          </Button>
          <Button
            type="submit"
            shape="solid"
            size="md"
            color="main100"
            disabled={submitLock.isLocked}
          >
            반려하기
          </Button>
        </div>
      </Form>
    </>
  );
}
