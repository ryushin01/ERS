import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { PROC_STAT_CD } from "@constants/code";

import {
  createDocumentSvg,
  dateFromToday,
  NOTICES,
  PROC_STAT_CODE_LIST,
  REGISTRATIONS,
  REQUEST_TAB_STATUS,
} from "./data";

/**
 * @name mockAdapter
 * @description 데모 모드에서 axios 요청을 실제 서버 대신 처리하는 어댑터입니다.
 *              - 화면 코드는 그대로 두고, 공통 axios 인스턴스의 adapter만 교체합니다.
 *              - 등록되지 않은 API는 404로 응답해 기존 오류 처리 흐름을 그대로 따릅니다.
 *              - 데모 중 변경(진행보류 등)은 새로고침 전까지 메모리에만 유지됩니다.
 */

type Body = Record<string, unknown>;
type Handler = (params: URLSearchParams, match: RegExpMatchArray, body: Body) => unknown;
type Route = { method: string; pattern: RegExp; handler: Handler };

const RESPONSE_DELAY_MS = 250;

const ok = (data: unknown = null, msg = "정상 처리되었습니다.") => ({ code: "00", msg, data });

const paginate = <T,>(list: T[], params: URLSearchParams) => {
  const pageNum = Math.max(Number(params.get("pageNum")) || 1, 1);
  const pageSize = Math.max(Number(params.get("pageSize")) || 10, 1);
  return {
    items: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    totalElements: list.length,
    totalPages: Math.max(Math.ceil(list.length / pageSize), 1),
  };
};

const findRegistration = (rqstNo: string | null) =>
  REGISTRATIONS.find((item) => item.rqstNo === rqstNo);

/* 미리보기 이미지 경로 (ImageWithAuth가 `${appURI}/api${src}`로 요청) */
const imageSrc = (rqstNo: string, attcFilCd: string, idx: number) =>
  `/files/preview/${rqstNo}/${attcFilCd}/${idx}`;

const routes: Route[] = [
  /* 공통 */
  {
    method: "get",
    pattern: /^\/api\/comm\/code\/([A-Z_]+)$/,
    handler: (_p, m) =>
      ok({ commCodeList: m[1] === "PROC_STAT_CD" ? PROC_STAT_CODE_LIST : [] }),
  },
  {
    method: "patch",
    pattern: /^\/api\/auth\/password\/change$/,
    handler: () => ok(null, "비밀번호가 변경되었습니다."),
  },
  { method: "get", pattern: /^\/api\/auth\/profile$/, handler: () => ok({ imgData: [] }) },

  /* 금융기관 - 홈 */
  {
    method: "get",
    pattern: /^\/api\/client\/home\/statistics$/,
    handler: () => {
      const today = dateFromToday(0);
      return ok({
        cntExec: REGISTRATIONS.filter((item) => item.execDt === today).length,
        cntProg: REGISTRATIONS.filter((item) =>
          ([PROC_STAT_CD.MATCH, PROC_STAT_CD.EXECUTION, PROC_STAT_CD.REVIEWING] as string[]).includes(item.statCd),
        ).length,
        cntComplete: REGISTRATIONS.filter((item) => item.statCd === PROC_STAT_CD.COMPLET).length,
      });
    },
  },
  {
    method: "get",
    pattern: /^\/api\/client\/home\/registration-list$/,
    handler: () =>
      ok({
        rgstrMasterList: REGISTRATIONS.slice(0, 5).map(({ rqstNo, dbtrNm, lgagMembNm, statNm, acptNo }) => ({
          rqstNo,
          dbtrNm,
          lgagMembNm: lgagMembNm || "-",
          statCdNm: statNm,
          acptNo,
        })),
      }),
  },
  {
    method: "get",
    pattern: /^\/api\/client\/home\/board-list$/,
    handler: () =>
      ok({
        homeBoardListRes: NOTICES.slice(0, 5).map(({ boardTitle, chgDtm, emcyYn }) => ({
          boardTitles: boardTitle,
          crtDtm: chgDtm,
          emcyYn,
        })),
      }),
  },
  {
    method: "get",
    pattern: /^\/api\/client\/board\/list$/,
    handler: (params) => {
      const { items, totalElements, totalPages } = paginate(NOTICES, params);
      return ok({ boardList: items, totalElements, totalPages });
    },
  },

  /* 금융기관 - 의뢰목록 */
  {
    method: "get",
    pattern: /^\/api\/client\/request\/list$/,
    handler: (params) => {
      const statuses = REQUEST_TAB_STATUS[params.get("tabSelection") ?? "00"] ?? [];
      const { items, totalElements, totalPages } = paginate(
        REGISTRATIONS.filter((item) => statuses.includes(item.statCd)),
        params,
      );
      return ok({
        rqstList: items.map(({ rqstNo, execDt, crtDtm, statNm, statCd }) => ({ rqstNo, execDt, crtDtm, statNm, statCd })),
        totalElements,
        totalPages,
      });
    },
  },
  {
    method: "get",
    pattern: /^\/api\/client\/request\/info$/,
    handler: (params) => ok(findRegistration(params.get("rqstno")) ?? null),
  },
  { method: "post", pattern: /^\/api\/client\/request$/, handler: () => ok(null, "제출이 완료되었습니다.") },
  { method: "patch", pattern: /^\/api\/client\/request$/, handler: () => ok(null, "수정이 완료되었습니다.") },

  /* 금융기관 - 전자등기 */
  {
    method: "patch",
    pattern: /^\/api\/client\/registration\/hold$/,
    handler: (_p, _m, body) => {
      const target = findRegistration(String(body.rqstNo ?? ""));
      if (target) {
        target.statCd = PROC_STAT_CD.HOLD;
        target.statNm = "진행보류";
      }
      return ok();
    },
  },
  {
    method: "get",
    pattern: /^\/api\/client\/registration\/(data|accept)$/,
    handler: (params) => ok(findRegistration(params.get("rqstno")) ?? null),
  },
  {
    method: "get",
    pattern: /^\/api\/client\/registration\/search$/,
    handler: (params) => ok(findRegistration(params.get("rqstno"))?.rqstNo ?? null),
  },
  {
    method: "get",
    pattern: /^\/api\/client\/registration\/list$/,
    handler: (params) => {
      const rqstNo = params.get("rqstNo") ?? "";
      const statCd = params.get("statCd") ?? "";
      const acptNo = params.get("acptNo") ?? "";
      const dbtrNm = params.get("dbtrNm") ?? "";
      const fromDate = params.get("fromDate") ?? "";
      const toDate = params.get("toDate") ?? "";
      const dateKey = params.get("searchType") === "RQST" ? "crtDtm" : "execDt";

      const filtered = REGISTRATIONS.filter(
        (item) =>
          (!rqstNo || item.rqstNo.includes(rqstNo)) &&
          (!statCd || item.statCd === statCd) &&
          (!acptNo || item.acptNo.includes(acptNo)) &&
          (!dbtrNm || item.dbtrNm.includes(dbtrNm)) &&
          (!fromDate || item[dateKey] >= fromDate) &&
          (!toDate || item[dateKey] <= toDate),
      );
      const { items, totalElements, totalPages } = paginate(filtered, params);
      return ok({
        rgstrList: items.map(({ rqstNo, crtDtm, execDt, statNm, dbtrNm, statCd, acptNo }) => ({
          rqstNo, crtDtm, execDt, statNm, dbtrNm, statCd, acptNo,
        })),
        totalElements,
        totalPages,
      });
    },
  },

  /* 파일 */
  {
    method: "get",
    pattern: /^\/api\/files\/images$/,
    handler: (params) => {
      const rqstNo = params.get("seq") ?? "";
      const attcFilCd = params.get("attcFilCd") ?? "01";
      const count = attcFilCd === "02" ? 1 : 3;
      return ok({
        // 이 API의 execDt는 YYYYMMDD 형식 (utils/dateUtil.stringToDate 기준)
        execDt: (findRegistration(rqstNo)?.execDt ?? "").replaceAll("-", ""),
        imgData: Array.from({ length: count }, (_, i) => ({
          seq: rqstNo,
          filIdx: String(i + 1),
          src: imageSrc(rqstNo, attcFilCd, i + 1),
          attcFilNm: `${attcFilCd === "02" ? "등기접수증" : "등기자료"}_${i + 1}.svg`,
          filSize: 24000, // 업로드 화면에서 용량 합산에 사용하므로 숫자
        })),
      });
    },
  },
  {
    method: "get",
    pattern: /^\/api\/files\/preview\/([^/]+)\/(\d+)\/(\d+)$/,
    handler: (_p, m) =>
      new Blob([createDocumentSvg(m[2] === "02" ? "등기접수증" : "근저당권 설정계약서", m[1], Number(m[3]))], {
        type: "image/svg+xml",
      }),
  },
  {
    method: "get",
    pattern: /^\/api\/files\/download\/([^/]+)\/([^/]+)$/,
    handler: () =>
      new Blob(["포트폴리오 데모용 첨부파일입니다.\n실제 파일은 제공되지 않습니다.\n"], {
        type: "text/plain;charset=utf-8",
      }),
  },
];

/* baseURL 유무와 관계없이 "/api/..." 경로와 쿼리스트링을 추출 */
const parseRequest = (config: InternalAxiosRequestConfig) => {
  const raw = config.url ?? "";
  const apiIndex = raw.indexOf("/api/");
  const pathWithQuery = apiIndex >= 0 ? raw.slice(apiIndex) : raw;
  const [path, query = ""] = pathWithQuery.split("?");
  const params = new URLSearchParams(query);
  Object.entries(config.params ?? {}).forEach(([key, value]) => params.set(key, String(value)));
  return { path, params };
};

const parseBody = (data: unknown): Body => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return {};
};

export const mockAdapter = (config: InternalAxiosRequestConfig): Promise<AxiosResponse> =>
  new Promise((resolve, reject) => {
    const method = (config.method ?? "get").toLowerCase();
    const { path, params } = parseRequest(config);

    setTimeout(() => {
      for (const route of routes) {
        const match = route.method === method ? path.match(route.pattern) : null;
        if (match) {
          resolve({
            data: route.handler(params, match, parseBody(config.data)),
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
          return;
        }
      }

      const response: AxiosResponse = {
        data: { code: "99", msg: "데모 모드에서 지원하지 않는 API입니다." },
        status: 404,
        statusText: "Not Found",
        headers: {},
        config,
      };
      reject(new AxiosError(`Mock API not found: ${method.toUpperCase()} ${path}`, "ERR_BAD_REQUEST", config, null, response));
    }, RESPONSE_DELAY_MS);
  });
