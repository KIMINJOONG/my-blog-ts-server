import mongoose from "mongoose";

interface Hashtag extends mongoose.Document {
    tag: string;
}
const HashtagSchema = new mongoose.Schema({
    tag: {
        type: String
    }
});

const Hashtag = mongoose.model<Hashtag>("Hashtag", HashtagSchema);

export default Hashtag;
