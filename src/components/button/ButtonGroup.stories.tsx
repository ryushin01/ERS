import { useState } from "react";

import ButtonGroup from "./ButtonGroup";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const PERIODS = [
  { id: "today", content: "오늘", disabled: false },
  { id: "1week", content: "1주일", disabled: false },
  { id: "1month", content: "1개월", disabled: false },
  { id: "3month", content: "3개월", disabled: false },
];

/** 조회 기간처럼 여러 버튼 중 하나를 고르는 그룹 (aria-pressed로 선택 상태 표시) */
const meta = {
  title: "Components/Actions/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: { size: "", data: PERIODS, selectedButtonGroup: [], handleButtonGroup: () => {} },
  argTypes: { selectedButtonGroup: { control: false }, handleButtonGroup: { control: false } },
  render: function Render(args) {
    const [selected, setSelected] = useState<boolean[]>(args.selectedButtonGroup);
    return (
      <ButtonGroup
        {...args}
        selectedButtonGroup={selected}
        handleButtonGroup={(index) => setSelected(args.data.map((_, i) => i === index))}
      />
    );
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selectedButtonGroup: [false, true, false, false] } };

export const WithDisabled: Story = {
  args: { data: PERIODS.map((item, i) => ({ ...item, disabled: i === 3 })) },
};
