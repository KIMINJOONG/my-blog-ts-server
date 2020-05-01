import {
    Table,
    Model,
    Column,
    DataType,
    BelongsToMany,
} from "sequelize-typescript";
import Board from "./Board";
import BoardHashtag from "./BoardHashtag";

@Table({
    charset: "utf8mb4", // 한글에 이모티콘까지 가능
    collate: "utf8mb4_general_ci",
})
export default class Hashtag extends Model<Hashtag> {
    @Column({
        type: DataType.STRING,
        comment: "해쉬태그",
    })
    tags?: string;

    @BelongsToMany(() => Board, () => BoardHashtag)
    boardHashTag?: Board[];
}
