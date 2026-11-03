/**
 * @name isPathUnder
 * @description pathname이 basePath 자신이거나 그 하위 경로인지 판정합니다.
 *              문자열 포함(includes)으로 판정하면 "/foo/financial", "/financialx" 같은 경로도 일치하므로 접두 경로로 비교합니다.
 * @example isPathUnder("/financial/home/notice", "/financial/home") // true
 * @example isPathUnder("/financialx", "/financial")                 // false
 */
export function isPathUnder(pathname: string | null | undefined, basePath: string) {
  if (!pathname) return false;
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}
