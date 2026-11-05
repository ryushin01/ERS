import { routeParameters } from "@/stories/helpers";

import LoginForm from "./LoginForm";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/login.css";

/**
 * 사용자 유형 선택 + 아이디·비밀번호 + 아이디 저장 + 로그인 버튼.
 * 데모 모드에서는 입력 없이 로그인 버튼만 눌러도 선택한 유형으로 로그인합니다. (법무대리인은 준비 중 안내)
 */
const meta = {
  title: "Patterns/Login/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: routeParameters("/"),
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
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Compact: Story = { args: { isDesktop: false } };
