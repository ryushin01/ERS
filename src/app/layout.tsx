import React, { ReactNode } from "react";

import Provider from "@components/common/Provider";
import StaticRouteGuard from "@components/common/StaticRouteGuard";
import ToastPopup from "@components/common/ToastPopup";
import { DESCRIPTION, FAVICON, OG_IMAGE, SITE_URL, TITLE } from "@constants/metadata";

import type { Metadata, Viewport } from "next";

import "@styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${TITLE} 화면 미리보기` }],
  },
  icons: {
    icon: FAVICON,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
        <link rel="manifest" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/manifest.json`} />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo/logo-192x192.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo/logo-512x512.png`}
        />
      </head>
      <body>
        <Provider>
          <div id="app">{children}</div>
          <ToastPopup />
          <div id="portal" />
          {process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" && <StaticRouteGuard />}
        </Provider>
      </body>
    </html>
  );
}
