# 전자등기 관리 시스템 (KOSER)

> 금융기관·관리자용 부동산 전자등기 관리 웹 애플리케이션의 프론트엔드입니다.
> 진행이 중단된 프로토타입을 **포트폴리오용 데모**로 정리해 공개한 저장소입니다.
> 실제 서비스의 고객사 정보·연락처·로고·샘플 문서는 제거하거나 예시 값으로 바꾸었고, 화면의 모든 데이터는 가상 데이터입니다.

> 개발 후 반드시 lint 실행(`pnpm lint`)을 통해 `No ESLint warnings or errors` 문구 출력이 확인된 상태에서 소스 코드를 저장소로 올립니다.
***

## 데모 바로 보기

1. 개발 서버를 실행합니다. (아래 [시작 가이드](#시작-가이드) 참고)
2. `https://localhost:4000` 에 접속합니다.
   - 로컬 개발용 자체 서명 인증서라 브라우저에 보안 경고가 뜨면 **고급 → localhost(으)로 이동**을 선택하세요.
3. 로그인 화면에서 아이디·비밀번호 없이 **로그인** 버튼을 누르면 "데모 금융기관" 사용자로 홈 화면에 들어갑니다.

| 메뉴 | 확인할 수 있는 내용 |
|---|---|
| 홈 | 오늘 실행·진행중·접수완료 통계, 실시간 등기현황, 공지사항 |
| 의뢰목록 | 미배정 / 배정완료 / 진행보류 / 진행취소 탭, 보완필요 사유 팝업, 전자등기 의뢰(파일 업로드)·수정 |
| 현황조회 | 의뢰번호·진행상태·접수번호·채무자·기간 검색, 등기자료·등기접수증 팝업 |
| 공지사항 | 목록, 긴급 공지 표시, 첨부파일 다운로드 |
| 계정 메뉴 | 비밀번호 변경, 로그아웃 |

> 관리자 화면은 데모 데이터를 제공하지 않으며, 데모 로그인은 금융기관 사용자로만 진입합니다.

***

## 데모 모드

백엔드 없이 동작하도록 **데모 모드가 기본으로 켜져 있습니다.**

- **로그인/로그아웃**: API를 호출하지 않고 데모 사용자 정보만 세션에 저장하거나 지웁니다.
- **API 응답**: 공통 axios 인스턴스(`src/services/index.ts`)의 adapter를 목업 어댑터(`src/mocks/adapter.ts`)로 교체합니다. 화면 코드는 실제 모드와 똑같이 동작합니다.
- **목업 데이터**(`src/mocks/data.ts`)
  - 가상 의뢰 24건. 의뢰번호는 `DEMO-00xxxx`, 주소·연락처는 예시 값입니다.
  - 날짜는 **오늘을 기준으로 생성**하므로 언제 실행해도 "오늘 실행 건수" 등이 채워집니다.
  - 진행보류 처리 같은 변경은 새로고침하기 전까지만 유지됩니다.
  - 목업이 없는 API는 404로 응답해 기존 오류 처리(토스트) 흐름을 그대로 따릅니다.

### 환경 변수

| 변수 | 설명 | 기본값 |
|---|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `false`이면 데모 모드를 끄고 실제 API를 사용합니다. | 미지정 시 데모 모드 |
| `NEXT_PUBLIC_APP_URI` | 금융기관/공통 API 서버 주소 (실제 모드) | - |
| `NEXT_PUBLIC_ADMIN_URI` | 관리자 API 서버 주소 (실제 모드) | - |
| `NEXT_PUBLIC_API_URI` | 외부 API 주소 (실제 모드) | - |
| `NEXT_PUBLIC_SITE_URL` | 배포 주소. 링크 공유 미리보기(OG) 이미지의 절대 URL에 사용 | `http://localhost:4000` |

실제 모드에서는 `.env.local`(로컬) 또는 `.env.development` / `.env.production`(Docker 빌드)에 값을 설정합니다. `.env*` 파일은 저장소에 포함하지 않습니다.

***

## 버전 관리

| 버전     | 날짜         | 내용                                                           | 비고            |
|--------|------------|--------------------------------------------------------------|---------------|
| v1.0.0 | 2025.4.11. | - 프로덕션 레벨 배포                                                 | N/A           |
| v1.0.1 | 2025.5.14. | - 파비콘, 앱 로고 교체                                               | N/A           |
| -      | 2026.11.3. | - 코드 정리(타입·버그·Lint)<br>- 포트폴리오 데모 모드·목업 데이터<br>- 공개용 정보 정리 | 라이브러리 버전 변경 없음 |

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

> Next.js 15는 Node.js 18.18 이상이 필요합니다. 그보다 낮은 버전으로는 개발 서버가 실행되지 않습니다.

### 주요 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm run dev` | 개발 서버 (HTTPS, 4000번 포트, 로컬 인증서 자동 생성) |
| `pnpm run build` | 프로덕션 빌드 (`output: "standalone"`) |
| `pnpm run lint` | ESLint 검사 |
| `pnpm run lint:fix` | ESLint 자동 수정 (import 순서 정렬 포함) |
| `pnpm run typecheck` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `pnpm test` | 단위 테스트 (Vitest) |
| `pnpm run test:watch` | 단위 테스트 감시 모드 (파일을 저장하면 다시 실행) |

### import 순서와 커밋 전 검사

- import 순서는 ESLint 규칙(`eslint-plugin-simple-import-sort`)으로 정렬합니다. 순서는 `react` → `next` → 외부 패키지 → 내부 alias(`@components`, `@hooks` 등) → 상대 경로 → `import type` → CSS 순이고, 그룹 사이에는 빈 줄을 하나 둡니다.
- `tsconfig.json`에 alias를 추가하면 `eslint.config.mjs`의 `INTERNAL_ALIASES`에도 추가합니다. 그래야 외부 scoped 패키지(`@tanstack/...`)와 구분됩니다.
- 커밋할 때 husky의 pre-commit 훅이 스테이징된 파일에 `eslint --fix`(lint-staged)를 실행하고, 이어서 프로젝트 전체 타입 검사와 단위 테스트를 실행합니다. 훅은 `pnpm install` 시 자동으로 등록됩니다.

### 단위 테스트

- Vitest + React Testing Library(jsdom)를 사용합니다. 설정은 `vitest.config.mts`, `vitest.setup.ts`입니다.
- 테스트 파일은 대상 파일 옆에 `*.test.ts(x)`로 둡니다. 예: `src/utils/pathUtil.ts` → `src/utils/pathUtil.test.ts`
- tsconfig의 alias를 그대로 쓸 수 있습니다(`vite-tsconfig-paths`).
- 서버 코드(`middleware.ts` 등)를 테스트할 때는 파일 맨 위에 `// @vitest-environment node`를 적습니다.
- 날짜 유틸이 한국 시간 기준이라, 테스트는 시간대를 `Asia/Seoul`로 고정해서 실행합니다.

### Docker

```bash
// 개발 환경 이미지 (3333번 포트)
docker compose -f docker/development/docker-compose.yml up --build

// 운영 환경 이미지 (3000번 포트)
docker compose -f docker/production/docker-compose.yml up --build
```

> Dockerfile은 빌드 시 `.env.development` / `.env.production`을 복사하므로, Docker로 빌드하려면 해당 파일을 먼저 만들어야 합니다. 컨테이너는 standalone 빌드 결과물을 `node server.js`로 실행합니다.

***

## 프로젝트 정보

### 기술 스택

![My Skills](https://skillicons.dev/icons?i=react,nextjs,tailwind,js,ts,pnpm,docker,vitest)

### 프로젝트 구조

```
📦 project
├── 🗂️ docker                                 // 개발·운영 Dockerfile, docker-compose
├── 🗂️ public
│ ├── 🗂️ icons                                // svg 아이콘
│ ├── 🗂️ images                               // 이미지 파일
│ └── 🏙️ logo.svg                             // 파비콘
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
│ ├── 🗂️ components                           // 공통 컴포넌트
│ ├── 🗂️ constants                            // 공통 상수값 (경로, API 경로, 코드, 환경 변수, 데모 모드 설정)
│ ├── 🗂️ data                                 // 샘플 데이터
│ ├── 🗂️ hooks                                // 공통 커스텀 훅
│ ├── 🗂️ mocks                                // 데모 모드 목업 데이터(data.ts)와 axios 어댑터(adapter.ts)
│ ├── 🗂️ services                             // 각종 API 요청 (공통 axios 인스턴스·인터셉터)
│ ├── 🗂️ stores                               // 전역 상태 관리 대상인 state (jotai)
│ ├── 🗂️ styles                               // 전역 및 모듈화된 스타일 파일
│ ├── 🗂️ types                                // 공용 타입 (common, file, home, assign)
│ ├── 🗂️ utils                                // 공통 유틸리티 함수
│ └── 📄 middleware.ts                        // 사용자 유형(membGbCd)별 접근 경로 제어
```

***

## 부가 설정

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

## 향후 과제

![My Skills](https://skillicons.dev/icons?i=cypress,docker,regex,sass)