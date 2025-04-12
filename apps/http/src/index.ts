import express from "express";
import jwt from "jsonwebtoken";
import { string, z } from "zod";
import { auth } from "./middleware"
import jwt_sec from "@repo/backend-common/config";
import {client} from "@repo/db/client"

const app = express();

app.use(express.json());

app.get("/",auth,(req,res)=>{
    res.send("hello");
})

app.post("/signup",async(req,res)=>{
    if(!req.body){
        return;
    }
    let currUser = req.body;
    let userSchema = z.object({
        username: z.string().min(8),
        password: z.string().min(8)
    })

    let {success , error} = userSchema.safeParse(currUser);
    if(!success){
        res.send(error);
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
        res.json({message: "username already taken"});
        return;
    }

    res.json({
        message: "all good"
    })
})

app.post("/login",async(req,res)=>{

    let currUser = await client.user.findFirst({where: {
        username: req.body.username
    }})

    if(!currUser){
        res.json({message:"User doesnt exist, go create an acccount"});
        return;
    }
    
    if(currUser.password != req.body.password){
        res.json({message:"incorrect password"});
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
    let roomId = Number(req.params.roomId);
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

app.listen(8081,()=>{
    console.log("http server has started");
})