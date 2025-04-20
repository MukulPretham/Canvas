import { WebSocketServer, WebSocket } from "ws";
import { client } from "@repo/db/client"
import {  Message } from "@repo/utils/types"
import { recognise } from "@repo/utils/utils"

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

// async function recognise(token: string):Promise<userInfo | null>{

//     try{
//         const decoded:decodedMsg = jwt.verify(token,jwt_sec)as decodedMsg;
//     }catch(e){
//         return null;
//     }

//     const decoded = jwt.verify(token,jwt_sec) as decodedMsg;
//     const userId:string = decoded.userId;
//     const currUser = await client.user.findFirst({
//         where:{
//             id: userId
//         }
//     });
//     if(!currUser?.username){
//         return null;
//     }
//     return ({userId: userId, name: currUser?.username })
// }

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
    socket.send(JSON.stringify({message:"websocket active"}));

    //-------------------------------------------------------------------------------------//

    Users.push({
        socket: socket,
        userId: currUserInfo.userId,
        roomId: []
    })
    console.log(Users);

    socket.on("message",async(data)=>{
        let parsedData: Message = JSON.parse(data.toString());
        console.log(parsedData);
        if(parsedData.type === "join" && parsedData.roomId){ 
            let exist = await client.room.findFirst({
                where:{
                    id: parsedData.roomId.toString()
                }
            })
            if(!exist){
                socket.send(JSON.stringify({message: "room doesnt exist"}));
                return;
            }
            Users.forEach(async(entry)=>{
                if(entry.userId === currUserInfo.userId){
                    entry.roomId.push(parsedData.roomId);
                    console.log(entry.roomId);


                    try{
                        let exist = await client.joinLogs.findFirst({
                            where:{
                                room: parsedData.roomId.toString(),
                                member: currUserInfo.userId
                            }
                        });
                        if(!exist){
                            await client.joinLogs.create({
                                data:{
                                    room: parsedData.roomId.toString(),
                                    member: currUserInfo.userId
                                }
                            }) ;
                        }
                        socket.send(JSON.stringify({
                            message: "joined"
                        }));
                    }catch(err){
                        console.log("failed to enter a join log");
                        socket.send(JSON.stringify({message: "failed to enter a join log"}));
                    }
                    return;
                }
            });
        }
        else if(parsedData.type === "leave" && parsedData.roomId){
            Users.forEach(async(entry)=>{
                if(entry.userId === currUserInfo.userId){
                    entry.roomId = entry.roomId.filter(x => x!=parsedData.roomId);
                    console.log(entry.roomId);
                    try{
                        await client.joinLogs.deleteMany({
                            
                            where :{
                                member: currUserInfo?.userId,
                                room: parsedData?.roomId
                            }
                        })
                    }catch(err){
                        socket.send(JSON.stringify({
                            message : err
                        }))
                    }
                    return;
                }
            })
        }else if(parsedData.type === "message" && parsedData.messagePayload && parsedData.roomId){
            try{
                await client.chat.create({
                    data:{
                        roomID: parsedData.roomId.toString(),
                        message: parsedData.messagePayload.message,
                        senderID: currUserInfo.userId
                    }
                })
            }catch(e){
                socket.send("DB problem");
            }
            
            Users.forEach((entry)=>{
                if(entry.roomId.includes(parsedData.roomId)){
                    entry.socket.send(JSON.stringify({message: parsedData.messagePayload?.message, sender:currUserInfo.name}));
                }
            })
        }else{
            socket.send(JSON.stringify({message: "wrong format "}));
        }
    })
})

