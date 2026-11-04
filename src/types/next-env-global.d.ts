/*
 * next-env.d.ts는 next dev/build 때 자동 생성되고 git에서 제외되어 있어, 새로 받은 저장소(CI 등)에서는
 * `tsc --noEmit`이 SVG·이미지 import 타입을 찾지 못합니다. 같은 참조를 저장소에 함께 둡니다.
 */
/// <reference types="next" />
/// <reference types="next/image-types/global" />
