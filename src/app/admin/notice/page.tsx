import type { Metadata } from "next";
import { AD_NOTICE_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";
import Main from "@components/admin/notice/Main";

export const metadata: Metadata = {
  title: AD_NOTICE_METADATA.TITLE,
  description: AD_NOTICE_METADATA.DESCRIPTION,
};

export default async function Notice() {
  return (
    <CommonLayout>
      <Main />
    </CommonLayout>
  );
}
