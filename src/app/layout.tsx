import React, { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { TITLE, DESCRIPTION, FAVICON, OG_IMAGE, SITE_URL } from "@constants/metadata";
import Provider from "@components/common/Provider";
import ToastPopup from "@components/common/ToastPopup";
import "@styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: FAVICON,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
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
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" sizes="192x192" href="/images/logo/logo-192x192.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/images/logo/logo-512x512.png" />
    </head>
    <body>
    <Provider>
      <div id="app">
        {children}
      </div>
      <ToastPopup />
      <div id="portal" />
    </Provider>
    </body>
    </html>
  );
}
