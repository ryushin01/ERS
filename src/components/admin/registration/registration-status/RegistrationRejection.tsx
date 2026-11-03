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
import { getCommonCodeList } from "@services/common";
import { patchRegistrationReject } from "@services/registrationManagement";
import { toastState } from "@stores";
import { getCodeList } from "@utils/codeUtil";

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [form, setForm] = useState({
    rqstNo: requestNo,
    procRsnCnts: "",
  });

  /* 반려사유 코드 조회 */
  const { data: rejectCodeData } = useQuery({
    queryKey: ["reject-code-list"],
    queryFn: async () => await getCommonCodeList(RTUN_GB_CD),
    select: (response) => response.data?.data?.commCodeList,
    enabled: true,
  });

  /* 반려 처리 */
  const { mutate: registratioinReject, isPending: registrationRejectPending } =
    useMutation({
      mutationKey: ["registration-reject"],
      mutationFn: async () => await patchRegistrationReject(form),
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
        }
      },
      onError: (error) => {
        console.error(error);
        setIsButtonDisabled(false);
      },
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      (selectRejection === "" || selectRejection === "99") &&
      rejecReason.trim() === ""
    ) {
      setIslError(true);
      openToast({
        message: "반려 사유를 입력해 주세요.",
        position: "top",
      });
      return;
    } else if (selectRejection !== "99") {
      const selectedLabel = rejectCodeList.filter((item) =>
        item.value === selectRejection ? item.label : "",
      );

      setForm({ rqstNo: requestNo, procRsnCnts: selectedLabel[0]?.label });
      setIslError(false);
    } else {
      setForm({ rqstNo: requestNo, procRsnCnts: rejecReason });
      setIslError(false);
    }

    setIsButtonDisabled(true);
    registratioinReject();
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
          <Label
            htmlFor="reject-progress"
            required={true}
            labelText="반려사유"
            labelSize="md"
          />
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

          {/* TODO: 기타 선택 시 InputField 노출 필요 */}
          <InputField
            type="text"
            name="rejectEtc"
            className={selectRejection === "99" ? "" : "_hidden"}
            defaultValue={""}
            required={selectRejection === "99"}
            placeholder={"사유를 입력해 주세요"}
            isError={isError && !rejecReason}
            inputSize="md"
            onBlur={(e) => setRejecReson(e.target.value)}
          />
        </div>

        <ul className="_information-list mt-5 mb-8">
          {REJECTION_INFORMATION_LIST.map((item) => {
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
            onClick={closeRejectionModal}
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
            반려하기
          </Button>
        </div>
      </Form>
    </>
  );
}
