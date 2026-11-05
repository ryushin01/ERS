import plugin from "tailwindcss/plugin";

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ers: {
          main: {
            "100": "#113662",
            "90": "#2b4e78",
            "80": "#15448b",
            "70": "#0b56a7",
            "60": "#4479ae",
            "50": "#5f91c2",
            "40": "#96bce1",
            "30": "#c4d9e5",
            "20": "#d2e4fa",
            "15": "#e3eaee",
            "10": "#edf4f8",
            "5": "#eff7ff",
            "0": "#f5f7f8",
          },
          grayscale: {
            "100": "#111111",
            "90": "#505050",
            "80": "#767676",
            "70": "#999999",
            "60": "#aaaaaa",
            "50": "#bdbdbd",
            "40": "#d4d4d4",
            "30": "#ededed",
            "20": "#f1f1f5",
            "10": "#f8f8fa",
            "0": "#ffffff",
          },
          secondary: {
            bluegray: {
              "50": "#505b9e",
              "30": "#6c77b5",
              "10": "#98a0cc",
            },
            yellow: {
              // 70: 흰 배경 위 글자용 (명암 대비 4.5:1 이상)
              "70": "#8f6a00",
              "50": "#d8a100",
              "30": "#fabe00",
              "10": "#faebbd",
            },
            red: {
              "50": "#d2341f",
              "10": "#fce0db",
            },
          },
        },
      },
      zIndex: {
        // NOTE: Design System > Elevation
        // 1: footer
        "1": "1",
        // 10: gnb, modal backdrop, camera backdrop
        "10": "10",
        // 100: header, portal, modal container, camera
        "100": "100",
        // 1000: tooltip, toast
        "1000": "1000",
        // 10000: loading, spinner-backdrop
        "10000": "10000",
      },
      animation: {
        drawer: "drawer 0.3s cubic-bezier(0.65, 0.05, 0.35, 1) backwards",
        top: "top 0.3s ease-out forwards",
        bottom: "bottom 0.3s ease-out forwards",
      },
      keyframes: {
        drawer: {
          "0%": { right: "-100%" },
          "100%": { right: "0%" },
        },
        top: {
          "0%": { top: "0", opacity: "0" },
          "100%": { top: "100px", opacity: "1" },
        },
        bottom: {
          "0%": { bottom: "0", opacity: "0" },
          "100%": { bottom: "100px", opacity: "1" },
        },
      },
      boxShadow: {
        modal: "0px 4px 20px 0px rgba(0, 0, 0, 0.06)",
      },
      flex: {
        "2": "2 2 0%",
        "3": "3 3 0%",
      },
    },
  },
  plugins: [
    /*
     * 여러 CSS 파일에서 @apply로 쓰는 공통 클래스는 플러그인으로 정의합니다.
     * globals.css의 @layer에 두면 그 파일이 먼저 처리될 때만 다른 파일에서 @apply가 동작합니다. (Storybook·Vite는 순서가 보장되지 않음)
     */
    plugin(({ addComponents }) => {
      addComponents({
        "._flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    }),
  ],
} satisfies Config;
