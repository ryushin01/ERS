import axios from "axios";
import { appURI } from "@constants/env";
// import { useUnauthorizedHandler } from "@hooks/useUnauthorizedHandler";
// import { toastState } from "@stores";
// import { useSetAtom } from "jotai";

/**
 * @name axiosBasicInstance
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description       Axios Instance의 기본형으로, 공통 또는 사용 빈도가 높은 config 옵션 값 적용
 * @baseURL           요청에 사용될 서버 URL 옵션
 * @withCredentials   요청 headers 안에 cookie 포함 가능 처리 옵션
 */
export const axiosBasicInstance = axios.create({
  baseURL: appURI,
  withCredentials: true,
});

// 요청 인터셉터
axiosBasicInstance.interceptors.request.use(
  // 요청 전 작업: 토큰 주입 등
  function(config) {
    if (!config.headers) return config;
    // 스토리지에서 토큰가져오기
    const accessToken = sessionStorage.getItem("auth");
    // const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const parsedAuth = JSON.parse(accessToken);
      if (parsedAuth) {
        // access token을 header에 담아 요청
        config.headers.Authorization = `Bearer ${parsedAuth.accessToken}`;
      }
    } else {
      // accessToken 토큰이 없다면 헤더 제거 (401 에러시)
      delete config.headers["Authorization"];
    }

    return config;
  },
  function(error) {
    // 요청 오류 시 작업
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosBasicInstance.interceptors.response.use(
  function(response) {
    // 정상 응답(200대 Status Code) 시 작업
    // 상태 코드 200인 동시에 서버에서 에러라 판단한 경우
    if (response?.status === 200) {
      if (response?.data.code === "99") {
        //프론트에서 이미 99실패 처리한 로직이 있어 중복 처리 발생 됨. 백엔드 오류 문구 확인 및 프론트 이중처리 테스트 후 처리 가능
        //errorAlert(response?.data.code, response.data.msg);
      }
    }

    return response;
  },
  function(error) {
    // 응답 오류 시 작업
    if (error.response && error.response.status) {
      // 개발 환경에서만 오류 응답 상태와 요청 경로를 출력
      if (process.env.NODE_ENV === "development") {
        console.error(`[API ${error.response.status}]`, error.config?.url);
      }

      switch (error.response.status) {
        // Bad Request: 클라이언트가 올바르지 못한 요청을 보낸 경우
        case 400:
          errorAlert(error.response.status, error.response.data?.msg);
          // 이행되지 않은 Promise 반환으로 Promise Chaining 단절
          return Promise.reject(error);
        // Unauthorized: 인증되지 않은 사용자가 접근한 경우
        case 401:
          errorAlert(
            error.response.status,
            "미인증 사용자 입니다.\n로그인 화면으로 이동 합니다.",
          );
          return Promise.reject(error);

        // 리프레시토큰이 만료된 경우에 세션스토리지 로그인 정보 제거, 토스트팝업 노출 및 로그인화면으로 이동
        // const handleUnauthorizedError = useUnauthorizedHandler();
        // handleUnauthorizedError();

        // return new Promise(() => {});
        // Forbidden: 클라이언트가 콘텐츠에 접근할 권한을 가지고 있지 않을 경우
        case 403:
          errorAlert(error.response.status, "접근 권한이 없습니다.");
          return Promise.reject(error);
        // Not Found: 사용자가 사이트에서 존재하지 않는 URL 탐색했을 경우
        case 404:
          errorAlert(error.response.status, "API를 찾을 수 없습니다.");
          return Promise.reject(error);
        // No Acceptable: HTTP headers의 content-type이 부적절한 경우
        case 406:
          errorAlert(
            error.response.status,
            "HTTP headers의 content-type이 올바르지 않습니다.",
          );
          return Promise.reject(error);
        // Request Timeout: 요청에 응답하는 시간이 오래 걸리는 경우
        case 408:
          errorAlert(
            error.response.status,
            "요청 응답시간이 지연되고 있습니다.",
          );
          return Promise.reject(error);
        // Too Many Requests: 사용자가 지정된 시간에 불필요하게 많은 요청을 보낸 경우
        case 429:
          errorAlert(
            error.response.status,
            "너무 많은 서버 요청이 발생하고 있습니다.",
          );
          return Promise.reject(error);
        // Internal Server Error: 서버 오류
        case 500:
          errorAlert(
            error.response.status,
            "서버 통신 중 장애가 발생하였습니다.",
          );
          return Promise.reject(error);
        default:
          errorAlert(
            error.response.status,
            "서버 통신 중 장애가 발생하였습니다.",
          );
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * @name ApiError
 * @description HTTP 응답 오류. 메시지 형식은 기존과 동일하게 유지하고, 판정용 status 값을 함께 보관합니다.
 */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(`[ERR-${status}] ${message}`);
    this.name = "ApiError";
    this.status = status;
  }
}

// 공통 에러 얼럿 노출 함수
const errorAlert = (status: number, message: string) => {
  throw new ApiError(status, message);
};
