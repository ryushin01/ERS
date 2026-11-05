import { expect, test } from "@playwright/test";

import { login, PAGES, settle, type UserType } from "./helpers";

/* 키보드 사용: axe로는 확인할 수 없는 항목 (KWCAG 키보드 사용 보장, 초점 이동과 표시, 반복 영역 건너뛰기) */
const USER_TYPES: UserType[] = ["financial", "admin"];

test("Tab을 처음 누르면 본문 바로가기가 보이고, 누르면 본문으로 이동한다", async ({ page }) => {
  await login(page, "financial");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "본문 바로가기" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();

  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("로그인 화면에도 본문 바로가기가 있다", async ({ page }) => {
  await page.goto("/");
  await settle(page);

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문 바로가기" })).toBeFocused();
});

for (const userType of USER_TYPES) {
  test(`${userType} 화면에서 Tab으로 이동할 때 초점이 항상 보인다`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, userType);

    for (const path of PAGES[userType]) {
      await page.goto(path);
      await settle(page);

      for (let press = 0; press < 25; press += 1) {
        await page.keyboard.press("Tab");
        const hidden = await page.evaluate(() => {
          const active = document.activeElement;
          if (!active || active === document.body) return null;
          const style = getComputedStyle(active);
          const isVisible =
            style.outlineStyle !== "none" &&
            parseFloat(style.outlineWidth) > 0 &&
            !/rgba\(0, 0, 0, 0\)|transparent/.test(style.outlineColor);
          return isVisible ? null : `${active.tagName} ${active.className}`;
        });
        expect.soft(hidden, `${path} 초점 표시`).toBeNull();
      }
    }
  });
}

test("계정 메뉴를 Esc로 닫으면 연 버튼으로 초점이 돌아간다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page, "financial");

  const opener = page.locator("._header-right-area").getByRole("button", { name: /데모 금융기관/ });
  await opener.focus();
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(page.locator("._account-layer")).toBeVisible();
  await expect(opener).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(page.locator("._account-layer")).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("모바일 드로어는 대화상자로 열리고, Esc로 닫으면 메뉴 버튼으로 초점이 돌아간다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page, "financial");

  const opener = page.getByRole("button", { name: "계정 메뉴 열기" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "계정 메뉴" });
  await expect(dialog).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("배정관리 의뢰번호 검색칸에 의뢰번호를 입력할 수 있다", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page, "admin");

  const search = page.getByRole("textbox", { name: "의뢰번호" }).first();
  await search.fill("DEMO-002400");

  await expect(search).toHaveValue("DEMO-002400");
});
