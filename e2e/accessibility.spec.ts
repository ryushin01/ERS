import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  collectPageProblems,
  findBrokenImages,
  login,
  measureLayout,
  PAGES,
  settle,
  type UserType,
} from "./helpers";

/*
 * 실제 화면 접근성(axe)과 런타임 오류 검사
 * 스토리는 컴포넌트 단위라 레이아웃 안에서 적용되는 색상 등을 놓칠 수 있어 실제 화면도 검사합니다.
 */
const VIEWPORTS = [
  { name: "PC", width: 1440, height: 900 },
  { name: "태블릿", width: 1024, height: 768 },
  { name: "모바일", width: 375, height: 812 },
];
const USER_TYPES: UserType[] = ["financial", "admin"];

const axeViolations = async (page: Parameters<typeof login>[0], selector?: string) => {
  const builder = new AxeBuilder({ page });
  const { violations } = await (selector ? builder.include(selector) : builder).analyze();
  return violations.map(({ id, impact, nodes }) => `${impact}:${id} ${nodes[0].target.join(" ")}`);
};

for (const viewport of VIEWPORTS) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("로그인 화면", async ({ page, baseURL }) => {
      const problems = collectPageProblems(page, baseURL!);
      await page.goto("/");
      await settle(page);

      expect(await axeViolations(page)).toEqual([]);
      expect(await findBrokenImages(page)).toEqual([]);
      expect(problems).toEqual([]);
    });

    for (const userType of USER_TYPES) {
      test(`${userType} 화면`, async ({ page, baseURL }) => {
        const problems = collectPageProblems(page, baseURL!);
        await login(page, userType);

        for (const path of PAGES[userType]) {
          await page.goto(path);
          await settle(page);

          expect.soft(await axeViolations(page), `${path} 접근성`).toEqual([]);
          expect.soft(await findBrokenImages(page), `${path} 깨진 이미지`).toEqual([]);
        }
        expect(problems).toEqual([]);
      });
    }
  });
}

test.describe("열린 상태", () => {
  test("등기자료 모달", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, "financial");
    await page.goto("/financial/status-inquiry");
    await settle(page);

    await page
      .getByRole("button", { name: /등기자료/ })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await settle(page);

    expect(await axeViolations(page, '[role="dialog"]')).toEqual([]);
    const { cutHeaders, cutCells } = await measureLayout(page);
    expect(cutHeaders).toEqual([]);
    expect(cutCells).toEqual([]);
  });

  test("달력", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, "financial");
    await page.goto("/financial/status-inquiry");
    await settle(page);

    await page.locator(".react-datepicker__input-container input").first().click();
    await expect(page.locator(".react-datepicker")).toBeVisible();

    expect(await axeViolations(page, ".react-datepicker")).toEqual([]);
  });

  test("계정 메뉴와 비밀번호 변경 모달", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, "financial");

    await page.locator("._header-right-area").getByText("데모 금융기관").click();
    await expect(page.locator("._account-layer")).toBeVisible();
    expect(await axeViolations(page, "._account-layer")).toEqual([]);

    await page
      .getByRole("button", { name: /비밀번호 변경/ })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await axeViolations(page, '[role="dialog"]')).toEqual([]);
  });

  test("모바일 드로어", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await login(page, "financial");

    await page.locator("._header-right-area ._icon-button").last().click();
    await expect(page.locator("._drawer-container")).toBeVisible();

    expect(await axeViolations(page, "._drawer-container")).toEqual([]);
  });

  test("공지 아코디언의 열림 상태를 알린다", async ({ page }) => {
    await login(page, "financial");
    await page.goto("/financial/home/notice");
    await settle(page);

    const trigger = page.locator("._accordion-trigger").first();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
