import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

const saltRounds: Number = 10;

interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    lastname: string;
    role: number;
    image: string;
    token: string;
    tokenExp: number;
}
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxLength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

UserSchema.pre("save", function(this: User, next: NextFunction) {
    // let user = this;
    // if (user.isModified("password")) {
    //     bcrypt.genSalt(saltRounds, function(err: , salt:string):void {});
    // }
    next();
});

const User = mongoose.model<User>("User", UserSchema);

export default User;
