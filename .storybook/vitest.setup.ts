import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/nextjs-vite";

import * as projectAnnotations from "./preview";

/* 스토리 테스트(vitest)에서도 Storybook과 같은 전역 설정(데코레이터·파라미터·접근성 검사)을 적용합니다. */
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
