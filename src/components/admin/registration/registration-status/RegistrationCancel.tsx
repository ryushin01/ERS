"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PROC_CLS_GB_CD } from "@constants/code";
import { CANCEL_PROGRESS_INFORMATION_LIST } from "@constants/information";
import { AD_REGISTRATION } from "@constants/path";
import { Loading, Typography } from "@components/common";
import { Form, InputField, Label, Select } from "@components/form";
import { Button } from "@components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { patchRegiCancel } from "@services/assignDetail";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import { getCodeList } from "@utils/codeUtil";
import { getCommonCodeList } from "@services/common";

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [form, setForm] = useState({
    rqstNo: requstNo,
    procRsnCnts: "",
  });

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

    if (
      (selectCancelProgress === "" || selectCancelProgress === "99") &&
      cancelReason.trim() === ""
    ) {
      setCnclError(true);
      openToast({
        message: "진행취소 사유를 입력해 주세요.",
        position: "top",
      });
      return;
    } else if (selectCancelProgress !== "99") {
      const selectedLabel = cancelCodeList.filter((item) =>
        item.value === selectCancelProgress ? item.label : "",
      );

      setForm({ rqstNo: requstNo, procRsnCnts: selectedLabel[0]?.label });
      setCnclError(false);
    } else {
      setForm({ rqstNo: requstNo, procRsnCnts: cancelReason });
      setCnclError(false);
    }

    setIsButtonDisabled(true);
    // 진행취소 요청 api 호출
    regiCancel();
  };

  /* 진행취소 처리 */
  const { mutate: regiCancel, isPending: registrationCancelPending } =
    useMutation({
      mutationKey: ["registration-cancel"],
      mutationFn: async () => await patchRegiCancel(form),
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
        }
      },
      onError: (error) => {
        console.error(error);
        setIsButtonDisabled(false);
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
          <Label
            htmlFor="cancel-progress"
            required={true}
            labelText="취소사유"
            labelSize="md"
          />
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

          <InputField
            type="text"
            name="rejectEtc"
            className={selectCancelProgress === "99" ? "" : "_hidden"}
            defaultValue={""}
            required={selectCancelProgress === "99"}
            placeholder={"사유를 입력해 주세요"}
            isError={cnclError && !selectCancelProgress}
            inputSize="md"
            onBlur={(e) => setCancelReason(e.target.value)}
          />
        </div>

        <ul className="_information-list mt-5 mb-8">
          {CANCEL_PROGRESS_INFORMATION_LIST.map((item) => {
            const { id, content } = item;

            return (
              <li key={id}>
                <Typography
                  kind="body-medium"
                  className="text-koser-grayscale-90"
                >
                  {content}
                </Typography>
              </li>
            );
          })}
        </ul>

        <div className="flex [&>button:first-child]:flex-2 [&>button:last-child]:flex-3 gap-x-3">
          <Button
            shape="solid"
            size="md"
            color="grayscale"
            onClick={closeCancelProgressModal}
          >
            취소
          </Button>
          <Button
            type="submit"
            shape="solid"
            size="md"
            color="main100"
            disabled={isButtonDisabled}
          >
            진행 취소하기
          </Button>
        </div>
      </Form>
    </>
  );
}
