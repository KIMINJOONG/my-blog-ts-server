import { Table, Model, Column, DataType } from "sequelize-typescript";
import User from "./User";
import Hashtag from "./Hashtag";

@Table({
    charset: "utf8mb4", // 한글에 이모티콘까지 가능
    collate: "utf8mb4_general_ci",
})
export default class Board extends Model<Board> {
    @Column({
        type: DataType.STRING,
        comment: "제목",
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        comment: "내용",
    })
    content!: string;
}

Board.belongsTo(User); // 테이블에 UserId 컬럼이 생겨요
// Board.hasMany(Image);
Board.belongsToMany(Hashtag, { through: "PostHashtag" });
