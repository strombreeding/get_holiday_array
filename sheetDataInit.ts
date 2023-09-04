import { google } from "googleapis";
import axios from "axios";
import * as utils from "./src/utils";
require("dotenv").config();

interface Data {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: 1;
}

// configs
const auth = new google.auth.GoogleAuth({
  keyFile: "bottle-golfpeople-6ecbc1b568fd.json", // 서비스 계정 키 파일 경로
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env.SPREAD_SHEET_ID;
const serviceKey = process.env.API_SERVICE_KEY;
const reqestUrl = process.env.REQUEST_URL;

// 시트에 마지막으로 갱신된 year 검색후 리턴하는 함수
const getLastYear = async () => {
  const lastYear = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `lastYear!A1`,
  });
  return String(lastYear.data.values);
};

// 공공데이터에 년도를 넣고 결과에 따라 시트에 추가하거나
const reqDataAndUpdateSheet = async (year: string) => {
  try {
    const dataAPI = await axios.get(
      `${reqestUrl}?solYear=${year}&numOfRows=20&_type=json&ServiceKey=${serviceKey}`
    );
    console.log(
      "공공데이터 조회 결과 = ",
      typeof dataAPI.data.response.body.items.item
    );
    if (typeof dataAPI.data.response.body.items.item === undefined)
      throw new Error("정보 없음");

    // 년도로 시트 생성
    await addNewSheet(year);
    const datas: Data[] = dataAPI.data.response.body.items.item;

    const writeHeader = {
      spreadsheetId,
      range: `${year}!A${1}:B${1}`, // 범위
      valueInputOption: "RAW",
      resource: {
        values: [["날짜", "설명"]],
      },
    };
    await sheets.spreadsheets.values.update(writeHeader);
    for (let i = 0; i < datas.length; i++) {
      console.log(datas[i].dateName, datas[i].isHoliday);
      if (datas[i].isHoliday === "Y") {
        const date = utils.convertToFormattedDate(String(datas[i].locdate));
        const request = {
          spreadsheetId,
          range: `${year}!A${i + 2}:B${i + 2}`, // 범위
          valueInputOption: "RAW",
          resource: {
            values: [[date, datas[i].dateName]],
          },
        };
        const response = await sheets.spreadsheets.values.update(request);
        continue;
      }
    }

    await plusYear(year);
    return true;
  } catch (err) {
    throw new Error(`공공데이터에서 ${year} 년도가 갱신 되지 않았습니다.`);
  }
};
const addNewSheet = async (sheetName: string) => {
  // 시트 추가 요청 설정
  try {
    const request = {
      spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: `${sheetName}`, // 새 시트 이름
              },
            },
          },
        ],
      },
    };

    // 시트 추가 요청 보내기
    const response = await sheets.spreadsheets.batchUpdate(request);
    return;
  } catch (err) {
    return err;
  }
};
const plusYear = async (year: string) => {
  const request = {
    spreadsheetId,
    range: "lastYear!A1",
    valueInputOption: "RAW",
    resource: {
      values: [[Number(year) + 1]],
    },
  };
  const response = await sheets.spreadsheets.values.update(request);
  return;
};

const runApp = async () => {
  try {
    console.log("시작");
    let roop = true;
    let year = Number(await getLastYear());
    while (roop) {
      console.log(`${year}년도 데이터 수집 시작`);
      const reqData = await reqDataAndUpdateSheet(year.toString());
      if (reqData !== true) break;
      ++year;
    }
    await writeLog(true, "성공적으로 수집 완료", year.toString());
    console.log("종료");
    return;
  } catch (err) {
    console.log(`runApp 실행도중 Error 발생,${err.message}`);
    const errMsg = err.message.split(" ")[1];
    await writeLog(false, err.message, errMsg);
    return `Error:${err.message}`;
  }
};

const getSheetInfo = async () => {
  const sheets = google.sheets({ version: "v4", auth });

  try {
    let year = await getLastYear();
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges: [], // 이곳에 원하는 범위를 지정해도 됨
    });

    const sheetCount = response.data.sheets.length;
    const sheetNames = response.data.sheets.map(
      (sheet) => sheet.properties.title
    );
    const filteredYears = sheetNames.filter((name) => {
      if (name === year || name === "lastYear") return false;
      return true;
    });
    console.log("Number of sheets:", filteredYears.length);
    console.log("Sheet names:", filteredYears);
    return filteredYears;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const writeLog = async (success: boolean, reason: string, target: string) => {
  try {
    const nowDate = new Date();
    const currentMonth = nowDate.getMonth() + 1;
    const currentDate = nowDate.getDate();
    const hours = String(nowDate.getHours()).padStart(2, "0");
    const minutes = String(nowDate.getMinutes()).padStart(2, "0");
    const seconds = String(nowDate.getSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;
    const date = `${nowDate.getFullYear()}-${
      currentMonth > 12
        ? "01"
        : currentMonth < 10
        ? `0${currentMonth}`
        : currentMonth
    }-${currentMonth < 10 ? `0${currentDate}` : currentMonth} `;
    const logData = {
      spreadsheetId,
      range: "cronJob!A2:E2",
      valueInputOption: "RAW",
      resource: {
        values: [[date, time, target, success, reason]],
      },
    };
    const response = await sheets.spreadsheets.values.append(logData);
    return;
  } catch (err) {
    throw new Error(`Error: 로그 작성중 오류가 발생 //  ${err.message}`);
  }
};

// 모듈
export const updateHolidayArray = async () => {
  try {
    const yearArray = await getSheetInfo();
    const resultArray = [];
    for (let i = 0; i < yearArray.length; i++) {
      const request = {
        spreadsheetId,
        range: `${yearArray[i]}!A2:A25`, // 범위
      };
      const result = await sheets.spreadsheets.values.get(request);
      // resultArray.push(...result.data.values);
      result.data.values.map((item) => {
        if (!item[0]) return;
        resultArray.push(item[0]);
      });
    }
    return resultArray;
  } catch (err) {
    throw new Error("업뎃하다가 에러임..");
  }
};

runApp();
