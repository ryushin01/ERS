import { fn } from "storybook/test";

import { Button } from "@components/button";

import Form from "./Form";
import InputField from "./InputField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/** form + fieldset + legend 구조를 만드는 래퍼. legend는 기본으로 화면에서 숨깁니다. */
const meta = {
  title: "Components/Inputs/Form",
  component: Form,
  tags: ["autodocs"],
  args: { legendText: "의뢰번호 검색", isHiddenLegend: false, onSubmit: fn() },
  render: (args) => (
    <div className="w-[400px]">
      <Form
        {...args}
        onSubmit={(event) => {
          event.preventDefault();
          args.onSubmit(event);
        }}
      >
        <div className="flex flex-col gap-y-3">
          <InputField name="rqstNo" htmlFor="form-rqst-no" labelText="의뢰번호" inputSize="md" />
          <Button type="submit" shape="solid" size="md" color="main100">
            검색
          </Button>
        </div>
      </Form>
    </div>
  ),
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisibleLegend: Story = {};

export const HiddenLegend: Story = { args: { isHiddenLegend: true } };
