import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080},()=>{
    console.log("websocket server started");
});

