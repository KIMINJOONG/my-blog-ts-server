import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  database: process.env.PRODUCTION ? process.env.MYSQLDATABASE : "my_blog_test",
  host: process.env.PRODUCTION ? process.env.MYSQLHOST : "localhost",
  dialect: "mysql",
  username: process.env.PRODUCTION ? process.env.MYSQLID : "root",
  password: process.env.PRODUCTION ? process.env.MYSQLPASSWORD : "PASSWORD",
  models: [__dirname + "/models"], // or [Player, Team],
});
