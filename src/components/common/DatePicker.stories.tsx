import { useState } from "react";
import { fn } from "storybook/test";

import DatePicker from "./DatePicker";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import "@styles/datepicker.css";

const meta = {
  title: "Common/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: { id: "date-picker", startDate: null, handleDatePicker: fn() },
  decorators: [
    (Story) => (
      <div className="w-72 min-h-[380px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DatePicker
        {...args}
        startDate={date}
        handleDatePicker={(next) => {
          setDate(next);
          args.handleDatePicker?.(next);
        }}
      />
    );
  },
};

/** 시작일·종료일을 한 번에 고르는 기간 선택 */
export const Range: Story = {
  render: function Render(args) {
    const [[start, end], setDates] = useState<[Date | null, Date | null]>([null, null]);
    return (
      <DatePicker
        {...args}
        isMultiComponent
        startDate={start}
        endDate={end}
        handleDatesPicker={setDates}
      />
    );
  },
};

/** 오늘 이전 날짜는 고를 수 없습니다. (대출실행일 등) */
export const ExcludingPast: Story = {
  args: { isExcludingPast: true, minDate: new Date() },
  render: Single.render,
};

export const Error: Story = { args: { isError: true } };
