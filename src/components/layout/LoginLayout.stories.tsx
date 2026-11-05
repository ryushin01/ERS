import LoginSection from "@components/login/LoginSection";
import { mobileViewport, routeParameters } from "@/stories/helpers";

import LoginLayout from "./LoginLayout";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/login.css";

/** 로그인 화면의 틀: 헤더(로고) + 가운데 카드 */
const meta = {
  title: "Patterns/Layout/LoginLayout",
  component: LoginLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "900px" } },
    ...routeParameters("/"),
  },
  args: { children: <LoginSection /> },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof LoginLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: mobileViewport };
