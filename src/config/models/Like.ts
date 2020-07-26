import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Board from "./Board";
import User from "./User";

@Table({
  charset: "utf8mb4", // 한글에 이모티콘까지 가능
  collate: "utf8mb4_general_ci",
})
export default class Like extends Model<Like> {
  @ForeignKey(() => Board)
  @Column
  boardId?: number;

  @ForeignKey(() => User)
  @Column
  userId?: number;

  @BelongsTo(() => User)
  user!: User;
}
