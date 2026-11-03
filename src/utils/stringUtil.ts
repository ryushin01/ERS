/**
 * @name getManagerInfo
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 관리자 이름 + 연락처 정보 세팅
 */
function getManagerInfo(name: string = "", tel: string = "") {
  let result = "";

  if (name === "" && tel === "") {
    result = "-";
  } else {
    result += name !== "" ? name : "";
    result += tel !== "" ? ` (${tel})` : "";
  }

  return result;
}

/**
 * @name getDetailAddress
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 상세주소 동 + 호 정보 세팅
 */
function getDetailAddress(dong: string = "", ho: string = "") {
  let result = "";

  if (dong === "" && ho === "") {
    result = "-";
  } else {
    result += dong !== "" ? `${dong}동 ` : "";
    result += ho !== "" ? `${ho}호` : "";
  }

  return result;
}

/**
 * @name formatNumberComma
 * @version 1.0.0
 * @author 류창선 <ryushin0167@gmail.com>
 * @description 금액 콤마 포맷
 */
function formatNumberComma(num: number | null | undefined) {
  if (num == null) {
    return "";
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { formatNumberComma, getDetailAddress, getManagerInfo };
