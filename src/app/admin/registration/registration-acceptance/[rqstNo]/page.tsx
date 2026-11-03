import Main from "@components/admin/registration/registration-acceptance/Main";
import { CustomErrorBoundary } from "@components/error-boundary";
import { CommonLayout } from "@components/layout";
import { AD_REGISTRATION_ACCEPTANCE_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_REGISTRATION_ACCEPTANCE_METADATA.TITLE,
  description: AD_REGISTRATION_ACCEPTANCE_METADATA.DESCRIPTION,
};

export default async function Detail() {
  return (
    <CommonLayout>
      <CustomErrorBoundary element={<Main />} />
    </CommonLayout>
  );
}
