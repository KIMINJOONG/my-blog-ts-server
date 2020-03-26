import mongoose from "mongoose";

interface Board extends mongoose.Document {
    title: string;
    content: string;
    category: number;
}
const BoardSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    category: Number
});

const Board = mongoose.model<Board>("Board", BoardSchema);

export default Board;