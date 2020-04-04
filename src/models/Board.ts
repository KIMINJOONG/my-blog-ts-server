import mongoose from "mongoose";

interface Board extends mongoose.Document {
    title: string;
    content: string;
    hashtags: Array<Object>;
}
const BoardSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    hashtags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hashtag"
        }
    ]
});

const Board = mongoose.model<Board>("Board", BoardSchema);

export default Board;
