"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LAND_LOT_OPTION } from "@constants/option";
import {
  SUPPLEMENT_REQUEST_INFORMATION_LIST,
  CANCEL_PROGRESS_INFORMATION_LIST,
} from "@constants/information";
import { AD_ASSIGN } from "@constants/path";
import { PROC_CLS_GB_CD, SPPL_REQ_GB_CD } from "@constants/code";
import { FILE_MAXIMUM_NUMBER } from "@constants/file";
import { DatePicker, Loading, Typography } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import {
  CurrencyFormat,
  Form,
  InputField,
  Label,
  Radio,
  Select,
  TextArea,
} from "@components/form";
import { Button } from "@components/button";
import { Modal } from "@components/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUnqRgsrtNo,
  patchAccignmentForm,
  patchRegiCancel,
  patchRegiSupplement,
} from "@services/assignDetail";
import { getCommonCodeList } from "@services/common";
import { getDateString } from "@utils/dateUtil";
import { useDatePicker, useDisclosure, useRadio } from "@hooks";
import { authAtom, toastState } from "@stores";
import { useAtomValue, useSetAtom } from "jotai";
import DaumPostcode from "react-daum-postcode";
import type { AssignDetailForm } from "@types";
import "@styles/responsive-table.css";

interface PostcodeData {
  roadAddress: string;
  buildingName: string;
  jibunAddress: string;
  autoJibunAddress: string;
  // 필요한 속성들 추가
}

interface DefineProps {
  requstNo: string;
  data: tableData;
  realeGbCd: { grpCd: string; code: string; codeNm: string }[];
  membList: { membNo: string; membNm: string; bizNo: string; bizNm: string }[];
  imageList?: (File | string)[];
  isUploadDisabled?: boolean;
  isMaxFileExceeded?: boolean;
  isMaxSizeExceeded?: boolean;
}

type tableData = {
  rqstNo: string;
  execDt: string;
  bndNm: string;
  bndBizNo: string;
};

type ImageSource = "prop" | "api";

interface UploadImage {
  src: string;
  source: ImageSource;
  name?: string; // for "prop"
  attcFilNm?: string; // for "api"
}

type ImageItem = File | UploadImage;

export default function Table({
  requstNo,
  data,
  realeGbCd,
  membList,
  imageList,
  isUploadDisabled,
  isMaxFileExceeded,
  isMaxSizeExceeded,
}: DefineProps) {
  const router = useRouter();
  const authInfo = useAtomValue(authAtom);
  const { ...datePickerProps } = useDatePicker();
  const openToast = useSetAtom(toastState);
  const [price, setPrice] = useState("");
  const [selectSupplementRequest, setSelectedSupplementRequest] = useState("");
  const [selectCancelProgress, setSelectedCancelProgress] = useState("");
  const [radioValue, handleRadio] = useRadio("01");
  const [unqRgstrNo, setUnqRgstrNo] = useState("");
  const [dbtrNM, setDbtrNM] = useState("");
  const [contractDate, setContractDate] = useState<Date | null>();
  const [seDate, setSeDate] = useState("");
  const [lgagDlvrCnts, setLgagDlvrCnts] = useState("");
  const [spplError, setSpplError] = useState(false);
  const [cnclError, setCnclError] = useState(false);
  const [addrError, setAddrError] = useState(false);
  const [unqRgstrNoError, setUnqRgstrNoError] = useState(false);
  const [isPricesError, setIsPricesError] = useState(false);
  const [isDbtrNMError, setIsDbtrNMError] = useState(false);
  const [isContractDateError, setIsContractDateError] = useState(false);
  // const [isSelectLawyer , setIsSelectLawyer] = useState(false);
  const [requestData, setRequestData] = useState<FormData>();
  const [form, setForm] = useState({
    rqstNo: requstNo,
    procRsnCnts: "",
  });
  const [addrForm, setAddrForm] = useState({
    roadAddr: "",
    rdnmAddr: "",
    lotnumAddrCd: "01",
    bldg: "",
    unit: "",
  });
  const [isClient, setIsClient] = useState(false);

  /* 고유번호 리셋 오류로 requstNo props가 바뀔때마다 고유번호 리셋 */
  useEffect(() => {
    if (requstNo) {
      setUnqRgstrNo("");
    }
  }, [requstNo]);

  /* client 사이드인지 체크 */
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    isOpen: isSupplementRequestModalOpen,
    open: openSupplementRequestModal,
    close: closeSupplementRequestModal,
  } = useDisclosure();

  const {
    isOpen: isCancelProgressModalOpen,
    open: openCancelProgressModal,
    close: closeCancelProgressModal,
  } = useDisclosure();

  const {
    isOpen: isOpenSearchAddressModal,
    open: openSearchAddressModal,
    close: closeopenSearchAddressModal,
  } = useDisclosure();

  const thousandSeparator = (event: ChangeEvent<HTMLInputElement>) => {
    let price: string | number = event.target.value;
    price = Number(price.replaceAll(",", ""));
    if (isNaN(price)) {
      setPrice("0");
      setIsPricesError(false); // 필수 인풋 에러 해제
    } else {
      setPrice(price.toLocaleString("ko-KR"));
      setIsPricesError(false); // 필수 인풋 에러 해제
    }
  };

  /* 보완요청 사유 조회 api*/
  const {
    data: spplReqCdData,
    refetch: petchSpplReqCdData,
    isLoading: spplReqCdLoading,
  } = useQuery({
    queryKey: ["search-spplcode"],
    queryFn: async () => await getCommonCodeList(SPPL_REQ_GB_CD),
    select: (response) => response.data,
    enabled: false,
  });

  /* 진행취소 사유 조회 api */
  const {
    data: procCancelCdData,
    refetch: petchProcCancelCdData,
    isLoading: procCancelCdLoading,
  } = useQuery({
    queryKey: ["search-canclecode"],
    queryFn: async () => await getCommonCodeList(PROC_CLS_GB_CD),
    select: (response) => response.data,
    enabled: false,
  });

  /* 고유번호조회 api */
  const {
    data: unqRgstrNoData,
    refetch: getUnqRgstrNoData,
    isFetching: unqRgstrNoDataLoading,
  } = useQuery({
    queryKey: ["search-unqrastrcode", requstNo],
    queryFn: async () => {
      const response = await getUnqRgsrtNo({
        rdnmAddr: addrForm.rdnmAddr,
        lotnumAddrCd: addrForm.lotnumAddrCd,
        bldg: addrForm.bldg,
        unit: addrForm.unit,
      });

      // code가 "99" 일때 토스트팝업
      if (response.code === "99") {
        openToast({
          message: "고유번호 조회에 실패하였습니다. 주소를 다시 확인해 주세요.",
          position: "top",
        });
      }

      return response;
    },
    select: (response) => response,
    enabled: false,
  });

  /* 보완요청 진행요청 api */
  const { mutate: regiSupplement } = useMutation({
    mutationKey: ["registration-supplement", requstNo],
    mutationFn: async () => await patchRegiSupplement(form),
    onSuccess: (res) => {
      if (res.code === "00") {
        // 1. 셀렉트 초기화 & 모달 닫기
        setSelectedSupplementRequest("");
        closeSupplementRequestModal();

        // 2. 토스트팝업 노출 & 배정관리 페이지로 이동
        openToast({
          message: "보완 요청이 완료되었습니다.",
          position: "top",
        });
        router.push(AD_ASSIGN);
      } else {
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  /* 진행취소 진행 요청 api */
  const { mutate: regiCancel } = useMutation({
    mutationKey: ["registration-cancel", requstNo],
    mutationFn: async () => await patchRegiCancel(form),
    onSuccess: (res) => {
      if (res.code === "00") {
        // 1. 셀렉트 초기화 & 모달 닫기
        setSelectedCancelProgress("");
        closeCancelProgressModal();

        // 2. 토스트팝업 노출 & 배정관리 페이지로 이동
        openToast({
          message: "진행취소 상태로 변경되었습니다.",
          position: "top",
        });
        router.push(AD_ASSIGN);
      } else {
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  /* 배정하기 진행요청 api */
  const { mutate: patchAccignmentsubmit } = useMutation({
    mutationKey: ["registration-accignment"],
    mutationFn: async () => await patchAccignmentForm(requestData!),
    onSuccess: (res) => {
      if (res.data.code === "00") {
        // 1. 토스트팝업 노출 & 배정관리 페이지로 이동
        openToast({
          message: "배정이 완료되었습니다.",
          position: "top",
        });
        router.push(AD_ASSIGN);
      } else {
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  /* 보완요청/진행취소/부동산코드 셀렉트 api 데이터 구조 변환 */
  const transformStatusData = (data: { code: string; codeNm: string }[]) => {
    return (data || []).map((item) => ({
      value: item.code,
      label: item.codeNm,
    }));
  };
  /* 법무대리인 셀렉트 api 데이터 구조 변환 */
  const transformListData = (data: { membNo: string; membNm: string }[]) => {
    return (data || []).map((item) => ({
      value: item.membNo,
      label: item.membNm,
    }));
  };

  /* ----- [보완요청 시작] ----- */
  /* 1. 보완요청 버튼 클릭시 api 호출 모달오픈 */
  const searchSpplReqCd = () => {
    petchSpplReqCdData();
    if (!spplReqCdLoading) {
      openSupplementRequestModal();
    }
  };

  /* 2. 보완요청 셀렉트 option data */
  const SUPPLEMENT_REQUEST_OPTION = transformStatusData(
    spplReqCdData?.data?.commCodeList,
  );

  /* 3. 보완요청 셀렉트박스 onChange */
  const handleSupplementChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value;

    setSpplError(false);
    setSelectedSupplementRequest(selectedValue);

    const selectedOption = SUPPLEMENT_REQUEST_OPTION.find(
      (option) => option.value === selectedValue,
    );

    if (selectedOption && selectedValue) {
      setForm((prevForm) => ({
        ...prevForm,
        rqstNo: requstNo,
        procRsnCnts: selectedValue === "99" ? "" : selectedOption?.label, // "99"이면 입력을 기다림, 아니면 선택한 값 저장
      }));
    }
  };

  /* 4. 보완요청 Form onChange */
  const spplFormMonitor = (e: ChangeEvent<HTMLFormElement>) => {
    const targetValue = e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      rqstNo: requstNo,
      procRsnCnts:
        selectSupplementRequest === "99" ? targetValue : prevForm.procRsnCnts, // ✅ "99" 선택 시 입력값 적용
    }));
  };

  /* 5. 보완요청 모달 취소버튼 */
  const handleCloseSpplModal = () => {
    // 폼 값 리셋
    setForm((prevForm) => ({
      ...prevForm,

      procRsnCnts: "", // procRsnCnts 값을 초기화
    }));

    // 셀렉트 박스 값 리셋
    setSelectedSupplementRequest("");

    //에러 true이면 취소시 false
    if (spplError) {
      setSpplError(false);
    }

    // 모달 닫기
    closeSupplementRequestModal();
  };

  /* 6. 보완요청하기 버튼 클릭  */
  const handleRequestSppl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.procRsnCnts) {
      openToast({
        message: "보완요청 사유를 입력해주세요.",
        position: "top",
      });
      setSpplError(true);
      return;
    }

    // 보완요청 api 호출
    regiSupplement();
  };
  /* ----- [보완요청 끝] ----- */

  /* ----- [진행취소 시작] ----- */
  /* 1. 진행취소 버튼 클릭시 api 호출 모달오픈 */
  const searchProcCancelCd = () => {
    petchProcCancelCdData();
    if (!procCancelCdLoading) {
      openCancelProgressModal();
    }
  };

  /* 2. 진행취소 셀렉트 option data */
  const CANCEL_PROGRESS_OPTION = transformStatusData(
    procCancelCdData?.data?.commCodeList,
  );

  /* 3. 진행취소 셀렉트박스 onChange */
  const handleCancelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setCnclError(false);
    setSelectedCancelProgress(selectedValue);

    const selectedOption = CANCEL_PROGRESS_OPTION.find(
      (option) => option.value === selectedValue,
    );

    if (selectedOption && selectedValue) {
      setForm((prevForm) => ({
        ...prevForm,
        rqstNo: requstNo,
        procRsnCnts: selectedValue === "99" ? "" : selectedOption?.label, // "99" 이면 입력을 기다림, 아니면 선택한 값 저장
      }));
    }
  };

  /* 4. 진행취소 Form onChange */
  const cancleFormMonitor = (e: ChangeEvent<HTMLFormElement>) => {
    const targetValue = e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      rqstNo: requstNo,
      procRsnCnts:
        selectCancelProgress === "99" ? targetValue : prevForm.procRsnCnts, // ✅ "99" 선택 시 입력값 적용
    }));
  };

  /* 5. 진행취소 모달 취소버튼 */
  const handleCloseCaclModal = () => {
    // 폼 값 리셋
    setForm((prevForm) => ({
      ...prevForm,
      procRsnCnts: "", // procRsnCnts 값을 초기화
    }));

    // 셀렉트 박스 값 리셋
    setSelectedCancelProgress("");

    //에러 true이면 취소시 false
    if (cnclError) {
      setCnclError(false);
    }

    // 모달 닫기
    closeCancelProgressModal();
  };

  /* 6. 진행취소 요청 */
  const handleRequestCacel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.procRsnCnts === "") {
      openToast({
        message: "진행취소 사유를 입력해주세요.",
        position: "top",
      });
      setCnclError(true);
      return;
    }

    // 진행취소 요청 api 호출
    regiCancel();
  };
  /* ----- [진행취소 끝] ----- */

  /* 부동산구분코드 option data */
  const REAL_ESTATE_OPTION = transformStatusData(realeGbCd) || [];

  // selectedRealEstate 초기값 "00"
  const [selectedRealEstate, setSelectedRealEstate] = useState("00");

  const handleCahngeReale = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRealEstate(e.target.value);
  };
  const handleCahngeDbtrNm = (e: ChangeEvent<HTMLInputElement>) => {
    setIsDbtrNMError(false); // 필수 인풋 에러 해제
    setDbtrNM(e.target.value);
  };

  /* 법무대리인 리스트 option data */
  const LAWYER_LIST_OPTION = Array.isArray(membList)
    ? transformListData(membList)
    : []; // membList가 배열인지 확인한 후 호출
  const [selectLawyer, setSelectedLawyer] = useState(
    LAWYER_LIST_OPTION.length > 0 ? LAWYER_LIST_OPTION[0].value : "",
  );

  /* ---- 주소검색 ---- */
  /* 1. 주소검색 Form onChange */
  const addressFormMonitor = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;

    setAddrForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setAddrError(false); // 주소 조회 인풋 에러 해제
  };

  /* 1. 주소검색 api 호출 */
  const handleComplete = (data: PostcodeData) => {
    const roadAddress = `${data?.roadAddress} (${data?.buildingName ?? ""})`; // 도로명 주소
    const rdnmAddress = `${
      !!data?.autoJibunAddress ? data?.autoJibunAddress : data.jibunAddress
    }`; // 지번 주소

    setAddrForm((prevForm) => {
      if (
        prevForm.roadAddr !== roadAddress ||
        prevForm.rdnmAddr !== rdnmAddress
      ) {
        return {
          ...prevForm,
          rdnmAddr: roadAddress,
          roadAddr: rdnmAddress,
        };
      }
      return prevForm;
    });
    setAddrError(false); // 주소 조회 인풋 에러 해제
    closeopenSearchAddressModal(); // 모달 닫기
  };
  /* ---- 주소검색 끝 ---- */

  /* ---- 등기 고유 번호 조회 ---- */
  const handleSearchRgstrNo = () => {
    /* 인풋에러 해제 */
    setAddrError(false);
    setUnqRgstrNoError(false);

    /* lotnumAddrCd에 따라 데이터 체크 */
    const isValidAddrForm = (() => {
      switch (addrForm.lotnumAddrCd) {
        case "01":
          return Object.values(addrForm).every((value) => value !== "");
        case "02":
          return (
            addrForm.roadAddr !== "" &&
            addrForm.rdnmAddr !== "" &&
            addrForm.bldg !== ""
          );
        case "03":
          return (
            addrForm.roadAddr !== "" &&
            addrForm.rdnmAddr !== "" &&
            addrForm.unit !== ""
          );
        case "04":
          return addrForm.roadAddr !== "" && addrForm.rdnmAddr !== "";
        default:
          return false;
      }
    })();

    if (!isValidAddrForm) {
      setAddrError(true); // 고유번호조회 인풋 에러
      openToast({
        message: "주소를 모두 입력해주세요.",
        position: "top",
      });
      return;
    }
    getUnqRgstrNoData();
  };

  /* 등기고유번호 조회 완료시 setUnqRgstrNo 데이터 set */
  useEffect(() => {
    if (unqRgstrNoData && !unqRgstrNoDataLoading) {
      setUnqRgstrNo(unqRgstrNoData.data);
    }
  }, [unqRgstrNoData, unqRgstrNoDataLoading]);

  /* ---- 등기 고유 번호 조회 끝 ---- */

  /* ---- 설정 약정일 ---- */
  const handleDateChange = (date: Date | null) => {
    const newDate = date;

    const setDate = date ? getDateString(date) : "";

    setContractDate(newDate);
    setSeDate(setDate);
    setIsContractDateError(false); // 필수 인풋 에러 해제
  };

  /* ---- 배정하기 ---- */
  const [assignmentForm, setAssignmentForm] = useState<AssignDetailForm>({
    rqstNo: "",
    dbtrNm: "",
    lotnumAddr: "",
    rdnmAddr: "",
    realeCd: "",
    lotnumAddrCd: "00",
    bldg: "",
    unit: "",
    unqRgstrNo: "",
    bndMaxAmt: 0,
    seDt: "",
    lgagMembNo: "",
    lgagDlvrCnts: "",
  });

  const handleAssignmentForm = async () => {
    /* lotnumAddrCd에 따라 데이터 체크 */
    const isValidAddrForm = (() => {
      switch (addrForm.lotnumAddrCd) {
        case "01":
          return Object.values(addrForm).every((value) => value !== "");
        case "02":
          return (
            addrForm.roadAddr !== "" &&
            addrForm.rdnmAddr !== "" &&
            addrForm.bldg !== ""
          );
        case "03":
          return (
            addrForm.roadAddr !== "" &&
            addrForm.rdnmAddr !== "" &&
            addrForm.unit !== ""
          );
        case "04":
          return addrForm.roadAddr !== "" && addrForm.rdnmAddr !== "";
        default:
          return false;
      }
    })();

    let hasError = false;

    if (!isValidAddrForm) {
      setAddrError(true);
      hasError = true;
    }

    if (!unqRgstrNo) {
      setUnqRgstrNoError(true);
      hasError = true;
    }

    if (!price) {
      setIsPricesError(true);
      hasError = true;
    }

    if (!dbtrNM) {
      setIsDbtrNMError(true);
      hasError = true;
    }

    if (!contractDate) {
      setIsContractDateError(true);
      hasError = true;
    }
    /* TODO : 추후에 법무대리인 필수로 변경 및 주석해제 */
    // if (!selectLawyer) {
    //   setIsSelectLawyer(true); // 필수 인풋 에러
    //   hasError = true;
    // }

    // 하나라도 에러가 있으면 토스트 띄우고 중단
    if (hasError) {
      openToast({
        message: "필수 정보를 전부 입력해 주세요.",
        position: "top",
      });
      return;
    }
    const replaceNum = price.replaceAll(",", "");

    // 1. 업데이트된 form 객체 만들기
    const updatedForm = {
      ...assignmentForm,
      rqstNo: data?.rqstNo ?? "",
      dbtrNm: dbtrNM ?? "",
      lotnumAddr: addrForm?.roadAddr ?? "",
      rdnmAddr: addrForm?.rdnmAddr ?? "",
      realeCd: selectedRealEstate ?? "",
      lotnumAddrCd: addrForm?.lotnumAddrCd ?? "00",
      bldg: addrForm?.bldg ?? "",
      unit: addrForm?.unit ?? "",
      unqRgstrNo: unqRgstrNo ?? "",
      bndMaxAmt: Number(replaceNum) ?? 0,
      seDt: seDate ?? "",
      lgagMembNo: selectLawyer ?? "",
      lgagDlvrCnts: lgagDlvrCnts ?? "",
    };

    // 2. 상태로 저장 (화면 업데이트용)
    setAssignmentForm(updatedForm);

    // 3. FormData 생성 및 JSON 추가
    const formData = new FormData();
    formData.append("req", JSON.stringify(updatedForm));

    // 4. 이미지 추가
    if (imageList) {
      await appendAllImagesToFormData(imageList as ImageItem[], formData);
    }

    // 5. 상태 저장
    setRequestData(formData!);

    // 6. API 호출
  };

  useEffect(() => {
    if (isUploadDisabled && isMaxFileExceeded) {
      openToast({
        message: `최대 ${FILE_MAXIMUM_NUMBER}개까지 업로드할 수 있습니다.`,
        position: "top",
      });
      return;
    }
    if (isUploadDisabled && isMaxSizeExceeded) {
      openToast({
        message: `업로드 가능한 전체 용량은 최대 20MB입니다. 용량을 조정해 주세요.”`,
        position: "top",
      });
      return;
    }
    if (requestData && requestData.has("req")) {
      // 6. API 호출
      patchAccignmentsubmit();
    }
    // 제출용 requestData가 만들어졌을 때만 검증 후 API를 호출합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestData]);

  const appendAllImagesToFormData = async (
    images: ImageItem[],
    formData: FormData,
  ): Promise<void> => {
    const fetchToFile = async (
      src: string,
      name: string,
    ): Promise<File | null> => {
      // 서버 이미지 경로(/files/images/)는 다시 받지 않음
      if (src.includes("/files/images/")) {
        return null;
      }

      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error("Fetch 실패");

        const blob = await res.blob();
        if (blob.size === 0) throw new Error("빈 이미지");

        return new File([blob], name, { type: blob.type });
      } catch (e) {
        console.error("이미지 변환 실패:", src, e);
        return null;
      }
    };

    for (const image of images) {
      if (image instanceof File) {
        if (image.size > 0) {
          formData.append("multipartFiles", image, image.name);
        }
        continue;
      }

      if (!image?.src) continue;

      const name =
        image.source === "api"
          ? image.attcFilNm || "api.jpg"
          : image.name || "image.jpg";

      const file = await fetchToFile(image.src, name);
      if (file) {
        formData.append("multipartFiles", file);
      }
    }
  };
  /* ---- 배정하기 끝 ---- */

  return (
    <>
      {unqRgstrNoDataLoading && <Loading />}
      <div className="pl-10">
        <div className="_responsive-table-inner-wrapper _no-thead _admin">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">
              전자등기 배정 표
            </caption>
            <tbody>
              <tr>
                <th>
                  <Typography kind="title-small">의뢰번호</Typography>
                </th>
                <td colSpan={5}>
                  <Typography kind="title-small">{data?.rqstNo}</Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography kind="title-small">대출실행일</Typography>
                </th>
                <td colSpan={2}>
                  <Typography kind="title-small">{data?.execDt}</Typography>
                </td>
                <td colSpan={3}></td>
              </tr>
              <tr>
                <th>
                  <Typography kind="title-small">채권자</Typography>
                </th>
                <td colSpan={2}>
                  <Typography kind="title-small">{data?.bndNm}</Typography>
                </td>
                <th>
                  <Label htmlFor="dbtr-nm" required={true} labelText="채무자" />
                </th>
                <td colSpan={2}>
                  <InputField
                    name="dbtrNm"
                    defaultValue={dbtrNM}
                    htmlFor="dbtr-nm"
                    type="text"
                    inputSize="sm"
                    placeholder="채무자 입력"
                    onChange={(e) => handleCahngeDbtrNm(e)}
                    isError={isDbtrNMError}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <Label
                    htmlFor="reale-cd"
                    required={true}
                    labelText="부동산구분"
                  />
                </th>
                <td colSpan={2}>
                  <Select
                    id="reale-cd"
                    name="reale-cd"
                    selectSize="sm"
                    options={REAL_ESTATE_OPTION}
                    value={selectedRealEstate}
                    onChange={(e) => handleCahngeReale(e)}
                    isError={false}
                  />
                </td>
                <td colSpan={3}></td>
              </tr>
              <tr>
                <th>
                  <Label
                    htmlFor="lotnum"
                    required={true}
                    labelText="담보목적물"
                  />
                </th>
                <td colSpan={5}>
                  <span className="flex flex-col gap-y-2 w-full">
                    <Form
                      onSubmit={() => {}}
                      legendText="주소검색 양식"
                      isHiddenLegend={true}
                      onChange={(e) => addressFormMonitor(e)}
                      className="flex flex-col gap-y-2 w-full"
                    >
                      <span className="flex max-w-24 mb-4">
                        <Button
                          shape="solid"
                          size="sm"
                          color="main100"
                          onClick={() => openSearchAddressModal()}
                        >
                          주소 검색
                        </Button>
                      </span>
                      <span className="flex items-center gap-x-2 mb-2 w-[500px] [&>span:first-child]:min-w-24">
                        <Typography
                          kind="body-medium"
                          className="text-koser-grayscale-80"
                        >
                          지번 주소
                        </Typography>
                        <InputField
                          name="roadAddr"
                          defaultValue={addrForm.roadAddr}
                          htmlFor="lotnum"
                          type="text"
                          inputSize="sm"
                          placeholder=""
                          isError={addrError}
                          readOnly={true}
                        />
                      </span>
                      <span className="flex items-center gap-x-2 mb-2 w-[500px] [&>span:first-child]:min-w-24">
                        <Typography
                          kind="body-medium"
                          className="text-koser-grayscale-80"
                        >
                          도로명 주소
                        </Typography>
                        <InputField
                          name="rdnmAddr"
                          defaultValue={addrForm.rdnmAddr}
                          htmlFor="roadAddr"
                          type="text"
                          inputSize="sm"
                          placeholder=""
                          isError={addrError}
                          readOnly={true}
                        />
                      </span>
                      <span className="flex items-center gap-x-2 mb-2 [&>span:first-child]:min-w-24">
                        <Typography
                          kind="body-medium"
                          className="text-koser-grayscale-80"
                        >
                          상세 주소
                        </Typography>
                        <ul className="flex gap-x-4 text-sm">
                          {LAND_LOT_OPTION.map((auth) => {
                            const { id, name, value, labelText, disabled } =
                              auth;

                            return (
                              <li key={id}>
                                <Radio
                                  name={name}
                                  value={value}
                                  labelText={labelText}
                                  checked={radioValue === value}
                                  disabled={disabled}
                                  onChange={handleRadio}
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </span>
                      <span className="flex ">
                        {/* 01 , 02 일때 bldg 영역노출 */}
                        {(radioValue === "01" || radioValue === "02") && (
                          <span className="flex items-center gap-x-2 [&>div:first-child]:w-[70%]">
                            <InputField
                              name="bldg"
                              defaultValue={addrForm.bldg}
                              htmlFor=""
                              type="text"
                              inputSize="sm"
                              placeholder=""
                              isError={addrError}
                            />
                            <Typography
                              kind="body-medium"
                              className="text-koser-grayscale-80"
                            >
                              동
                            </Typography>
                          </span>
                        )}
                        {/* 01 , 03 일때 unit 영역노출 */}
                        {(radioValue === "01" || radioValue === "03") && (
                          <span className="flex items-center gap-x-2 [&>div:first-child]:w-[70%]">
                            <InputField
                              name="unit"
                              defaultValue={addrForm.unit}
                              htmlFor=""
                              type="number"
                              inputSize="sm"
                              placeholder=""
                              isError={addrError}
                            />
                            <Typography
                              kind="body-medium"
                              className="text-koser-grayscale-80"
                            >
                              호
                            </Typography>
                          </span>
                        )}
                      </span>
                    </Form>
                  </span>
                </td>
              </tr>
              <tr>
                <th>
                  <Label
                    htmlFor="unq-cd"
                    required={true}
                    labelText="고유번호"
                  />
                </th>
                <td colSpan={3}>
                  <span className="flex gap-x-4 [&>button]:w-[108px] [&>div]:flex-1">
                    <Button
                      shape="solid"
                      size="sm"
                      color="main100"
                      onClick={handleSearchRgstrNo}
                    >
                      고유번호 조회
                    </Button>
                    <InputField
                      type="number"
                      name="unqRgstrNo"
                      value={unqRgstrNo}
                      onChange={(e) => setUnqRgstrNo(e.target.value)}
                      htmlFor="unq-cd"
                      inputSize="sm"
                      placeholder=""
                      isError={unqRgstrNoError}
                    />
                  </span>
                </td>
                <td colSpan={2}></td>
              </tr>
              <tr>
                <th>
                  <Label
                    htmlFor="bnd-max-amt"
                    required={true}
                    labelText="채권최고액"
                  />
                </th>
                <td colSpan={2}>
                  <CurrencyFormat
                    id="bnd-max-amt"
                    name="price"
                    value={price!}
                    onChange={thousandSeparator}
                    placeholder="채권최고액 입력"
                    inputSize="sm"
                    isError={isPricesError}
                  />
                </td>
                <td colSpan={3}></td>
              </tr>
              <tr>
                <th>
                  <Label
                    htmlFor="se-dt"
                    required={true}
                    labelText="설정약정일"
                  />
                </th>
                <td colSpan={2}>
                  <DatePicker
                    id="se-dt"
                    {...datePickerProps}
                    handleDatePicker={handleDateChange}
                    startDate={contractDate!}
                    isError={isContractDateError}
                  />
                </td>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="_responsive-table-inner-wrapper _no-thead _admin mt-6 mb-8">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">
              법무대리인, 제출 담당자 표
            </caption>
            <tbody>
              <tr>
                <th>
                  <Label
                    htmlFor="reale-cd"
                    required={false}
                    labelText="법무대리인"
                  />
                </th>
                <td colSpan={2}>
                  <Select
                    id="reale-cd"
                    name="reale-cd"
                    selectSize="sm"
                    placeholder="법무대리인 선택"
                    options={LAWYER_LIST_OPTION}
                    value={selectLawyer}
                    onChange={(e) => setSelectedLawyer(e.target.value)}
                    // isError={isError}  TODO : 추후에 법무대리인 필수로 변경시 주석해제
                  />
                </td>
                <td colSpan={3}></td>
              </tr>
              <tr>
                <th>
                  <Typography kind="title-small">제출 담당자</Typography>
                </th>
                <td colSpan={2}>
                  {isClient && (
                    <Typography kind="title-small">
                      {authInfo?.membNm}
                    </Typography>
                  )}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="h-32 [&>label>textarea]:p-4 [&>label>textarea]:rounded-lg [&>label>textarea]:text-base [&>label>textarea]:text-koser-grayscale-80">
          <TextArea
            name="lgagDlvrCnts"
            isError={false}
            placeholder="법무대리인에게 전달사항이 있는 경우 작성해 주세요"
            defaultValue={""}
            onChange={(e) => setLgagDlvrCnts(e.target.value)}
          />
        </div>
        {isOpenSearchAddressModal && (
          <Modal
            title="주소검색"
            size="md"
            onClose={closeopenSearchAddressModal}
          >
            <DaumPostcode onComplete={handleComplete} />
          </Modal>
        )}

        <Grid className="_without-padding flex mt-16 [&>div]:flex">
          <GridItem
            desktop={10}
            tablet={6}
            mobile={12}
            className="justify-center gap-x-3 [&>button]:w-1/3"
          >
            <Button
              shape="solid"
              size="lg"
              color="main100"
              onClick={handleAssignmentForm}
            >
              배정하기
            </Button>
            <Button
              type="button"
              shape="outline"
              size="lg"
              color="main5"
              onClick={() => searchSpplReqCd()}
            >
              보완요청
            </Button>
          </GridItem>
          <GridItem desktop={2} tablet={6} mobile={12}>
            <Button
              type="button"
              shape="solid"
              size="lg"
              color="grayscale"
              onClick={() => searchProcCancelCd()}
            >
              진행취소
            </Button>
          </GridItem>
        </Grid>
      </div>

      {/* 보완요청 모달 */}
      {isSupplementRequestModalOpen && (
        <Modal title="보완요청" size="md" onClose={handleCloseSpplModal}>
          <Form
            onSubmit={handleRequestSppl}
            legendText="보완요청 사유 선택 양식"
            isHiddenLegend={true}
            onChange={(e) => spplFormMonitor(e)}
            className="px-4"
          >
            <div className="flex flex-col gap-y-3">
              <Label
                htmlFor="supplement-request"
                required={true}
                labelText="보완요청 사유"
                labelSize="md"
              />
              <Select
                id="supplement-request"
                name="procRsnCnts"
                selectSize="md"
                placeholder="사유 선택"
                options={SUPPLEMENT_REQUEST_OPTION}
                value={selectSupplementRequest}
                onChange={handleSupplementChange}
                isError={spplError}
                required={true}
              />

              {selectSupplementRequest === "99" && (
                <InputField
                  type="text"
                  name="procRsnCnts"
                  defaultValue={form.procRsnCnts}
                  placeholder={"사유를 입력해 주세요"}
                  isError={spplError}
                  inputSize="md"
                  onChange={() => setSpplError(false)}
                />
              )}
            </div>

            <ul className="_information-list mt-5 mb-8">
              {SUPPLEMENT_REQUEST_INFORMATION_LIST.map((item) => {
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
                onClick={handleCloseSpplModal}
              >
                취소
              </Button>
              <Button type="submit" shape="solid" size="md" color="main100">
                보완 요청하기
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {/* 진행취소 모달 */}
      {isCancelProgressModalOpen && (
        <Modal title="진행취소" size="md" onClose={handleCloseCaclModal}>
          <Form
            onSubmit={handleRequestCacel}
            legendText="취소 사유 선택 양식"
            isHiddenLegend={true}
            onChange={(e) => cancleFormMonitor(e)}
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
                options={CANCEL_PROGRESS_OPTION}
                value={selectCancelProgress}
                onChange={handleCancelChange}
                isError={cnclError}
                required={true}
              />

              {selectCancelProgress === "99" && (
                <InputField
                  type="text"
                  name="procRsnCnts"
                  defaultValue={form.procRsnCnts}
                  placeholder={"사유를 입력해 주세요"}
                  isError={cnclError}
                  onChange={() => setCnclError(false)}
                  inputSize="md"
                />
              )}
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
                onClick={handleCloseCaclModal}
              >
                취소
              </Button>
              <Button type="submit" shape="solid" size="md" color="main100">
                진행 취소하기
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
}
