import type { Metadata } from "next";
import { AD_MEMBER_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";
import Main from "@components/admin/member/Main";

export const metadata: Metadata = {
  title: AD_MEMBER_METADATA.TITLE,
  description: AD_MEMBER_METADATA.DESCRIPTION,
};

export default async function Member() {
  return (
    <CommonLayout>
      <Main />
    </CommonLayout>
  );
}