import LoginNotice from "./LoginNotice";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/login.css";

/** 로그인 화면 하단의 사용 문의 안내 */
const meta = {
  title: "Login/LoginNotice",
  component: LoginNotice,
  tags: ["autodocs"],
  args: { isDesktop: true },
  decorators: [
    (Story) => (
      <div className="_login-outer-wrapper">
        <main>
          <div className="_login-inner-wrapper">
            <section className="_login-section">
              <Story />
            </section>
          </div>
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof LoginNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Compact: Story = { args: { isDesktop: false } };
