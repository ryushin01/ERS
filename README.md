# ERS - 전자등기 관리 시스템

[![CI](https://github.com/ryushin01/ERS/actions/workflows/ci.yml/badge.svg)](https://github.com/ryushin01/ERS/actions/workflows/ci.yml)
![version](https://img.shields.io/badge/version-2.0.1-113662)
![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?logo=storybook&logoColor=white)

> **ERS**는 **E**lectronic **R**egistration **S**ystem(전자등기 관리 시스템)의 줄임말입니다.

> 금융기관·관리자용 부동산 전자등기 관리 웹 애플리케이션의 프론트엔드입니다.
> 진행이 중단된 프로토타입을 **포트폴리오용 데모**로 정리해 공개한 저장소입니다.
> 실제 서비스의 고객사 정보·연락처·로고·샘플 문서는 제거하거나 예시 값으로 바꾸었고, 화면의 모든 데이터는 가상 데이터입니다.

> 커밋할 때 lint(import 정렬 포함)·타입 검사·단위 테스트가 자동으로 실행되며, 하나라도 실패하면 커밋되지 않습니다. ([커밋 전 검사](#import-순서와-커밋-전-검사) 참고)

### 목차

1. [데모 바로 보기](#데모-바로-보기)
2. [기술 스택](#기술-스택)
3. [시작 가이드](#시작-가이드)
4. [데모 모드](#데모-모드)
5. [Storybook](#storybook)
6. [프로젝트 구조](#프로젝트-구조)
7. [개발 규칙과 테스트](#개발-규칙과-테스트)
8. [CI · Docker](#ci--docker)
9. [에디터 설정](#에디터-설정)
10. [버전 관리](#버전-관리)
11. [향후 과제](#향후-과제)

***

## 데모 바로 보기

1. 개발 서버를 실행합니다. (아래 [시작 가이드](#시작-가이드) 참고)
2. `https://localhost:4000` 에 접속합니다.
   - 로컬 개발용 자체 서명 인증서라 브라우저에 보안 경고가 뜨면 **고급 → localhost(으)로 이동**을 선택하세요.
3. 로그인 화면에서 사용자 유형을 고르고, 아이디·비밀번호 없이 **로그인** 버튼을 누릅니다.
   - **금융기관**(기본 선택) → 금융기관 홈
   - **관리자** → 관리자 첫 화면(배정관리)
   - **법무대리인** → "준비 중" 안내 (미구현)
   - 이미 로그인한 상태에서 로그인 화면에 들어오면 해당 유형의 첫 화면으로 바로 이동합니다. 다른 유형으로 바꾸려면 먼저 로그아웃하세요.
4. 로그인 화면 아래의 **Storybook 바로 가기** 버튼을 누르면 전환 애니메이션과 함께 컴포넌트 문서(Storybook)로 이동합니다. ([Storybook](#storybook) 참고)

**금융기관**

| 메뉴 | 확인할 수 있는 내용 |
|---|---|
| 홈 | 오늘 실행·진행중·접수완료 통계, 실시간 등기현황, 공지사항 |
| 의뢰목록 | 미배정 / 배정완료 / 진행보류 / 진행취소 탭, 보완필요 사유 팝업, 전자등기 의뢰(파일 업로드)·수정 |
| 현황조회 | 의뢰번호·진행상태·접수번호·채무자·기간 검색, 등기자료·등기접수증 팝업 |
| 공지사항 | 목록, 긴급 공지 표시, 첨부파일 다운로드 |
| 계정 메뉴 | 비밀번호 변경, 로그아웃 |

**관리자**

| 메뉴 | 확인할 수 있는 내용 |
|---|---|
| 배정관리 | 미배정 / 배정완료 / 진행보류 / 진행취소 탭, 전자등기 신규 등록, 배정(법무대리인 지정)·보완요청·진행취소 |
| 등기관리 | 진행상태별 탭과 건수, 기간 검색, 등기관리 상세(문서·진행 이력), 접수정보 등록, 등기접수증 승인·반려 |
| 회원관리 / 공지관리 | 미구현 ("서비스 준비 중" 안내) |

> 관리자가 처리한 결과(배정, 보완요청, 승인 등)는 금융기관 화면에도 그대로 반영됩니다. 로그아웃 후 다른 유형으로 로그인해 확인해 보세요.

***

## 기술 스택

![My Skills](https://skillicons.dev/icons?i=react,nextjs,tailwind,js,ts,pnpm,docker,vitest,storybook)

| 구분 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router), React 19, TypeScript |
| 상태·데이터 | TanStack Query v5, jotai, axios |
| 스타일·UI | Tailwind CSS 3, antd(파일 업로드), swiper, react-datepicker |
| 품질 | ESLint(import 정렬), Prettier, husky + lint-staged, Vitest + React Testing Library, fast-check, Storybook 스토리 테스트(Vitest 브라우저 모드 + Playwright, axe 접근성 검사) |
| 문서 | Storybook 10 (`@storybook/nextjs-vite`) |
| 배포 | Docker(standalone), GitHub Actions |

***

## 시작 가이드

### 요구 사항

- Node.js v22 (LTS) — 저장소의 `.nvmrc`에 지정되어 있습니다.
- nvm v0.40.1 이상
- pnpm v9 이상

### 설치 및 실행

```bash
// nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

// Node.js v22 (.nvmrc 기준)
nvm install
nvm use

// pnpm (Node.js 22에 포함된 corepack 사용)
corepack enable pnpm

// package
pnpm install

// run (https://localhost:4000)
pnpm run dev
```

> Next.js 15는 Node.js 18.18 이상, Storybook 10은 Node.js 20.19 이상이 필요합니다. 저장소 기준인 Node.js 22를 사용하세요.

### 주요 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm run dev` | 개발 서버 (HTTPS, 4000번 포트, 로컬 인증서 자동 생성) |
| `pnpm run build` | Storybook 빌드(`public/storybook`) 후 프로덕션 빌드 (`output: "standalone"`) |
| `pnpm run build:app` | Storybook 없이 앱만 빌드 |
| `pnpm run start` | 빌드 결과물 실행 |
| `pnpm run storybook` | Storybook 개발 서버 (`http://localhost:6006`) |
| `pnpm run build-storybook` | Storybook 정적 빌드 (`public/storybook`) |
| `pnpm run lint` | ESLint 검사 |
| `pnpm run lint:fix` | ESLint 자동 수정 (import 순서 정렬 포함) |
| `pnpm run format` | Prettier로 전체 파일 서식 정리 |
| `pnpm run format:check` | 서식이 맞는지만 확인 (CI에서 실행) |
| `pnpm run typecheck` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `pnpm test` | 단위 테스트 (Vitest, jsdom) |
| `pnpm run test:watch` | 단위 테스트 감시 모드 (파일을 저장하면 다시 실행) |
| `pnpm run test:storybook` | 스토리 테스트: 모든 스토리를 실제 브라우저(Chromium)에서 렌더링하고 접근성 검사 (처음 한 번 `pnpm exec playwright install chromium` 필요) |

### 환경 변수

| 변수 | 설명 | 기본값 |
|---|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `false`이면 데모 모드를 끄고 실제 API를 사용합니다. | 미지정 시 데모 모드 |
| `NEXT_PUBLIC_APP_URI` | 금융기관/공통 API 서버 주소 (실제 모드) | - |
| `NEXT_PUBLIC_ADMIN_URI` | 관리자 API 서버 주소 (실제 모드) | - |
| `NEXT_PUBLIC_API_URI` | 외부 API 주소 (실제 모드) | - |
| `NEXT_PUBLIC_SITE_URL` | 배포 주소. 링크 공유 미리보기(OG) 이미지의 절대 URL에 사용 | `http://localhost:4000` |
| `NEXT_PUBLIC_STORYBOOK_URL` | 로그인 화면 **Storybook 바로 가기** 버튼의 이동 주소. Storybook을 다른 주소에 배포했을 때 지정 | `/storybook/index.html` |

실제 모드에서는 `.env.local`(로컬) 또는 `.env.development` / `.env.production`(Docker 빌드)에 값을 설정합니다. `.env*` 파일은 저장소에 포함하지 않습니다.

***

## 데모 모드

백엔드 없이 동작하도록 **데모 모드가 기본으로 켜져 있습니다.**

- **로그인/로그아웃**: API를 호출하지 않고 데모 사용자 정보만 세션에 저장하거나 지웁니다.
- **API 응답**: 공통 axios 인스턴스(`src/services/index.ts`)의 adapter를 목업 어댑터(`src/mocks/adapter.ts`)로 교체합니다. 화면 코드는 실제 모드와 똑같이 동작합니다.
- **목업 데이터**(`src/mocks/data.ts`)
  - 가상 의뢰 24건. 의뢰번호는 `DEMO-00xxxx`, 주소·연락처는 예시 값입니다.
  - 날짜는 **오늘을 기준으로 생성**하므로 언제 실행해도 "오늘 실행 건수" 등이 채워집니다.
  - 데모 중 변경(배정·승인·진행보류 등)은 브라우저 `sessionStorage`에 저장되어 새로고침하거나 사용자 유형을 바꿔도 유지되고, 탭을 닫으면 초기 데이터로 돌아갑니다.
  - 목업이 없는 API는 404로 응답해 기존 오류 처리(토스트) 흐름을 그대로 따릅니다.
- Storybook도 같은 목업 어댑터를 사용하므로, 화면 단위 스토리는 실제 데이터 흐름(TanStack Query → services → 목업 API)으로 렌더링됩니다.

***

## Storybook

`src`의 **모든 컴포넌트(110여 개)에 스토리**가 있습니다. 스토리 파일은 대상 파일 옆에 `*.stories.tsx`로 둡니다. 예: `src/components/button/Button.tsx` → `src/components/button/Button.stories.tsx`

```bash
// 개발 서버 (http://localhost:6006)
pnpm run storybook

// 정적 빌드 (public/storybook)
pnpm run build-storybook
```

### 구성

| 분류 | 내용 |
|---|---|
| Foundations | 타이포그래피 단계 |
| Common · Button · Form · Modal · Drawer · Accordion | 공통 UI 컴포넌트. Controls로 속성(크기·색상·상태)을 바꿔 볼 수 있습니다. |
| Layout · Error · Login | 헤더·메뉴·레이아웃, 오류 화면, 로그인 화면 구성 요소 |
| Financial · Admin · Registration | 업무 화면. 페이지(`Main`)는 헤더·메뉴를 포함한 실제 화면 그대로, 하위 표·팝업은 목업 데이터로 보여 줍니다. |

- 공통 설정은 `.storybook/`에 있습니다.
  - `preview.tsx`: 앱 루트 레이아웃과 같은 환경(QueryClient, jotai, 토스트, `#portal`)을 스토리마다 새로 만듭니다. `parameters.auth`(`"financial"` | `"admin"`)를 지정하면 데모 사용자로 로그인한 상태가 됩니다.
  - `main.ts`: 스토리 위치, 애드온(Docs, Accessibility), 정적 파일 경로
- 스토리용 도우미는 `src/stories/helpers.tsx`에 있습니다. (상태별 목업 의뢰번호, 화면 경로 지정, 모바일 뷰포트, 실제 화면 레이아웃)
- 데이터를 props로 받는 컴포넌트는 스토리의 `loaders`에서 앱과 같은 services 함수로 목업 데이터를 받아 전달합니다.
- 화면 크기별 차이는 툴바의 Viewport(Mobile 375 / Tablet 1024 / Desktop 1440)로 확인합니다.

### 스토리 테스트 (접근성 검사 포함)

- `@storybook/addon-vitest`로 **모든 스토리가 그대로 테스트**가 됩니다. `pnpm run test:storybook`을 실행하면 Vitest 브라우저 모드(Playwright Chromium)에서 스토리를 하나씩 렌더링하고, 렌더링 오류·`play` 함수·접근성 위반(axe)을 검사합니다. Storybook 화면의 테스트 위젯에서도 실행할 수 있습니다.
- 접근성 위반은 경고가 아니라 **실패**로 처리합니다(`.storybook/preview.tsx`의 `a11y: { test: "error" }`). 새 컴포넌트나 색상을 추가할 때 명암 대비(4.5:1)·라벨·ARIA 역할이 맞지 않으면 CI에서 막힙니다.
- 설정: `vitest.config.mts`의 `storybook` 프로젝트, `.storybook/vitest.setup.ts`
- 커밋 전 검사에서는 빠른 단위 테스트(`unit` 프로젝트)만 실행하고, 스토리 테스트는 CI에서 실행합니다.

### 배포와 바로 가기 버튼

- `pnpm run build`가 Storybook을 `public/storybook`에 먼저 빌드하므로, **앱을 배포하면 Storybook도 같은 주소의 `/storybook`으로 함께 배포**됩니다. (Docker 이미지·CI 빌드 포함)
  - `/storybook`으로 들어오면 `/storybook/index.html`로 이동합니다(`next.config.ts`). 로그인 여부와 상관없이 볼 수 있도록 미들웨어에서 제외합니다.
  - 빌드 결과물은 저장소에 포함하지 않습니다(`.gitignore`).
  - `pnpm run dev`에서 버튼을 확인하려면 `pnpm run build-storybook`을 한 번 실행해 두거나, `NEXT_PUBLIC_STORYBOOK_URL=http://localhost:6006`으로 Storybook 개발 서버를 연결합니다.
- 로그인 화면의 **Storybook 바로 가기**(`src/components/login/StorybookLink.tsx`)를 누르면 다음 순서로 화면이 바뀝니다. (약 1.4초)
  1. 버튼 위치에서 남색 원이 화면 전체로 펼쳐집니다.
  2. 흩어져 있던 컴포넌트 조각 12개가 날아와 격자로 맞춰집니다. (흰 조각 3개와 노란 원은 로고의 "E"와 도장)
  3. 격자가 커지며 사라지고 Storybook으로 이동합니다.
  4. Storybook에서는 남색 화면이 가운데로 오므라들며 문서가 드러납니다. (`.storybook/manager-head.html`)
- 새 탭 열기(⌘/Ctrl/Shift 클릭)는 브라우저 기본 동작을 따르고, OS의 **동작 줄이기**(prefers-reduced-motion) 설정이면 애니메이션 없이 바로 이동합니다.

***

## 프로젝트 구조

```
📦 project
├── 🗂️ .husky                                 // 커밋 전 검사 훅 (pre-commit)
├── 🗂️ .github/workflows                      // CI (lint·타입 검사·테스트·빌드, Docker 이미지 빌드)
├── 🗂️ .storybook                             // Storybook 설정 (main, preview, 도착 애니메이션)
├── 🗂️ docker                                 // 개발·운영 Dockerfile, docker-compose
├── 🗂️ public
│ ├── 🗂️ icons                                // svg 아이콘 (logo: 헤더 로고)
│ ├── 🗂️ images                               // 이미지 파일 (logo: 앱 아이콘 PNG)
│ ├── 🗂️ storybook                            // Storybook 빌드 결과물 (빌드 시 생성, 저장소 미포함)
│ └── 🏙️ logo.svg                             // 파비콘 (ERS 심볼)
│
├── 🗂️ src
│ ├── 🗂️ app                                  // 라우팅 관련 파일
│ │   ├── 🗂️ admin                            // 관리자
│ │   │   ├── 🗂️ assign                       // 배정관리
│ │   │   │   ├── 🗂️ assign-create            // 전자등기 신규 등록
│ │   │   │   └── 🗂️ assign-detail
│ │   │   │       └── 🗂️ [rqstNo]             // 전자등기 배정(다이나믹 라우팅 기준: 의뢰번호)
│ │   │   │
│ │   │   ├── 🗂️ registration                 // 등기관리
│ │   │   │   ├── 🗂️ registration-acceptance
│ │   │   │   │   └── 🗂️ [rqstNo]             // 등기접수증 승인(다이나믹 라우팅 기준: 의뢰번호)
│ │   │   │   └── 🗂️ registration-detail
│ │   │   │       └── 🗂️ [rqstNo]             // 등기관리 상세(다이나믹 라우팅 기준: 의뢰번호)
│ │   │   │
│ │   │   ├── 🗂️ member                       // 회원관리 (미구현)
│ │   │   └── 🗂️ notice                       // 공지관리 (미구현)
│ │   │
│ │   ├── 🗂️ financial                        // 금융기관
│ │   │   ├── 🗂️ home                         // 홈
│ │   │   │   └── 🗂️ notice                   // 공지사항
│ │   │   │
│ │   │   ├── 🗂️ request-list                 // 의뢰목록
│ │   │   │   └── 🗂️ request                  // 전자등기 의뢰
│ │   │   │
│ │   │   └── 🗂️ status-inquiry               // (전자등기) 현황조회
│ │   │
│ │   └── 🗂️ lawyer                           // 법무대리인 (미구현)
│ │
│ ├── 🗂️ components                           // 공통·화면 컴포넌트 (각 컴포넌트 옆에 *.stories.tsx)
│ ├── 🗂️ constants                            // 공통 상수값 (경로, API 경로, 코드, 환경 변수, 데모 모드 설정)
│ ├── 🗂️ hooks                                // 공통 커스텀 훅
│ ├── 🗂️ mocks                                // 데모 모드 목업 데이터(data.ts)와 axios 어댑터(adapter.ts)
│ ├── 🗂️ services                             // 각종 API 요청 (공통 axios 인스턴스·인터셉터)
│ ├── 🗂️ stores                               // 전역 상태 관리 대상인 state (jotai)
│ ├── 🗂️ stories                              // 스토리 공통 도우미
│ ├── 🗂️ styles                               // 전역 및 모듈화된 스타일 파일
│ ├── 🗂️ types                                // 공용 타입 (common, file, home, assign)
│ ├── 🗂️ utils                                // 공통 유틸리티 함수
│ └── 📄 middleware.ts                        // 사용자 유형(membGbCd)별 접근 경로 제어
│
├── 📄 eslint.config.mjs                      // ESLint 설정 (import 정렬 규칙 포함)
├── 📄 tailwind.config.ts                     // 디자인 토큰(색상·z-index 등), 공통 클래스(_flex-center) 플러그인
├── 📄 vitest.config.mts                      // 단위 테스트 설정
└── 📄 vitest.setup.ts                        // 단위 테스트 공통 준비 (jest-dom matcher 등)

* 단위 테스트(*.test.ts(x))와 스토리(*.stories.tsx)는 대상 파일과 같은 폴더에 둡니다.
```

***

## 개발 규칙과 테스트

### import 순서와 커밋 전 검사

- import 순서는 ESLint 규칙(`eslint-plugin-simple-import-sort`)으로 정렬합니다. 순서는 `react` → `next` → 외부 패키지 → 내부 alias(`@components`, `@hooks` 등) → 상대 경로 → `import type` → CSS 순이고, 그룹 사이에는 빈 줄을 하나 둡니다.
- `tsconfig.json`에 alias를 추가하면 `eslint.config.mjs`의 `INTERNAL_ALIASES`에도 추가합니다. 그래야 외부 scoped 패키지(`@tanstack/...`)와 구분됩니다.
- 커밋할 때 husky의 pre-commit 훅이 스테이징된 파일에 `eslint --fix`와 `prettier --write`(lint-staged)를 실행하고, 이어서 프로젝트 전체 타입 검사와 단위 테스트를 실행합니다. 훅은 `pnpm install` 시 자동으로 등록됩니다.
- 코드 서식은 저장소의 Prettier 설정(`.prettierrc.json`)을 따릅니다: 큰따옴표, 세미콜론, 한 줄 100자, CSS는 4칸 들여쓰기. 문서(`*.md`)와 빌드 결과물은 제외합니다(`.prettierignore`).

### 코드 규칙

- 화면 크기 구분은 `useResponsive`를 사용합니다. `matchMedia`를 `useSyncExternalStore`로 읽기 때문에 브라우저에서 새로 그리는 화면은 첫 렌더링부터 맞는 레이아웃이 나옵니다. (첫 진입 시 서버 렌더링 결과는 PC 기준이며, 하이드레이션 직후 바뀝니다)
- 접근성: 탭은 `TabGroup`(WAI-ARIA 탭 패턴, ←/→/Home/End 이동), 여러 버튼 중 하나를 고르는 그룹은 `ButtonGroup`(`aria-pressed`)을 사용합니다. 보이는 라벨이 없는 `Select`·`InputField`는 `ariaLabel`을 지정합니다.

- 여러 CSS 파일에서 `@apply`로 쓰는 공통 클래스(`_flex-center`)는 `tailwind.config.ts`의 플러그인에 정의합니다. `globals.css`의 `@layer`에 두면 그 파일이 먼저 처리될 때만 다른 파일에서 `@apply`가 동작합니다.
- 금액 입력은 `utils/amountUtil`로 처리합니다: 원 단위 정수만(부호·소수점·문자 무시), 최대 15자리, 0원은 제출 불가. 저장 요청 버튼은 `useSubmitLock`으로 중복 제출을 막습니다.
- 저장 요청은 보낼 데이터를 `mutate(데이터)`로 직접 넘깁니다. (상태를 바꾼 직후 `mutate()`를 호출하고 `mutationFn`이 상태를 읽으면, 실행 시점에 따라 이전 값이 전송될 수 있음)
- 처리 사유(반려·진행취소·보완요청)에서 "기타"는 코드 `99`이고, 직접 입력한 문구를 보냅니다(`codeUtil.getReasonText`).

### 단위 테스트

- Vitest + React Testing Library(jsdom)를 사용합니다. 설정은 `vitest.config.mts`, `vitest.setup.ts`입니다.
- 테스트 파일은 대상 파일 옆에 `*.test.ts(x)`로 둡니다. 예: `src/utils/pathUtil.ts` → `src/utils/pathUtil.test.ts`

| 종류 | 위치 | 내용 |
|---|---|---|
| 단위 | `utils`, `hooks`, `stores`, `components/button`, `components/modal`, `components/login` | 유틸 함수, 커스텀 훅(화면 크기 판단은 첫 렌더링부터 맞는지 포함), 토스트, Button, 모달 접근성, Storybook 바로 가기(전환 후 이동·중복 클릭·동작 줄이기·새 탭) |
| 라우팅 | `middleware.test.ts` | 사용자 유형별 접근 경로 리다이렉트, Storybook 경로 통과 |
| API 요청 | `services/services.test.ts` | services가 만드는 요청(메서드·주소·쿼리·본문). 검색어에 `&`·`#` 같은 문자가 있어도 그대로 전달되는지 |
| 데모 데이터 | `mocks/data.test.ts`, `mocks/adapter.test.ts` | 목업 데이터가 업무 규칙과 맞는지, 목업 API의 응답·상태 변경 |
| 화면 통합 | `components/**/Main.test.tsx` | 화면을 실제 데이터 흐름(TanStack Query → services → 목업 API)으로 렌더링해 목록·건수가 데이터와 같은지 |
| 폼 → 요청 내용 | `CreateForm`·`DetailForm`·`DesktopFileUploader`·`RegistrationInformation`·`ReasonModals`(반려·진행취소) 테스트 | 폼에 입력하고 제출했을 때 서버로 가는 요청(JSON·첨부 파일)이 입력값과 정확히 같은지, 연속 클릭에도 한 번만 전송되는지 |
| 스토리 | 모든 `*.stories.tsx` (`pnpm run test:storybook`) | 스토리 252개를 실제 브라우저에서 렌더링, 접근성 위반(axe) 0건 |
| 속성 기반 | `utils/amountUtil.test.ts`, `utils/dateUtil.test.ts` | [fast-check](https://fast-check.dev)로 임의 입력 수천 건을 생성해 금액·날짜 변환 규칙이 항상 지켜지는지 (예: 금액 표시 → 숫자 변환 시 원래 값, 모든 시간대에서 같은 날짜) |

- 화면 통합 테스트는 `src/test/renderWithProviders.tsx`(QueryClient·jotai Provider, PC 화면 `matchMedia`)를 쓰고, `next/navigation`은 테스트 파일에서 `vi.mock`으로 대신합니다.
- tsconfig의 alias를 그대로 쓸 수 있습니다(`vite-tsconfig-paths`).
- 서버 코드(`middleware.ts` 등)를 테스트할 때는 파일 맨 위에 `// @vitest-environment node`를 적습니다.
- 테스트는 실행하는 PC의 시간대와 상관없이 같은 결과가 나오도록 작성합니다. 날짜 유틸은 테스트 안에서 여러 시간대(`process.env.TZ`)로 바꿔 가며 확인합니다.

***

## CI · Docker

### CI (GitHub Actions)

`main`에 푸시하거나 PR을 올리면 `.github/workflows/ci.yml`이 실행됩니다.

| 작업 | 내용 |
|---|---|
| Lint · Typecheck · Test · Storybook test · Build | `.nvmrc`의 Node 22와 `packageManager`의 pnpm으로 lint, 서식 검사, 타입 검사, 단위 테스트, 스토리 테스트(Chromium, 접근성 검사), 빌드(Storybook 포함) |
| Docker image | 운영용 Dockerfile로 이미지를 빌드하고, 컨테이너를 실행해 3000번 포트의 앱과 `/storybook/index.html` 응답 확인 |

### Docker

```bash
// 개발 환경 이미지 (3333번 포트)
docker compose -f docker/development/docker-compose.yml up --build

// 운영 환경 이미지 (3000번 포트, Storybook은 /storybook)
docker compose -f docker/production/docker-compose.yml up --build
```

> 베이스 이미지는 `node:22-alpine`입니다(`.nvmrc`와 같은 Node 22 LTS).
> Dockerfile은 빌드 시 `.env.development` / `.env.production`을 복사하므로, Docker로 빌드하려면 해당 파일을 먼저 만들어야 합니다(데모 모드는 빈 파일이면 됩니다). 컨테이너는 standalone 빌드 결과물을 `node server.js`로 실행합니다.

***

## 에디터 설정

> 커밋할 때 lint-staged가 자동으로 정리하므로, 아래 IDE 설정은 저장할 때도 바로 맞추고 싶을 때만 켜면 됩니다. IDE는 프로젝트의 Prettier 패키지(`node_modules/prettier`)와 설정 파일을 쓰도록 지정하세요. import 순서는 ESLint가 정렬합니다.

### ![My Skills](https://skillicons.dev/icons?i=idea)

> ***ESLint***
>
> IntelliJ - 설정 - 언어 및 프레임워크 - JavaScript - 코드 품질 도구 - ESLint - `수동 ESLint 구성` 체크 활성화 - ESLint 패키지 경로 지정 - 구성 파일 경로 지정 -
`저장 시 eslint --fix 실행` 체크 활성화

> ***Prettier***
>
> IntelliJ - 설정 - 플러그인 - Prettier 설치 - 언어 및 프레임워크 - JavaScript - Prettier - `수동 Prettier 구성` 체크 활성화 - Prettier 패키지 경로
> 지정 - `'코드 서식 다시 지정' 액션 시 실행` 체크 활성화 - `저장 시 실행` 체크 활성화

> ***파일 저장 시 자동 코드 정렬 기능 활성화***
>
> IntelliJ - 설정 - 도구 - 저장 시 액션 - `코드 서식 다시 지정` 체크 활성화

> ***주석 태그 활용 및 커밋 옵션 제외 처리***
>
> IntelliJ - 기본 설정 - 설정 - 에디터 - 할일 목록 - 추가 - `NOTE` 패턴 입력 - `색 구성표 TODO 디폴트 색상 사용` 체크 비활성화 - 전경 헥스코드 영역 클릭 - `00a8ff` 헥스
> 코드 입력 후 선택 - 확인 - 적용 - 확인
>
> IntelliJ - 커밋 탭 - 커밋 및 푸시 버튼 우측의 커밋 옵션 표시 - `TODO 확인` 체크 비활성화

### ![My Skills](https://skillicons.dev/icons?i=vscode)

> ***ESLint***
>
> Visual Studio Code - 기본 설정 - 확장 - ESLint 검색 후 설치

> ***Prettier***
>
> Visual Studio Code - 기본 설정 - 확장 - Prettier 검색 후 설치 - 기본 설정 - 설정 - `default formatter` 검색 - 텍스트 편집기 - 셀렉터에서
`Prettier - Code formatter` 선택

> ***파일 저장 시 자동 코드 정렬 기능 활성화***
>
> Visual Studio Code - 기본 설정 - 설정 - `format on save` 검색 - `Editor: Format On Save` 체크 활성화

***

## 버전 관리

| 버전     | 날짜         | 내용                                                           | 비고            |
|--------|------------|--------------------------------------------------------------|---------------|
| v2.0.1 | 2026.11.5. | - 접근성 개선: 탭(WAI-ARIA 탭 패턴·키보드 이동), 조회 기간 버튼(`aria-pressed`), 셀렉트·주소 입력칸 이름, 업로드 영역 버튼 중첩 제거, 명암 대비(오류 빨강·보완필요 노랑·회색 버튼·배지·모바일 메뉴 등)<br>- 스토리 테스트 도입(Vitest 브라우저 모드 + Playwright): 모든 스토리 렌더링·접근성 검사, CI에 추가<br>- 화면 크기 판단(`useResponsive`)을 `useSyncExternalStore`로 변경해 모바일에서 PC 레이아웃이 먼저 그려지던 깜빡임 수정, react-responsive 제거<br>- 의존성 업데이트(같은 메이저 안): React 19.3, TanStack Query 5.104, antd 5.29, jotai 2.20, react-datepicker 8.10, date-fns 4.4 등 | 메이저 업그레이드 없음 |
| v2.0.0 | 2026.11.4. | **포트폴리오 데모 공개**<br>- 코드 정리(타입·버그·Lint), 미사용 코드·의존성 정리, 중복 컴포넌트 통합<br>- 포트폴리오 데모 모드·목업 데이터, 관리자 데모 데이터, 데모 로그인 유형 선택<br>- 공개용 정보 정리<br>- import 순서 자동화, 커밋 전 검사(husky), CI(GitHub Actions)<br>- Vitest 단위·통합·속성 기반 테스트<br>- 보안 취약점 해결(Next.js 15.5, axios, swiper 등)<br>**Storybook·브랜딩**<br>- Storybook 10 도입, 모든 컴포넌트 스토리 작성<br>- Storybook을 앱과 함께 `/storybook`으로 배포, 로그인 화면에 바로 가기 버튼과 전환 애니메이션 추가<br>- ERS 로고(심볼·헤더 로고·파비콘·앱 아이콘) 교체 | 보안 패치 외 라이브러리 버전 변경 없음 (Storybook 신규 추가) |
| v1.0.1 | 2025.5.14. | - 파비콘, 앱 로고 교체                                               | N/A           |
| v1.0.0 | 2025.4.11. | - 프로덕션 레벨 배포                                                 | N/A           |

***

## 향후 과제

![My Skills](https://skillicons.dev/icons?i=cypress,docker,regex,sass)
