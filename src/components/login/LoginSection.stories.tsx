import { mobileViewport, routeParameters } from "@/stories/helpers";

import LoginSection from "./LoginSection";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/login.css";

/** 제목 + 로그인 폼 + 이용 문의 안내 */
const meta = {
  title: "Patterns/Login/LoginSection",
  component: LoginSection,
  tags: ["autodocs"],
  parameters: routeParameters("/"),
  decorators: [
    (Story) => (
      <div className="_login-outer-wrapper">
        <main>
          <div className="_login-inner-wrapper">
            <Story />
          </div>
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof LoginSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };
