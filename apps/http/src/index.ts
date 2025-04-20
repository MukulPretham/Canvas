import express from "express";
import jwt from "jsonwebtoken";
import { string, z } from "zod";
import { auth } from "./middleware"
import jwt_sec from "@repo/backend-common/config";
import {client} from "@repo/db/client"
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",auth,(req,res)=>{
    res.send("hello");
})

app.post("/signup",async(req,res)=>{
    if(!req.body){
        res.status(404).json({message: "Invalid format"});
        return;
    }
    let currUser = req.body;
    let userSchema = z.object({
        username: z.string().min(8),
        password: z.string().min(8)
    })

    let {success , error} = userSchema.safeParse(currUser);
    if(!success){
        res.status(404).json(error);
        return;
    }
    
    try{
        await client.user.create({
            data:{
                username: req.body.username,
                password: req.body.password
            }
        })
    }catch(e){
        res.status(404).json({message: "username already taken"});
        return;
    }

    res.json({
        message: "Your account has been created"
    })
})

app.post("/login",async(req,res)=>{

    let currUser = await client.user.findFirst({where: {
        username: req.body.username
    }})

    if(!currUser){
        res.status(404).json({message:"User doesnt exist, go create an acccount"});
        return;
    }
    
    if(currUser.password != req.body.password){
        res.status(404).json({message:"incorrect password"});
        return;
    }
    //DB logic 
    let token = jwt.sign({
        userId: currUser.id
    },jwt_sec);
    res.json({
        token: token
    })
})

app.post("/create",auth,async(req:any,res)=>{
    console.log(req.body);
    if(!req.body.roomName){
        res.json({
            error: "enter room name"
        })
        return;
    }
    let roomName:string = req.body.roomName;
    let userId = req?.userId;

    try{
        const currUser = await client.user.findFirst({
            where:{
                id: userId
            }
        });
        if(!currUser?.id){
            return;
        }
        const createdRoom = await client.room.create({
            data:{
                slug: roomName,
                adminID: currUser?.id
            }
        });

        res.status(200).json({
            message: `room ${createdRoom.id} created in the name of ${createdRoom.slug}`
        })

    }catch(e){
        res.json({message: "unauthorised"});
        return;
    }

})

app.get("/chats/:roomId",auth,async(req,res)=>{
    let roomId = req.params.roomId;
    let messages;
    try{
        messages = await client.chat.findMany({
            where:{
                roomID: roomId
            }
        })
    }catch(e){
        res.json({message: "room not found or internal server error"});
        return;
    }
    res.json(messages);
})

app.get("/rooms",auth,async(req:any,res)=>{
    const currUserID = req.userId;
    try{
        const joinedRooms = await client.joinLogs.findMany({
            where:{
                member: currUserID
            }
        })
        console.log(joinedRooms+"  ---  >   ");
        const rooms = await Promise.all(joinedRooms.map(async(room)=>{
            const roomDetails = await client.room.findFirst({
                where:{
                    id: room.room
                }
            })
            const obj = {
                slug: roomDetails?.slug,
                roomId : roomDetails?.id
            }
            return obj
        }));
        console.log(rooms);
        res.json(rooms);
    }catch(err){
        res.status(500).json({error:"server error"})
    }
    
}
)

app.listen(8081,()=>{
    console.log("http server has started");
})