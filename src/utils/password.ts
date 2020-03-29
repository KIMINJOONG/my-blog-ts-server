import bcrypt from "bcrypt";
const BCRYPT_ROUNDS = 10;
export const savePassword = async (
    password: string
): Promise<string | undefined> => {
    if (password) {
        const hashedPassword = await hashPassword(password);
        return hashedPassword;
    }
};

const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const comparePassword = (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    console.log(`password : ${password}, hashedPassword: ${hashedPassword}`);
    return bcrypt.compare(password, hashedPassword);
};
