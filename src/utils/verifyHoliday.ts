/**
 * YYYY-MM-DD 스트링을 넣으면 공휴일인지 아닌지 알려줌.
 * 2023년도 기준 임 2024는 고려 x
 */
export const verifyHoliday = (day: string) => {
  const compareYear = day.split("-")[0];
  const date = day.split("-")[1] + day.split("-")[2];
  const standardYear = ["2023"];

  // 고유 명절 추석 | 설날
  const traditionHoliday = ["0121", "0122", "0123", "0928", "0929", "0930"];
  // 날짜가 고정된 공휴일
  const fixHoliday = [
    "0101",
    "0301",
    "0505",
    "0606",
    "0815",
    "1003",
    "1009",
    "1225",
  ];
  // 대체 공휴일
  const subHoliday = ["0124"];
  if (traditionHoliday.includes(date)) return true;
  if (fixHoliday.includes(date)) return true;
  if (subHoliday.includes(date)) return true;
  if (!standardYear.includes(compareYear)) return false;
  return false;
  throw new Error(
    `(${compareYear}) 해당 년도는 검증할 수 없습니다. util/date.js/verifyHoliday 를 수정하세요 `
  );
  return false;
};

export const isWeekend = (dateStr: string): boolean => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month는 0부터 시작하므로 1을 뺌
  const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  return dayOfWeek === 0 || dayOfWeek === 6;
};
