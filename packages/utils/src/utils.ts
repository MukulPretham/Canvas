import jwt from "jsonwebtoken"
import { decodedMsg } from "./types";
import { userInfo } from "./types";
import { client } from "@repo/db/client"
import jwt_sec from "@repo/backend-common/config"

export async function recognise(token: string): Promise<userInfo | null> {

    try {
        const decoded: decodedMsg = jwt.verify(token, jwt_sec) as decodedMsg;
        const userId: string = decoded.userId;
        const currUser = await client.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!currUser?.username) {
            return null;
        }
        return ({ userId: userId, name: currUser?.username })
    } catch (e) {
        console.log(e);
        return null;
    }
    console.log("-------------------------------------");

}