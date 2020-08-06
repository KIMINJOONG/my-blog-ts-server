import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Board from "./Board";

@Table({
  charset: "utf8mb4", // 한글에 이모티콘까지 가능
  collate: "utf8mb4_general_ci",
})
export default class Category extends Model<Category> {
  @Column({
    type: DataType.INTEGER,
    comment: "코드",
  })
  code!: number;

  @Column({
    type: DataType.TEXT,
    comment: "코드명",
  })
  name!: string;

  @HasMany(() => Board)
  boards?: Board;
}
