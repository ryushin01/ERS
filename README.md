# 전자등기 관리 시스템 (KOSER)

> 금융기관·관리자용 부동산 전자등기 관리 웹 애플리케이션의 프론트엔드입니다.
> 이 저장소는 **포트폴리오용 데모**로 공개되며, 백엔드 없이 동작하는 데모 모드가 기본으로 켜져 있습니다.
> 로그인 화면에서 **로그인** 버튼만 누르면 금융기관 화면으로 이동합니다.
> 실제 API로 동작시키려면 `NEXT_PUBLIC_DEMO_MODE=false`와 API 주소 환경 변수(`NEXT_PUBLIC_APP_URI` 등)를 설정하세요.
> 실제 서비스의 고객사 정보·연락처·로고·샘플 문서는 제거하거나 예시 값으로 바꾸었습니다.

> 개발 후 반드시 lint 실행(`pnpm lint`)을 통해 `No ESLint warnings or errors` 문구 출력이 확인된 상태에서 소스 코드를 저장소로 올립니다.
***

## 버전 관리

| 버전     | 날짜         | 내용             | 비고  |
|--------|------------|----------------|-----|
| v1.0.0 | 2025.4.11. | - 프로덕션 레벨 배포   | N/A |
| v1.0.1 | 2025.5.14. | - 파비콘, 앱 로고 교체 | N/A |

***

## 시작 가이드

### 요구 사항

- Node.js v22.13.0 (LTS)
- nvm v0.40.1 이상
- pnpm v9 이상

### 설치 및 실행

```bash
// nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

// Node.js v22.13.0 (LTS)
nvm install 22

// pnpm
corepack enable pnpm

// package
pnpm install

// run
pnpm run dev
```

***

## 프로젝트 정보

### 기술 스택

![My Skills](https://skillicons.dev/icons?i=react,nextjs,tailwind,js,ts,pnpm,docker)

### 프로젝트 구조

```
📦 project
├── 🗂️ public
│ ├── 🗂️ icons                                // svg 아이콘
│ └── 🗂️ images                               // 이미지 파일
│ └── 🏙️ logo.svg                             // 파비콘
│
├── 🗂️ src
│ ├── 🗂️ app                                  // 라우팅 관련 파일
│ │   ├── 🗂️ admin                            // 관리자
│ │   │   ├── 🗂️ assign                       // 배정관리
│ │   │   │   ├── 🗂️ assign-create            // 전자등기 신규 등록
│ │   │   │   └── 🗂️ assign-detail    
│ │   │   │       └── 🗂️ [rqstNo]             // 전자등기 배정(다이나믹 라우팅 기준: 의뢰번호)
│ │   │   │
│ │   │   └── 🗂️ registration                 // 등기관리
│ │   │       ├── 🗂️ registration-acceptance       
│ │   │       │   └── 🗂️ [rqstNo]             // 등기접수증 승인(다이나믹 라우팅 기준: 의뢰번호)
│ │   │       └── 🗂️ registration-detail       
│ │   │           └── 🗂️ [rqstNo]             // 등기관리 상세(다이나믹 라우팅 기준: 의뢰번호)
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
│ │   └── 🗂️ temp                             // 임시 파일 모음(패키지 적용 샘플 페이지 등)
│ │
│ ├── 🗂️ components                           // 공통 컴포넌트
│ ├── 🗂️ constants                            // 공통 상수값
│ ├── 🗂️ data                                 // 샘플 데이터
│ ├── 🗂️ hooks                                // 공통 커스텀 훅
│ ├── 🗂️ services                             // 각종 API 요청
│ ├── 🗂️ stores                               // 전역 상태 관리 대상인 state
│ ├── 🗂️ styles                               // 전역 및 모듈화된 스타일 파일
│ ├── 🗂️ types                                // 각종 타입스크립트 타입 정의
│ └── 🗂️ utils                                // 공통 유틸리티 함수
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

![My Skills](https://skillicons.dev/icons?i=cypress,docker,jest,regex,sass)