import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import Main from "@components/request-list/Main";
import { FI_REQUEST_LIST_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: FI_REQUEST_LIST_METADATA.TITLE,
  description: FI_REQUEST_LIST_METADATA.DESCRIPTION,
};

export default function RequestList() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}
