import { expect, test } from "@playwright/test";

import { login, measureLayout, PAGES, settle, type UserType } from "./helpers";

/*
 * 화면 폭별 레이아웃 검사 (실제 프로덕션 빌드)
 * 스토리 테스트는 컴포넌트를 따로 렌더링하므로 실제 화면의 잘림·넘침을 잡지 못합니다.
 * - 모든 폭: 페이지 가로 넘침, 잘린 버튼·입력칸 없음
 * - 375px 이상: 표의 항목 이름이 잘리지 않음
 * - 1024px 이상: 표의 값도 잘리지 않음 (더 좁은 화면의 긴 제목·연락처는 말줄임 허용)
 */
const WIDTHS = [320, 375, 768, 1024, 1367, 1440, 1680, 1920];
const USER_TYPES: UserType[] = ["financial", "admin"];

for (const width of WIDTHS) {
  for (const userType of USER_TYPES) {
    test(`${width}px ${userType} 화면에 잘림과 넘침이 없다`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await login(page, userType);

      for (const path of PAGES[userType]) {
        await page.goto(path);
        await settle(page);
        const report = await measureLayout(page);

        expect.soft(report.overflow, `${path} 가로 넘침`).toBeLessThanOrEqual(0);
        expect.soft(report.clippedControls, `${path} 잘린 버튼·입력칸`).toEqual([]);
        expect.soft(report.wrappedTabs, `${path} 줄바꿈된 탭`).toEqual([]);
        expect.soft(report.collapsedControls, `${path} 사라진 입력칸`).toEqual([]);
        expect.soft(report.invalidNesting, `${path} 잘못된 요소 중첩`).toEqual([]);
        if (width >= 375) {
          expect.soft(report.wrappedGreeting, `${path} 꺾인 인사말`).toEqual([]);
          expect.soft(report.cutHeaders, `${path} 잘린 항목 이름`).toEqual([]);
        }
        if (width >= 1024) {
          expect.soft(report.cutCells, `${path} 잘린 표 값`).toEqual([]);
        }
      }
    });
  }
}

for (const width of [320, 375, 414]) {
  test(`${width}px 헤더의 로고가 찌그러지지 않고 검색칸과 겹치지 않는다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await login(page, "financial");

    const logo = await page.locator("._header h1").boundingBox();
    const rightArea = await page.locator("._header-right-area form").first().boundingBox();

    expect(logo!.width / logo!.height).toBeCloseTo(254 / 32, 1);
    expect(rightArea!.x - (logo!.x + logo!.width)).toBeGreaterThanOrEqual(8);
  });
}
