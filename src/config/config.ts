import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  database: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  dialect: "mysql",
  username: process.env.MYSQLID,
  password: process.env.MYSQLPASSWORD,
  models: [__dirname + "/models"], // or [Player, Team],
});
