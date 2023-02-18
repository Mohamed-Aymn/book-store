import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

interface Data {
    error?: string;
    data?: object;
    message?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { query, method } = req;
    let accountId = query.id;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const user = await User.findById(accountId)
                    .select("following")
                    .populate({
                        path: "following",
                        model: User,
                    })
                    .exec();
                let data = {
                    count: user.following.length,
                    data: user.following,
                };

                res.status(200).json({ data });
            } catch (error) {
                let message = (error as Error).message;
                let name = (error as Error).name;
                res.status(500).json({
                    error: `${name}${name ? "/ " : null}${message}`,
                });
            }
            break;

        default:
            res.status(400).json({
                error: "some kind of error has occurred",
            });
            break;
    }
}
