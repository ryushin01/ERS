import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogoutIcon } from "@icons14";
import { MenuIcon } from "@icons24";
import { MEMB_GB_CD, MembGbCd } from "@constants/auth";
import { appURI, isDemoMode } from "@constants/env";
import { AD_REGISTRATION, STATUS_INQUIRY } from "@constants/path";
import { DownArrowIcon, UpArrowIcon } from "@icons32";
import { AccountLayer, ImageWithAuth } from "@components/common";
import { Button, IconButton } from "@components/button";
import { Form, SearchInput } from "@components/form";
import { Drawer } from "@components/drawer";
import { Typography } from "@components/common";
import { useDisclosure, useResponsive } from "@hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postLogout } from "@services/login";
import { axiosBasicInstance } from "@services";
import { authAtom, toastState } from "@stores";
import { useAtomValue, useSetAtom } from "jotai";
import {
  getProfileData,
  getSearchAdminRgstData,
  getSearchBankRgstData,
} from "@services/home";
import Cookies from "js-cookie";

/**
 * @name HeaderRightArea
 * @version 1.0.1
 * @author 류창선 <ryushin0167@gmail.com>
 */

/**
 * @name membGbCd(사용자구분코드)
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * 00 : 금융기관
 * 10 : 법무대리인
 * 20 : 관리자
 */

export default function HeaderRightArea() {
  const router = useRouter();
  const authInfo = useAtomValue(authAtom);
  const openToast = useSetAtom(toastState);
  const { isDesktop } = useResponsive();
  const [searchRqstNo, setSearchRqstNo] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  // const [rqstNo, setRqstNo] = useState("");
  // const [execDt, setExecDt] = useState("");

  const {
    isOpen: isDropdownOpen,
    open: openDropdown,
    close: closeDropdown,
  } = useDisclosure();

  const {
    isOpen: isDrawerOpen,
    open: openDrawer,
    close: closeDrawer,
  } = useDisclosure();

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useDisclosure();

  // 사용자 구분 코드 (00 : 금융기관 / 10 : 법무 대리인 / 20 : 관리자)
  const level: MembGbCd = authInfo.membGbCd as MembGbCd;

  /* 로그아웃 api 호출 */
  const { mutate: logoutSend } = useMutation({
    mutationKey: ["log-out"],
    mutationFn: async () => await postLogout(),
    onSuccess: (res) => {
      if (res.data.code === "00") {
        // 1. 세션스토리지 'auth' 삭제
        sessionStorage.removeItem("auth");

        // 2. 쿠키의 사용자 유형 삭제
        Cookies.remove("membGbCd");

        // 3. 인터셉터 Authorization 헤더를 비우도록 처리
        axiosBasicInstance.interceptors.request.use((config) => {
          if (config.headers) {
            delete config.headers.Authorization;
          }
          return config;
        });

        // 4. 1초 후 로그인 페이지 이동
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        // 5. 로그아웃실패시 토스트 팝업 노출 (모바일은 하단에 pc는 상단에 토스트팝업 노출)
        openToast({
          message: "로그아웃에 실패하였습니다.\n다시 시도해 주세요.",
          position: isDesktop ? "top" : "bottom",
        });
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogout = () => {
    // 데모 모드: 로그아웃 API 없이 로그인 정보만 지우고 로그인 화면으로 이동
    if (isDemoMode) {
      sessionStorage.removeItem("auth");
      Cookies.remove("membGbCd");
      router.push("/");
      return;
    }

    logoutSend();
  };

  /* 프로필 조회 api 호출 */
  const { data: profileData, isLoading: profileDataLoading } = useQuery({
    queryKey: ["search-profile"],
    queryFn: async () => await getProfileData(),
    select: (response) => response.data,
    enabled: authInfo?.membGbCd === MEMB_GB_CD.FINANCIAL, // 금융기관일때만 프로필 조회
  });

  /* 금융기관 의뢰번호 조회 api 호출 */
  const {
    //data: searchBnkRqstNo,
    refetch: getSearchBnkRqstNo,
    // isLoading: searchBnkRgstrNoLoading,
  } = useQuery({
    queryKey: ["search-bank-rgstr", searchRqstNo],
    queryFn: async () => {
      const response = await getSearchBankRgstData(searchRqstNo);
      if (response.data) {
        handleSearchSuccess(STATUS_INQUIRY);
      } else {
        handleSearchFail();
      }
      return response;
    },
    select: (response) => response,
    enabled: false,
  });

  /* 관리자 의뢰번호 조회 api 호출 */
  const {
    //data: searchAdmRqstNo,
    refetch: getSearchAdmRqstNo,
    // isLoading: searchAdmRgstrNoLoading,
  } = useQuery({
    queryKey: ["search-admin-rgstr", searchRqstNo],
    queryFn: async () => {
      const response = await getSearchAdminRgstData(searchRqstNo);
      if (response.data) {
        handleSearchSuccess(AD_REGISTRATION);
      } else {
        handleSearchFail();
      }

      return response;
    },
    select: (response) => response,
    enabled: false,
  });

  const handleSearchFail = () => {
    openToast({
      message: "검색결과가 없습니다. 의뢰번호를 다시 확인해 주세요.",
      position: "top",
    });
  };

  const handleSearchSuccess = (movePath: string) => {
    if (movePath === STATUS_INQUIRY) {
      sessionStorage.setItem("bank-rqstno", searchRqstNo);
    } else if (movePath === AD_REGISTRATION) {
      sessionStorage.setItem("admin-rqstno", searchRqstNo);
    }
    window.location.href = `${movePath}`;
  };

  useEffect(() => {
    if (profileData) {
      setImgSrc(profileData?.imgData[0]?.src);
      // setRqstNo(profileData.rqstNo);
      // setExecDt(profileData.execDt);
    }
  }, [profileData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleSearch = () => {
    if (!searchRqstNo) return;

    if (searchRqstNo && searchRqstNo.length < 13) {
      openToast({
        message: "의뢰번호 전체를 입력해주세요.",
        position: "top",
      });
      return;
    }

    // 접속한 멤버가 금융기관일때 의뢰번호 조회 api 호출
    if (authInfo.membGbCd === MEMB_GB_CD.FINANCIAL) {
      getSearchBnkRqstNo();
    }
    // 접속한 멤버가 관리자일때 의뢰번호 조회 api 호출
    else if (authInfo.membGbCd === MEMB_GB_CD.ADMIN) {
      getSearchAdmRqstNo();
    }
  };

  return (
    <div className="_header-right-area">
      {/* NOTE: 금융기관, 관리자 공통 */}
      {level !== MEMB_GB_CD.LAWYER && (
        <Form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          onChange={() => {
          }}
          legendText="의뢰번호 검색"
          isHiddenLegend={true}
        >
          <SearchInput
            name="search"
            shape="xl"
            onClick={handleSearch}
            onBlur={(e) => setSearchRqstNo(e.target.value)}
          />
        </Form>
      )}

      {isDesktop && (
        <>
          {/* profileData : 회원명 */}
          {/* NOTE: 금융기관 */}
          {level === MEMB_GB_CD.FINANCIAL && (
            <button
              type="button"
              onClick={isDesktop ? openDropdown : openDrawer}
              className="flex gap-x-1"
            >
              {!profileDataLoading && (
                <ImageWithAuth
                  src={imgSrc ? `${appURI}/api${imgSrc}` : ""}
                  alt={`${authInfo.membNm} 프로필 이미지`}
                  width={28}
                  height={28}
                />
              )}
              <Typography kind={"title-small"}>{authInfo.membNm}</Typography>
            </button>
          )}

          {/* NOTE: 법무대리인 */}
          {level === MEMB_GB_CD.LAWYER && (
            <>
              <Button
                shape="none"
                size="md"
                color="grayscale"
                icon={
                  <Image
                    src={isDropdownOpen ? UpArrowIcon : DownArrowIcon}
                    alt={
                      isDropdownOpen ? "위 화살표 아이콘" : "아래 화살표 아이콘"
                    }
                    width={32}
                    height={32}
                  />
                }
                iconPosition="right"
                onClick={openDropdown}
              >
                {!!authInfo ? authInfo.membNm : ""}
              </Button>
            </>
          )}

          {/* NOTE: 관리자 */}
          {level === MEMB_GB_CD.ADMIN && (
            <>
              <span> {!!authInfo ? authInfo.membNm : ""}</span>
              <div className="w-[103px]">
                <Button
                  shape="outline"
                  size="sm"
                  color="grayscale"
                  icon={
                    <Image
                      src={LogoutIcon}
                      alt="로그아웃 아이콘"
                      width={14}
                      height={14}
                    />
                  }
                  iconPosition="right"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {!isDesktop && (
        <IconButton
          size="md"
          onClick={openDrawer}
          icon={
            <Image
              src={MenuIcon}
              alt="메뉴 토글 아이콘"
              width={24}
              height={24}
            />
          }
        />
      )}

      {isDesktop && isDropdownOpen && (
        <AccountLayer
          level={level}
          onClose={closeDropdown}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          profileData={!!authInfo ? authInfo.membNm : ""}
          imgSrc={imgSrc!}
        />
      )}

      {!isDesktop && isDrawerOpen && (
        <Drawer
          level={level}
          onClose={closeDrawer}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          profileData={!!authInfo ? authInfo.membNm : ""}
          imgSrc={imgSrc!}
        />
      )}
    </div>
  );
}
