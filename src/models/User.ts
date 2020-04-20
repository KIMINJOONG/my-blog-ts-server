import mongoose from "mongoose";

interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: number;
    image: string;
    token: string;
    tokenExp: number;
}
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

const User = mongoose.model<User>("User", UserSchema);

export default User;
