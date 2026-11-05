import { expect, type Page, test } from "@playwright/test";

import { login, measureLayout, settle, type UserType } from "./helpers";

/*
 * 업무 흐름 (데모 목업 기준): 한쪽 사용자가 처리한 결과가 다른 쪽 화면에 반영되는지 확인합니다.
 * 처리 결과는 브라우저 탭의 sessionStorage에 저장되므로, 같은 페이지에서 로그아웃 후 다른 유형으로 로그인합니다.
 */
test.use({ viewport: { width: 1440, height: 1000 } });

const REQUEST_NO = "DEMO-002400"; // 등기의뢰 상태
const SUPPLEMENT_NO = "DEMO-002399"; // 보완필요 상태
const EXECUTION_NO = "DEMO-002397"; // 대출실행 상태

async function logout(page: Page, userType: UserType) {
  if (userType === "financial") {
    await page.locator("._header-right-area").getByText("데모 금융기관").click();
  }
  await page
    .getByRole("button", { name: /로그아웃/ })
    .first()
    .click();
  await page.waitForURL((url) => url.pathname === "/");
}

async function switchUser(page: Page, from: UserType, to: UserType) {
  await logout(page, from);
  await login(page, to);
}

const row = (page: Page, rqstNo: string) => page.locator("tr", { hasText: rqstNo });

/** 다음 달력에서 선택 가능한 날짜를 고릅니다. */
async function pickDate(page: Page, selector: string, nth = 3) {
  await page.locator(selector).click();
  await page
    .locator(
      ".react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)",
    )
    .nth(nth)
    .click();
}

/** 외부 주소 검색(다음 우편번호)을 대신해, 주소를 바로 고르는 버튼을 띄웁니다. */
async function stubAddressSearch(page: Page) {
  await page.route(/postcode.*\.js/, (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.daum = { Postcode: function (options) {
        this.embed = function (element) {
          const button = document.createElement("button");
          button.textContent = "테스트 주소 선택";
          button.onclick = () => options.oncomplete({
            address: "서울특별시 중구 예시로 12",
            roadAddress: "서울특별시 중구 예시로 12",
            jibunAddress: "서울특별시 중구 예시동 101-1",
            autoJibunAddress: "",
            buildingName: "",
            addressType: "R",
            bname: "",
            zonecode: "04500",
          });
          element.appendChild(button);
        };
      } };`,
    }),
  );
}

test("보완요청: 관리자가 요청하면 금융기관 의뢰목록에 보완필요로 표시된다", async ({ page }) => {
  await login(page, "admin");
  await page.goto(`/admin/assign/assign-detail/${REQUEST_NO}`);
  await settle(page);

  await page.getByRole("button", { name: /^보완요청/ }).click();
  const reason = page.getByRole("combobox", { name: /보완요청 사유/ });
  await expect(reason.locator("option")).not.toHaveCount(0);
  await reason.selectOption("01");
  await page.getByRole("button", { name: /^보완 요청하기/ }).click();
  await page.waitForURL(/\/admin\/assign$/);

  await switchUser(page, "admin", "financial");
  await page.goto("/financial/request-list");
  await settle(page);
  await expect(row(page, REQUEST_NO)).toContainText("보완필요");
});

test("신규 의뢰 → 배정: 금융기관 의뢰가 관리자에게 보이고, 배정하면 금융기관에 배정완료로 표시된다", async ({
  page,
}) => {
  await stubAddressSearch(page);
  await login(page, "financial");
  await page.goto("/financial/request-list/request");
  await settle(page);

  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles({
      name: "계약서.png",
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgo=", "base64"),
    });
  await expect(page.getByText("계약서.png")).toBeVisible();
  await pickDate(page, "#desktop-execution-date");
  await page.getByRole("button", { name: /^제출하기/ }).click();
  await page.waitForURL(/\/financial\/request-list$/, { timeout: 15_000 });

  await switchUser(page, "financial", "admin");
  const newRequestNo = "DEMO-002401";
  await page.goto("/admin/assign");
  await settle(page);
  await expect(row(page, newRequestNo)).toContainText("등기의뢰");

  await page.goto(`/admin/assign/assign-detail/${newRequestNo}`);
  await settle(page);
  await page.getByPlaceholder("채무자 입력").fill("테스트 채무자");
  await page.getByRole("button", { name: /^주소 검색/ }).click();
  await page.getByRole("button", { name: "테스트 주소 선택" }).click();
  await page.locator('input[name="bldg"]').fill("101");
  await page.locator('input[name="unit"]').fill("1201");
  await page.getByRole("button", { name: /^고유번호 조회/ }).click();
  await expect(page.locator('input[name="unqRgstrNo"]')).toHaveValue(/^\d{14}$/);
  await page.locator("#bnd-max-amt").fill("250000000");
  await pickDate(page, "#se-dt");
  await page.locator("#lgag-memb-no").selectOption("LAW1");
  await page.getByRole("button", { name: /^배정하기/ }).click();
  await page.waitForURL(/\/admin\/assign$/, { timeout: 15_000 });

  await switchUser(page, "admin", "financial");
  await page.goto("/financial/request-list");
  await settle(page);
  await page.getByRole("tab", { name: /배정완료/ }).click();
  await settle(page);
  await expect(row(page, newRequestNo)).toContainText("배정완료");
});

test("보완 후 재제출: 금융기관이 수정해 제출하면 관리자 목록에 등기의뢰로 돌아간다", async ({
  page,
}) => {
  await login(page, "financial");
  await page.goto(`/financial/request-list/request?requestNo=${SUPPLEMENT_NO}`);
  await settle(page);

  await page.getByRole("button", { name: /^제출하기/ }).click();
  await page.waitForURL(/\/financial\/request-list$/, { timeout: 15_000 });

  await switchUser(page, "financial", "admin");
  await page.goto("/admin/assign");
  await settle(page);
  await expect(row(page, SUPPLEMENT_NO)).toContainText("등기의뢰");
});

test("접수 → 승인: 접수정보를 등록하고 승인하면 금융기관 현황조회에 접수완료로 표시된다", async ({
  page,
}) => {
  await login(page, "admin");
  await page.goto(`/admin/registration/registration-detail/${EXECUTION_NO}`);
  await settle(page);

  await page.getByRole("button", { name: /^등록/ }).click();
  const dialog = page.getByRole("dialog");
  // 상세 정보를 받으면 파일 목록을 초기화하므로, 받은 뒤에 파일을 고릅니다.
  await settle(page);
  const { cutHeaders, cutCells } = await measureLayout(page);
  expect(cutHeaders).toEqual([]);
  expect(cutCells).toEqual([]);
  await dialog.locator("#fileInput").setInputFiles({
    name: "등기접수증.png",
    mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgo=", "base64"),
  });
  await expect(dialog.getByText("등기접수증.png")).toBeVisible();
  await expect(dialog.locator("#court option")).not.toHaveCount(1);
  await dialog.locator("#court").selectOption("02");
  await expect(dialog.locator('#registry-office option[value="0201"]')).toHaveCount(1);
  await dialog.locator("#registry-office").selectOption("0201");
  await dialog.getByPlaceholder("접수번호를 입력해 주세요").fill("12345");
  await dialog.getByPlaceholder(/시스템 관리자에게 전달사항/).fill("원본 확인 완료");
  await dialog.getByRole("button", { name: /^등록/ }).click();
  await expect(dialog).toHaveCount(0, { timeout: 15_000 });

  await page.goto(`/admin/registration/registration-acceptance/${EXECUTION_NO}`);
  await settle(page);
  await page.getByRole("button", { name: /^승인하기/ }).click();
  await expect(page.getByRole("status")).toContainText("승인 처리되었습니다");

  await switchUser(page, "admin", "financial");
  await page.goto("/financial/status-inquiry");
  await settle(page);
  await expect(row(page, EXECUTION_NO)).toContainText("접수완료");
  await expect(row(page, EXECUTION_NO)).toContainText("12345");
});

test("다른 메뉴의 깊은 경로에서도 헤더 검색으로 현황조회에 도착한다", async ({ page }) => {
  await login(page, "financial");
  await page.goto("/financial/request-list/request");

  await page.getByRole("searchbox").fill("DEMO-002400");
  await page.getByRole("searchbox").press("Enter");

  await page.waitForURL("**/financial/status-inquiry");
  await expect(page.getByRole("main").getByText("DEMO-002400").first()).toBeVisible();
  await expect(page.getByRole("main").getByText("DEMO-002399")).toHaveCount(0);
});

test("현황조회에서 의뢰번호와 기간으로 검색한다", async ({ page }) => {
  await login(page, "financial");
  await page.goto("/financial/status-inquiry");
  const main = page.getByRole("main");
  await expect(main.getByText("DEMO-002399").first()).toBeVisible();

  await main.getByPlaceholder("의뢰번호를 입력해 주세요").fill(REQUEST_NO);
  await main.getByRole("button", { name: "검색", exact: true }).click();
  await expect(main.getByText("DEMO-002399")).toHaveCount(0);
  await expect(main.getByText(REQUEST_NO).first()).toBeVisible();

  await main.getByRole("button", { name: "오늘", exact: true }).click();
  await expect(main.getByText(REQUEST_NO).first()).toBeVisible();
});

test("등기관리에서 의뢰번호로 검색한다", async ({ page }) => {
  await login(page, "admin");
  await page.goto("/admin/registration");
  const main = page.getByRole("main");
  await expect(main.getByText("DEMO-002399").first()).toBeVisible();

  await main.getByPlaceholder("의뢰번호를 입력해 주세요").fill(REQUEST_NO);
  await main.getByRole("button", { name: "검색", exact: true }).click();

  await expect(main.getByText("DEMO-002399")).toHaveCount(0);
  await expect(main.getByText(REQUEST_NO).first()).toBeVisible();
});
