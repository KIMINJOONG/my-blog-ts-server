import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
} from "sequelize-typescript";
import Hashtag from "./Hashtag";
import Board from "./Board";

@Table({
    charset: "utf8mb4", // 한글에 이모티콘까지 가능
    collate: "utf8mb4_general_ci",
})
export default class BoardHashtag extends Model<BoardHashtag> {
    @ForeignKey(() => Board)
    @Column({
        type: DataType.NUMBER,
        comment: "게시글 번호",
    })
    boardId!: number;

    @ForeignKey(() => Hashtag)
    @Column({
        type: DataType.NUMBER,
        comment: "해쉬태그 번호",
    })
    hashtagId!: number;
}
