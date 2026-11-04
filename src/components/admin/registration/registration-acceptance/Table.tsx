"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { RegistrationAcceptanceProps } from "@components/admin/registration/registration-acceptance/List";
import RegistrationInformation from "@components/admin/registration/registration-detail/RegistrationInformation";
import RegistrationRejection from "@components/admin/registration/registration-status/RegistrationRejection";
import { Button } from "@components/button";
import { Loading, Typography } from "@components/common";
import { Modal } from "@components/modal";
import { AD_REGISTRATION } from "@constants/path";
import { useDisclosure } from "@hooks";
import {
  getRegistrationAcceptData,
  patchRegistrationApproval,
} from "@services/registrationManagement";
import { toastState } from "@stores";
import { ResponsiveType } from "@types";
import { getDetailAddress, getManagerInfo } from "@utils/stringUtil";

import "@styles/responsive-table.css";

export default function Table({
  requestNo,
  isDesktop,
}: RegistrationAcceptanceProps & ResponsiveType) {
  const openToast = useSetAtom(toastState);
  const router = useRouter();

  const [isApprovalDisabled, setIsApprovalDisabled] = useState(false);

  const {
    isOpen: isRegistrationInformationModalOpen,
    open: openRegistrationInformationModal,
    close: closeRegistrationInformationModal,
  } = useDisclosure();

  const {
    isOpen: isRejectionModalOpen,
    open: openRejectionModal,
    close: closeRejectionModal,
  } = useDisclosure();

  const { data: data, isLoading: registrationDetailLoading } = useQuery({
    queryKey: ["admin-registration-acceptance", requestNo],
    queryFn: async () => await getRegistrationAcceptData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

  /* 등기접수 정보 등록 */
  const { mutate: mutatePatchRegistrationApproval, isPending: patchRegistrationApprovalLoading } =
    useMutation({
      mutationKey: ["request-upload"],
      mutationFn: async () => await patchRegistrationApproval(requestNo),
      onSuccess: (response) => {
        if (response.data.code === "00") {
          handleSuccess();
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const handleApprovalClick = () => {
    setIsApprovalDisabled(true);
    mutatePatchRegistrationApproval();
  };

  /* 등기의뢰 등록 또는 수정 후 성공 처리 */
  const handleSuccess = () => {
    openToast({
      message: "승인 처리되었습니다.",
      position: "top",
      afterFunc: () => {
        router.push(AD_REGISTRATION);
      },
    });
  };

  //등기접수 정보 모달에서 등록 후 데이터 재조회
  const handleCloseModal = () => {
    closeRegistrationInformationModal();
    window.location.reload();
  };

  return (
    <>
      {registrationDetailLoading && patchRegistrationApprovalLoading && <Loading />}
      <div className="pl-10">
        {/* 담보목적물 주소 */}
        <section className="_section">
          <Typography as="h2" kind="title-medium" isBold={true} className="_title">
            담보목적물 주소
          </Typography>
          <div className="_responsive-table-inner-wrapper _no-thead">
            <table className="_responsive-table">
              <caption className="_hidden-table-caption">담보목적물 주소 표</caption>
              <tbody>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      지번
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">{data?.lotnumAddr || "-"}</Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      도로명
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">{data?.rdnmAddr || "-"}</Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      상세주소
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">
                      {getDetailAddress(data?.bldg, data?.unit)}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      고유번호
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">{data?.unqRgstrNo || "-"}</Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 기본정보 */}
        <section className="_section">
          <Typography as="h2" kind="title-medium" isBold={true} className="_title">
            기본정보
          </Typography>
          <div className="_responsive-table-inner-wrapper _no-thead">
            <table className="_responsive-table">
              <caption className="_hidden-table-caption">기본정보 표</caption>
              <tbody>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      의뢰번호
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">{requestNo}</Typography>
                  </td>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      채무자
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">{data?.dbtrNm || "-"}</Typography>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      대출실행일
                    </Typography>
                  </th>
                  <td colSpan={5}>
                    <Typography kind="body-large">{data?.execDt || "-"}</Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 등기접수 정보 */}
        <section className="_section">
          <div className="_addon">
            <Typography as="h2" kind="title-medium" isBold={true} className="_title">
              등기접수 정보
            </Typography>

            <Button
              shape="outline"
              size="sm"
              color="grayscale"
              onClick={openRegistrationInformationModal}
            >
              수정
            </Button>
          </div>
          <div className="_responsive-table-inner-wrapper _no-thead">
            <table className="_responsive-table">
              <caption className="_hidden-table-caption">등기접수 정보 표</caption>
              <tbody>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      관할법원
                    </Typography>
                  </th>
                  <td>
                    <Typography kind="body-large">{data?.judtCourtNm || "-"}</Typography>
                  </td>
                  <td colSpan={4}></td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      등기소
                    </Typography>
                  </th>
                  <td colSpan={5}>
                    <Typography kind="body-large">{data?.regrNm || "-"}</Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      접수번호
                    </Typography>
                  </th>
                  <td colSpan={5}>
                    <Typography kind="body-large">{data?.acptNo || "-"}</Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      조회결과
                    </Typography>
                  </th>
                  <td colSpan={5}>
                    <Typography kind="body-large">{data?.rgstrAcptYn || "-"}</Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 담당자 정보 */}
        <section className="_section">
          <Typography as="h2" kind="title-medium" isBold={true} className="_title">
            담당자 정보
          </Typography>
          <div className="_responsive-table-inner-wrapper _no-thead">
            <table className="_responsive-table">
              <caption className="_hidden-table-caption">담당자 정보 표</caption>
              <tbody>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      금융기관
                    </Typography>
                  </th>
                  <td colSpan={3}>
                    <Typography kind="body-large">
                      {getManagerInfo(data?.bndMembNm, data?.bndMembHpno)}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      법무대리인
                    </Typography>
                  </th>
                  <td colSpan={3}>
                    <Typography kind="body-large">
                      {getManagerInfo(data?.lgagMembNm, data?.lgagMembHpno)}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Typography kind="body-large" isBold={true}>
                      전달사항
                    </Typography>
                  </th>
                  <td colSpan={3}>
                    <Typography kind="body-large">{data?.mngrDlvrCnts}</Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="_flex-center gap-x-3 mt-8 [&>button]:w-[280px]">
            <Button
              shape="solid"
              size="md"
              color="main100"
              onClick={handleApprovalClick}
              disabled={isApprovalDisabled}
            >
              승인하기
            </Button>

            <Button shape="outline" size="md" color="main5" onClick={openRejectionModal}>
              반려
            </Button>
          </div>
        </section>
      </div>

      {/* 등기접수 정보 등록 모달 */}
      {isRegistrationInformationModalOpen && (
        <Modal title="등기접수 정보 등록" onClose={closeRegistrationInformationModal}>
          <RegistrationInformation
            requestNo={requestNo}
            isDesktop={isDesktop}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
      {/* 반려 모달 */}
      {isRejectionModalOpen && (
        <Modal title="반려" size="md" onClose={closeRejectionModal}>
          <RegistrationRejection requestNo={requestNo} closeRejectionModal={closeRejectionModal} />
        </Modal>
      )}
    </>
  );
}
