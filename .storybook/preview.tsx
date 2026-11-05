import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";

import ToastPopup from "@components/common/ToastPopup";
import { DEMO_ADMIN_AUTH, DEMO_FINANCIAL_AUTH } from "@constants/auth";
import { authAtom } from "@stores";

import type { Decorator, Preview } from "@storybook/nextjs-vite";

import "../src/styles/globals.css";

/*
 * 앱의 루트 레이아웃(src/app/layout.tsx)과 같은 환경을 만듭니다.
 * - 모달은 렌더링 중에 #portal을 찾으므로, 스토리보다 먼저 만들어 둡니다.
 * - API 요청은 앱과 같은 공통 axios 인스턴스 → 데모 목업 어댑터로 처리됩니다. (백엔드 없이 실제 데이터 흐름으로 동작)
 */
if (typeof document !== "undefined" && !document.getElementById("portal")) {
  const portal = document.createElement("div");
  portal.id = "portal";
  document.body.appendChild(portal);
}

type AuthParameter = "financial" | "admin" | undefined;

const AUTH_BY_TYPE = {
  financial: DEMO_FINANCIAL_AUTH,
  admin: DEMO_ADMIN_AUTH,
};

/** 스토리마다 새 QueryClient·jotai store를 만들어, 다른 스토리의 캐시·상태가 섞이지 않게 합니다. */
function StoryProviders({ auth, children }: { auth: AuthParameter; children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
      }),
  );
  const [store] = useState(() => {
    const nextStore = createStore();
    if (auth) {
      // 로그인한 사용자 정보가 필요한 화면(헤더·홈 배너 등)을 위해 데모 사용자로 로그인한 상태를 만듭니다.
      sessionStorage.setItem("auth", JSON.stringify(AUTH_BY_TYPE[auth]));
      nextStore.set(authAtom, AUTH_BY_TYPE[auth]);
    }
    return nextStore;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <div id="app">{children}</div>
        <ToastPopup />
      </JotaiProvider>
    </QueryClientProvider>
  );
}

const withProviders: Decorator = (Story, context) => (
  <StoryProviders auth={context.parameters.auth as AuthParameter}>
    <Story />
  </StoryProviders>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    nextjs: { appDirectory: true },
    layout: "padded",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    // 접근성 위반(axe)이 있으면 스토리 테스트를 실패시킵니다. (pnpm test:storybook)
    a11y: { test: "error" },
    options: {
      storySort: {
        order: [
          "소개",
          "Foundations",
          "Common",
          "Button",
          "Form",
          "Modal",
          "Drawer",
          "Accordion",
          "Layout",
          "Error",
          "Login",
          "Financial",
          "Admin",
          "Registration",
        ],
      },
    },
    viewport: {
      options: {
        mobile: { name: "Mobile (375)", styles: { width: "375px", height: "812px" } },
        tablet: { name: "Tablet (1024)", styles: { width: "1024px", height: "768px" } },
        desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" } },
      },
    },
  },
};

export default preview;
