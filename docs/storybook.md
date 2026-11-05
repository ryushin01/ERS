# Storybook

`src`의 **모든 컴포넌트(111개)와 404 화면에 스토리**가 있습니다. 스토리 파일은 대상 파일 옆에 `*.stories.tsx`로 둡니다. 예: `src/components/button/Button.tsx` → `src/components/button/Button.stories.tsx`

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
  - `main.ts`: 스토리 위치, 애드온(Docs, Accessibility, Vitest), 파비콘 경로 (`public`은 프레임워크가 자동으로 복사)
- 첫 화면은 소개 문서(`src/stories/Introduction.mdx`)입니다. 컴포넌트 주석은 `@description` 내용만 문서에 표시합니다.
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
  - `pnpm run dev`에서는 버튼이 Storybook 개발 서버(`http://localhost:6006`)로 연결됩니다. `pnpm run storybook`을 함께 실행해 두세요. (도착 애니메이션은 같은 주소로 배포했을 때만 나옵니다)
- 로그인 화면의 **Storybook 바로 가기**(`src/components/login/StorybookLink.tsx`)를 누르면 다음 순서로 화면이 바뀝니다. (약 1.4초)
  1. 버튼 위치에서 남색 원이 화면 전체로 펼쳐집니다.
  2. 흩어져 있던 컴포넌트 조각 12개가 날아와 격자로 맞춰집니다. (흰 조각 3개와 노란 원은 로고의 "E"와 도장)
  3. 격자가 커지며 사라지고 Storybook으로 이동합니다.
  4. Storybook에서는 남색 화면이 가운데로 오므라들며 문서가 드러납니다. (`.storybook/manager-head.html`)
- 새 탭 열기(⌘/Ctrl/Shift 클릭)는 브라우저 기본 동작을 따르고, OS의 **동작 줄이기**(prefers-reduced-motion) 설정이면 애니메이션 없이 바로 이동합니다.
