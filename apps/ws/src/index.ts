import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwt_sec from "./secret";

interface decodedMsg extends JwtPayload{
    userId: string
}

const wss = new WebSocketServer({port: 8080},()=>{
    console.log("websocket server started");
});

wss.on("connection",(socket,request)=>{

    //Web Socket Auth setup
    const url = request.url;
    const parsedParams = url?.split("?")[1];
    const params = new URLSearchParams(parsedParams);
    const token:string|null = params.get("token");
    if(!token ){
        socket.send(JSON.stringify({message: "not authorised"}));
        socket.close();
        return;
    }
    const decoded:decodedMsg = jwt.verify(token,jwt_sec)as decodedMsg;
    if(!decoded.userId){
        socket.send(JSON.stringify({message: "not authorised"}));
        socket.close();
        return;
    }

    socket.on("message",(data)=>{
        socket.send(data.toString());
    })
})

