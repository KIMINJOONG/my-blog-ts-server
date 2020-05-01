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

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};
