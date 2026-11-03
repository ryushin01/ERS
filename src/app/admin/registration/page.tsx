import Main from "@components/admin/registration/Main";
import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import { AD_REGISTRATION_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_REGISTRATION_METADATA.TITLE,
  description: AD_REGISTRATION_METADATA.DESCRIPTION,
};

export default async function Registration() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}
