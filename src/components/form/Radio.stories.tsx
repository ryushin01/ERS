import { fn } from "storybook/test";

import { AUTH_LIST } from "@constants/auth";
import { useRadio } from "@hooks";

import Radio from "./Radio";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Inputs/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: { name: "membGbCd", value: "00", labelText: "금융기관", checked: true, onChange: fn() },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {};

export const Unchecked: Story = { args: { checked: false } };

export const Disabled: Story = { args: { checked: false, disabled: true } };

/** 로그인 화면의 사용자 유형 선택 (useRadio 훅으로 선택 상태 관리) */
export const Group: Story = {
  render: function Render() {
    const [value, handleRadio] = useRadio("00");
    return (
      <div className="flex gap-x-4">
        {AUTH_LIST.map((auth) => (
          <Radio
            key={auth.id}
            name={auth.name}
            value={auth.value}
            labelText={auth.labelText}
            checked={value === auth.value}
            disabled={auth.disabled}
            onChange={handleRadio}
          />
        ))}
      </div>
    );
  },
};
