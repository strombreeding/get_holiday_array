import express from "express";
import * as utils from "../utils";
import { updateHolidayArray, writeLog } from "../../sheetDataInit";

const holidayRouter = express();
const holidayArray = [];
const secretURL = process.env.SECRET_URL;
export let count = 0;
export const verifyHoliday = (date: string) => {};

holidayRouter.get("/holidays", async (req, res, next) => {
  if (holidayArray.length === 0) {
    const subArr = await updateHolidayArray();
    holidayArray.push(...subArr);
  }
  ++count;
  return res.status(200).json({
    holidayArray,
  });
});
holidayRouter.get("/reqCnt", async (req, res, next) => {
  try {
    await writeLog(true, "서버 요청 횟수 갱신", "2023");
  } catch (err) {
    console.log(err);
  }
  return res.status(200).send(count);
});

holidayRouter.get(secretURL, updateHolidayArray);

export default holidayRouter;
