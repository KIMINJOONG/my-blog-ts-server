import jwt from "jsonwebtoken";
import User from "../config/models/User";
export const createJWT = (id: string): string => {
    const token = jwt.sign(
        { id },
        "YukWmnssxCARfg8GK3be85mcnUVAG3gzA5yQLCHbFnSJH7JghGN"
    );
    return token;
};

export const decodeJWT = async (token: string): Promise<User | undefined> => {
    if (token) {
        const decoded: any = jwt.verify(
            token,
            "YukWmnssxCARfg8GK3be85mcnUVAG3gzA5yQLCHbFnSJH7JghGN"
        );

        const { id } = decoded;
        if (id) {
            const user: User | null = await User.findOne({ where: { id } });
            if (!user) {
                return undefined;
            }
            return user;
        }
    }
};
