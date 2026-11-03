import type { Metadata } from "next";
import { AD_REGISTRATION_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";
import { CustomErrorBoundary } from "@components/error-boundary";
import Main from "@components/admin/registration/Main";

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
