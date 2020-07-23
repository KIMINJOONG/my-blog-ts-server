import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import Board from "./Board";
import Comment from "./Comment";

@Table({
  charset: "utf8mb4", // 한글에 이모티콘까지 가능
  collate: "utf8mb4_general_ci",
})
export default class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    comment: "이름",
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    comment: "이메일",
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    comment: "비밀번호",
  })
  password!: string;

  @Column({
    type: DataType.TINYINT,
    comment: "권한",
  })
  role?: number;

  @Column({
    type: DataType.STRING,
    comment: "토큰",
  })
  token?: string;

  @Column({
    type: DataType.STRING,
    comment: "토큰 만료기간",
  })
  tokenExp?: string;

  @HasMany(() => Board)
  boards?: Board[];

  @HasMany(() => Comment)
  comments?: Comment[];

  // public comparePassword(password: string = ""): Promise<boolean> {
  //     return bcrypt.compare(password, this.password);
  // }

  // @BeforeCreate
  // @BeforeUpdate
  // static async savePassword(user: User): Promise<void> {
  //     if (user.password) {
  //         const hashedPassword = await user.hashPassword(user.password);
  //         user.password = hashedPassword;
  //     }
  // }

  // private hashPassword(password: string): Promise<string> {
  //     return bcrypt.hash(password, BCRYPT_ROUNDS);
  // }
}
