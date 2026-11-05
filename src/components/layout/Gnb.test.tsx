import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FI_HOME } from "@constants/path";
import { mockDesktopMatchMedia } from "@/test/renderWithProviders";

import Gnb from "./Gnb";

vi.mock("next/navigation", () => ({ usePathname: () => FI_HOME }));

beforeEach(mockDesktopMatchMedia);

describe("Gnb", () => {
  it("메뉴 이름은 한 번만 읽고, 현재 메뉴는 aria-current로 알린다", () => {
    render(<Gnb />);

    const home = screen.getByRole("link", { name: "홈" });
    expect(home).toHaveAttribute("aria-current", "page");

    const others = screen.getAllByRole("link").filter((link) => link !== home);
    expect(others.length).toBeGreaterThan(0);
    others.forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
  });
});
