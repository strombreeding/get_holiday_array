import { Request, Response, NextFunction } from "express";
// 에러 미들웨어는 항상 (설령 안 쓰더라도)
// error~next의 4개 인자를 설정해 주어야 함.
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 터미널에 노란색으로 출력됨.
  let status = 0;
  // Error: status, 내용 인 경우, split 하여 error.message 를 다시 만듬
  if (error.message.includes("Error: ")) {
    error.message = error.message.split("Error:")[1];
  }
  const { message, name } = error;
  status = Number(message.split(",")[0]);
  let msg = message.split(",")[1];
  console.log("\x1b[33m%s\x1b[0m", error.stack);

  // 핸들링한 에러가 아닐 경우
  if (typeof status !== "number" || Number.isNaN(status)) {
    console.log("status 이상함 ");
    msg = "서버 오류";
    status = 500;
  }
  // 에러는 400 코드의 JSON 형태로 프론트에 전달됨
  res.status(status).json({ status, msg });
};
