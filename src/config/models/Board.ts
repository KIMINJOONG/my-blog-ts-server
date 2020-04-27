import { Table, Model, Column, DataType } from "sequelize-typescript";

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
    // hashtags: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Hashtag",
    //     },
    // ],
}
