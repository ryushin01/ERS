import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import Main from "@components/request-list/request/Main";
import { FI_REQUEST_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: FI_REQUEST_METADATA.TITLE,
  description: FI_REQUEST_METADATA.DESCRIPTION,
};

export default function Request() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}
