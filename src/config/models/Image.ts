import {
    Table,
    Model,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import Board from "./Board";

@Table({
    charset: "utf8mb4", // 한글에 이모티콘까지 가능
    collate: "utf8mb4_general_ci",
})
export default class Image extends Model<Image> {
    @Column({
        type: DataType.STRING,
        comment: "파일명",
    })
    name?: string;

    @ForeignKey(() => Board)
    @Column
    boardId!: number;

    @BelongsTo(() => Board)
    board?: Board;
}
