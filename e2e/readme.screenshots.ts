import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { login, settle } from "./helpers";

/*
 * README 화면 섹션의 스크린샷을 다시 찍습니다. (pnpm screenshots, 먼저 pnpm build 필요)
 * 평소 E2E(pnpm test:e2e)에서는 실행하지 않습니다. 결과는 docs/images에 저장됩니다.
 */
const IMAGE_DIR = join(process.cwd(), "docs/images");
const DESKTOP = { width: 1440, height: 1000 };
const MOBILE = { width: 390, height: 844 };

const capture = async (page: Page, name: string) => {
  await settle(page);
  await page.screenshot({ path: join(IMAGE_DIR, `${name}.jpg`), type: "jpeg", quality: 80 });
};

/** 표의 이미지·애니메이션까지 그려진 뒤 찍습니다. */
const captureAfterRender = async (page: Page, name: string) => {
  await settle(page);
  await page.waitForTimeout(800);
  await capture(page, name);
};

test.describe.configure({ mode: "serial" });

test.describe("PC", () => {
  test.use({ viewport: DESKTOP });

  test("로그인", async ({ page }) => {
    await page.goto("/");
    await capture(page, "login");
  });

  test("금융기관", async ({ page }) => {
    await login(page, "financial");
    await capture(page, "financial-home");

    await page.goto("/financial/request-list");
    await capture(page, "financial-request-list");

    await page.goto("/financial/status-inquiry");
    await settle(page);
    await page
      .getByRole("button", { name: /등기자료/ })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await captureAfterRender(page, "financial-registration-data");
  });

  test("관리자", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/registration");
    await capture(page, "admin-registration");

    await page.goto("/admin/assign/assign-detail/DEMO-002400");
    await captureAfterRender(page, "admin-assign-detail");
  });

  test("Storybook", async ({ page }) => {
    await page.goto("/storybook/index.html?path=/story/financial-home-main--desktop");
    await expect(
      page.frameLocator("#storybook-preview-iframe").getByText("좋은 하루 보내세요!"),
    ).toBeVisible({ timeout: 30_000 });
    await captureAfterRender(page, "storybook");
  });
});

test.describe("모바일", () => {
  // 작은 화면의 글자가 README에서 뭉개지지 않도록 2배 해상도로 찍습니다.
  test.use({ viewport: MOBILE, deviceScaleFactor: 2 });

  test("금융기관", async ({ page }) => {
    await login(page, "financial");
    await capture(page, "mobile-home");

    await page.goto("/financial/request-list");
    await capture(page, "mobile-request-list");
  });
});

test("README의 화면 이미지를 모두 이 스크립트가 만든다", () => {
  const SHOTS = [
    "login",
    "financial-home",
    "financial-request-list",
    "financial-registration-data",
    "admin-registration",
    "admin-assign-detail",
    "storybook",
    "mobile-home",
    "mobile-request-list",
  ];
  const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");
  const used = [...readme.matchAll(/docs\/images\/([\w-]+)\.jpg/g)].map((match) => match[1]);

  expect([...used].sort()).toEqual([...SHOTS].sort());
});
