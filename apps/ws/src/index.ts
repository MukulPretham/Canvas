import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwt_sec from "@repo/backend-common/config";
import { client } from "@repo/db/client"

interface decodedMsg extends JwtPayload{
    userId: string
}

type userInfo = {
    userId: string
    name: string
}

type error = {
    error: string
}

type MessagePayload = {
    roomID: Number
    senderID: string
}

// let SOCKETS = new Map<string,WebSocket>();  // user -- socket
// let ROOMS = new Map<string,Number[]>();     // user -- rooms
// let MESSAGES = new Map<Number,MessagePayload[]>()  // rooms -- messages

interface User {
    socket: WebSocket
    userId: string
    roomId : string[]
}

const Users:User[] = [];


const wss = new WebSocketServer({port: 8080},()=>{
    console.log("websocket server started");
});

async function recognise(token: string):Promise<userInfo | null>{

    try{
        const decoded:decodedMsg = jwt.verify(token,jwt_sec)as decodedMsg;
    }catch(e){
        return null;
    }

    const decoded = jwt.verify(token,jwt_sec) as decodedMsg;
    const userId:string = decoded.userId;
    const currUser = await client.user.findFirst({
        where:{
            id: userId
        }
    });
    if(!currUser?.username){
        return null;
    }
    return ({userId: userId, name: currUser?.username })
}

wss.on("connection",async(socket,request)=>{

    //Web Socket Auth setup
    const url = request.url;
    if(!url){
        socket.send(JSON.stringify({message: "not authorised"}));
        socket.close();
        return;
    }
    
    const parsedParams = url?.split("?")[1];
    const params = new URLSearchParams(parsedParams);
    const token:string|null = params.get("token");

    if(!token ){
        socket.send(JSON.stringify({message: "not authorised"}));
        socket.close();
        return;
    }
    
    let currUserInfo = await recognise(token);
    if(!currUserInfo || currUserInfo.userId === undefined){
        socket.close();
        return;
    }
    socket.send(JSON.stringify(currUserInfo));

    //-------------------------------------------------------------------------------------//

    SOCKETS.set(currUserInfo?.userId,socket);

    socket.on("message",(data)=>{
        socket.send(data.toString());
    })
})

