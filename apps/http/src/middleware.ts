const JWT_SECRET = "my_super_secret_key";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwt_sec from "@repo/backend-common/config";

interface decodedMsg extends JwtPayload{
    userId: string
}

export let auth = (req:any, res:any, next:any) => {
    const token = req.headers["authorization"]; // Directly getting the token

    if (!token) {
        return res.status(403).json({ msg: "Missing auth token" });
    }

    try {
        const decoded: decodedMsg = jwt.verify(token, jwt_sec) as decodedMsg;
        console.log(decoded);
        
        if (decoded && decoded.userId) {
            
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({ msg: "Invalid token" });
        }
    } catch (error) {
        return res.status(403).json({ msg: "Invalid token" });
    }
};