import { useQuery } from "@tanstack/react-query";

import { Button } from "@components/button";
import { axiosBasicInstance } from "@services";

import Provider from "./Provider";
import Typography from "./Typography";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * 앱 전체를 감싸는 TanStack Query Provider입니다.
 * API 오류는 QueryCache·MutationCache의 onError에서 공통으로 토스트로 알립니다.
 */
const meta = {
  title: "Patterns/Layout/Provider",
  component: Provider,
  tags: ["autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

function NotFoundApi() {
  const { refetch, isFetching } = useQuery({
    queryKey: ["story-not-found-api"],
    // 목업이 없는 API는 404로 응답 → Provider가 오류 토스트를 띄움
    queryFn: async () => (await axiosBasicInstance.get("/api/story/not-found")).data,
    enabled: false,
  });

  return (
    <div className="flex flex-col gap-y-3 w-72">
      <Typography kind="body-medium">
        목업이 없는 API를 호출하면 공통 오류 토스트가 뜹니다.
      </Typography>
      <Button
        shape="solid"
        size="md"
        color="main100"
        onClick={() => refetch()}
        disabled={isFetching}
      >
        없는 API 호출
      </Button>
    </div>
  );
}

export const ApiErrorToast: Story = {
  render: () => (
    <Provider>
      <NotFoundApi />
    </Provider>
  ),
};
