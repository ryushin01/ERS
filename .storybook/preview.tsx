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

/** JSDoc에서 설명만 남깁니다. (@description 내용은 유지, 그 외 태그와 그 이어지는 줄은 제거) */
function cleanJsDoc(description = "") {
  const kept: string[] = [];
  let isKeeping = true;
  for (const line of description.split("\n")) {
    const tag = line.trim().match(/^@(\w+)\s*(.*)$/);
    if (tag) {
      isKeeping = tag[1] === "description";
      if (isKeeping) kept.push(tag[2].replace(/^-\s*/, ""));
    } else if (isKeeping) {
      kept.push(line.trim().replace(/^-\s*/, ""));
    }
  }
  return kept.join("\n").trim() || null;
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
    docs: {
      // 컴포넌트 주석의 @name·@version·@author·@property 태그는 문서에 그대로 나오면 읽기 어려우므로 설명만 표시합니다.
      extractComponentDescription: (component: { __docgenInfo?: { description?: string } }) =>
        cleanJsDoc(component?.__docgenInfo?.description),
    },
    layout: "padded",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    // 접근성 위반(axe)이 있으면 스토리 테스트를 실패시킵니다. (pnpm test:storybook)
    a11y: { test: "error" },
    options: {
      // 사이드바 순서: Foundations → Components → Patterns → Pages. 그룹 안에서도 부품 → 완성품 순서입니다. (import 관계 기준)
      // 업무 화면은 GNB 메뉴 순서를 따르고, 완성본인 Main을 마지막에 둡니다. Storybook이 정적으로 읽으므로 인라인으로 적습니다.
      storySort: {
        order: [
          "소개",
          "Foundations",
          "Components",
          [
            "Actions",
            ["Button", "IconButton", "ButtonGroup"],
            "Inputs",
            [
              "Label",
              "ErrorMessage",
              "InputMessage",
              "Input",
              "TextArea",
              "Select",
              "SearchInput",
              "CurrencyFormat",
              "DatePicker",
              "Checkbox",
              "Radio",
              "InputField",
              "Form",
            ],
            "Feedback",
            ["Badge", "Loading", "TemporaryLoading", "ToastPopup"],
            "Navigation",
            ["Breadcrumb", "PageIndicator", "Pagination", "TabGroup"],
            "Layout",
            ["Grid", "GridItem"],
            "Content",
            [
              "Frame",
              "ImageWithAuth",
              "SwiperGallery",
              "ResponsiveSwiper",
              "InfoTableSection",
              "AccordionHeader",
              "Accordion",
            ],
            "Overlays",
            ["ModalHeader", "Modal", "DrawerHeader", "DrawerContent", "DrawerFooter", "Drawer"],
          ],
          "Patterns",
          [
            "Error",
            ["Error", "Fallback", "CustomErrorBoundary", "RouteError", "NotFound"],
            "Registration",
            "Login",
            ["LoginNotice", "StorybookLink", "LoginPasswordField", "LoginForm", "LoginSection"],
            "Layout",
            [
              "Provider",
              "Footer",
              "Gnb",
              "AccountLayer",
              "HeaderRightArea",
              "Header",
              "LoginLayout",
              "CommonLayout",
            ],
          ],
          "Pages",
          [
            "Financial",
            [
              "Home",
              ["Banner", "Announcement", "EmptyBox", "RegistrationStatus", "Contents", "Main"],
              "Notice",
              ["List", "Main"],
              "RequestList",
              ["Detail", "Table", "List", "Main"],
              "Request",
              [
                "FileIndicator",
                "DesktopFileList",
                "DesktopFileUploader",
                "MobileFileListItem",
                "MobileFileUploader",
                "Main",
              ],
              "StatusInquiry",
              [
                "RegistrationDataDetail",
                "RegistrationReceiptDetail",
                "Table",
                "FilterTable",
                "List",
                "Main",
              ],
            ],
            "Admin",
            [
              "Assign",
              ["AddressSearchModal", "NotAllottedTable", "Table", "List", "Main"],
              "AssignCreate",
              ["EmptyBox", "ResponsiveSwiper", "CreateForm", "Main"],
              "AssignDetail",
              ["ResponsiveSwiper", "Table", "DetailForm", "Main"],
              "Registration",
              [
                "RegistrationDataDetail",
                "RegistrationReceiptDetail",
                "Table",
                "FilterTable",
                "List",
                "Main",
              ],
              "RegistrationStatus",
              "RegistrationDetail",
              ["RegistrationInformation", "List", "Main"],
              "RegistrationAcceptance",
              ["Table", "List", "Main"],
              "Member",
              "Notice",
            ],
          ],
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
