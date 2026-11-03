import { atomWithStorage, createJSONStorage } from "jotai/utils";

/* autoAtom 기본 폼 */
type AuthAtom = {
  lognYn: boolean;
  resCd: string;
  membNo: string;
  membNm: string;
  membGbCd: string;
  membGbNm: string;
  membHpno: string;
  statCd: string;
  statNm: string;
  accessToken: string;
  refreshToken: string;
};

/* autoAtom 초기값 */
const initValue: AuthAtom = {
  lognYn: false,
  resCd: "",
  membNo: "",
  membNm: "",
  membGbCd: "",
  membGbNm: "",
  membHpno: "",
  statCd: "",
  statNm: "",
  accessToken: "",
  refreshToken: "",
};

/* sessionStorage에 저장 */
const storage = createJSONStorage<AuthAtom>(() => sessionStorage);
const authAtom = atomWithStorage<AuthAtom>("auth", initValue, storage);

/* autoAtom 내보내기 */
export { authAtom };
