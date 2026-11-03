import Main from "@components/admin/notice/Main";
import { CommonLayout } from "@components/layout";
import { AD_NOTICE_CREATE_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: AD_NOTICE_CREATE_METADATA.TITLE,
  description: AD_NOTICE_CREATE_METADATA.DESCRIPTION,
};

export default async function Create() {
  return (
    <CommonLayout>
      <Main />
    </CommonLayout>
  );
}
