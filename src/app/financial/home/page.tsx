import Main from "@components/home/Main";
import { CommonLayout, Footer } from "@components/layout";
import { FI_HOME_METADATA } from "@constants/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: FI_HOME_METADATA.TITLE,
  description: FI_HOME_METADATA.DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <CommonLayout>
        <Main />
      </CommonLayout>
      <Footer />
    </>
  );
}
