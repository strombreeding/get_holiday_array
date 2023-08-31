import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import Fuse from "fuse.js";
import holidayRouter from "./routers/holiday";
import { google } from "googleapis";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router
app.use("/", holidayRouter);

// error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("✅ 서버 리스닝 : ", PORT));

/**
 * 시트id와 auth완료한 시트, 원하는 시트네임 넣으면 시트가 추가됨.
 * 공휴일 크론잡 자동화에 사용될 것임.
 * @param spreadsheetId
 * @param sheets
 * @param newSheetName
 */
export const createNewSheet = async (
  spreadsheetId: any,
  sheets: any,
  newSheetName: string
) => {
  // 시트 추가 요청 설정
  const request = {
    spreadsheetId,
    resource: {
      requests: [
        {
          addSheet: {
            properties: {
              title: newSheetName, // 새 시트 이름
            },
          },
        },
      ],
    },
  };

  // 시트 추가 요청 보내기
  const response = await sheets.spreadsheets.batchUpdate(request);
};
