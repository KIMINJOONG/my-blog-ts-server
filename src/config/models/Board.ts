import {
    Table,
    Model,
    Column,
    DataType,
    BelongsTo,
    BelongsToMany,
    ForeignKey,
    HasMany,
} from "sequelize-typescript";
import User from "./User";
import Hashtag from "./Hashtag";
import BoardHashtag from "./BoardHashtag";
import Image from "./Image";

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
        type: DataType.TEXT,
        comment: "내용",
    })
    content!: string;

    @ForeignKey(() => User)
    @Column
    userId?: number;

    @BelongsTo(() => User)
    author?: User;

    @HasMany(() => Image)
    Image?: Image;

    @BelongsToMany(() => Hashtag, () => BoardHashtag)
    boardHashtag?: Hashtag[];
}
