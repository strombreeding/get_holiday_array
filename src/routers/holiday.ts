import express from "express";
import * as utils from "../utils";
import { updateHolidayArray } from "../../sheetDataInit";

const holidayRouter = express();
const holidayArray = [];
const secretURL = process.env.SECRET_URL;
export const verifyHoliday = (date: string) => {};

holidayRouter.get("/holidays", async (req, res, next) => {
  console.log(holidayArray.length);
  if (holidayArray.length === 0) {
    const subArr = await updateHolidayArray();
    holidayArray.push(...subArr);
  }
  return res.status(200).json({
    holidayArray,
  });
});

holidayRouter.get(secretURL, updateHolidayArray);

export default holidayRouter;
