// import { DataSource } from "typeorm";
// // const mysql2 = require("mysql2/promise");
// import mysql from "mysql2/promise";
// require("dotenv").config();
// // mysql2 Connect
// export const db = mysql.createPool({
//   host: process.env.MYSQL_HOST || "",
//   user: process.env.MYSQL_USER || "team6",
//   password: process.env.MYSQL_PW || "11111",
//   database: "company",
//   port: 3306,
// });

// db.getConnection()
//   .then(() => console.log("✅ mysql2 로 DB 접속!"))
//   .catch((err) => console.log("error!!!!!!!", err));

// // type ORM Connect
// export const dataSource = new DataSource({
//   type: "mysql",
//   host: process.env.MYSQL_HOST || "1",
//   username: process.env.MYSQL_USER || "team6",
//   password: process.env.MYSQL_PW || "11111",
//   database: "company",
//   port: 3306,
//   entities: ["src/db/schemas/*.entity.ts", "src/db/schemas/*.schema.ts"],
//   logging: false,
//   synchronize: true,
// });
