import type { Metadata } from "next";
import { AD_NOTICE_CREATE_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";

export const metadata: Metadata = {
  title: AD_NOTICE_CREATE_METADATA.TITLE,
  description: AD_NOTICE_CREATE_METADATA.DESCRIPTION,
};

export default async function Create() {
  return (
    <CommonLayout>
      <div>
        공지관리
      </div>
    </CommonLayout>
  );
}
