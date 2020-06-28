import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    charset: "utf8mb4", // 한글에 이모티콘까지 가능
    collate: "utf8mb4_general_ci",
})
export default class Category extends Model<Category> {
    @Column({
        type: DataType.INTEGER,
        comment: "코드",
    })
    code!: string;

    @Column({
        type: DataType.TEXT,
        comment: "코드명",
    })
    name!: string;
}
