function getKoreaDate() {
  const now = new Date();
  const koreaTimeOffset = 9 * 60; // 한국은 UTC+9
  const localTimeOffset = now.getTimezoneOffset();
  const koreaTime = new Date(now.getTime() + (koreaTimeOffset + localTimeOffset) * 60000);

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function checkIsToday(date: string) {
  const today = getKoreaDate();
  const targetDate = date.replaceAll("-", ""); // Assuming the input date is in YYYY-MM-DD format

  return today === targetDate;
}

function getCompareWithToday(date: string | undefined): "past" | "same" | "future" | "" {
  if (date === undefined) return "";

  const today = getKoreaDate();
  const todayInt = parseInt(today);
  const dateInt = parseInt(date.replaceAll("-", "")); // Assuming the input date is in YYYY-MM-DD format

  if (dateInt < todayInt) return "past";
  if (dateInt === todayInt) return "same";
  if (dateInt > todayInt) return "future";
  return "";
}

function getDay(date: string | Date) {
  const dayList = ["일", "월", "화", "수", "목", "금", "토"];

  if (typeof date !== "string") return dayList[date.getDay()];

  // YYYYMMDD, YYYY-MM-DD는 로컬 날짜로 해석합니다. (new Date("YYYY-MM-DD")는 UTC 자정이라 시간대에 따라 하루 전이 됨)
  const compactDate = date.replaceAll("-", "");
  const formatDate = /^\d{8}$/.test(compactDate) ? stringToDate(compactDate) : new Date(date);

  return dayList[formatDate.getDay()];
}

/**
 * @name stringToDate
 * @description YYYYMMDD 문자열을 그 날짜의 로컬 자정 Date로 바꿉니다. (예: "20231223")
 *              new Date("2023-12-23")은 UTC 자정으로 해석되어, UTC보다 늦은 시간대(미국 등)에서는 하루 전 날짜가 됩니다.
 *              형식이 맞지 않으면 Invalid Date를 돌려줍니다.
 */
function stringToDate(date: string) {
  if (!/^\d{8}$/.test(date)) return new Date(NaN);

  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(4, 6));
  const day = Number(date.slice(6, 8));

  return new Date(year, month - 1, day);
}

function formatStringToDate(date: string, sign: string) {
  return `${date.slice(0, 4)}${sign}${date.slice(4, 6)}${sign}${date.slice(6, 8)}`;
}

function getDateString(date: Date | null) {
  if (date && !!date?.getDate()) {
    const mm = date?.getMonth() + 1;
    const dd = date?.getDate();
    return `${date?.getFullYear()}${mm.toString().padStart(2, "0")}${dd
      .toString()
      .padStart(2, "0")}`;
  }

  return "";
}

function getTodayAddDays(days: number = 0) {
  const now = new Date();
  return new Date(now.setDate(now.getDate() + days));
}

export {
  checkIsToday,
  formatStringToDate,
  getCompareWithToday,
  getDateString,
  getDay,
  getKoreaDate,
  getTodayAddDays,
  stringToDate,
};
