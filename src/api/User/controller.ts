import { Request, Response } from "express";
import User from "../../models/User";

export default {
    create: async (req: Request, res: Response) => {
        try {
            const user = await User.create(req.body);
            return res.json({ success: true, user });
        } catch (error) {
            console.log("error: ", error);
            return res.status(404).json({ success: false, error });
        }
    }
};
