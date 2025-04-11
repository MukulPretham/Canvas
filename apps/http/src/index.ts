import express from "express";
import jwt from "jsonwebtoken";
import { string, z } from "zod";
import { auth } from "./middleware"
import jwt_sec from "@repo/backend-common/config";
import { client } from "@repo/db/client"

const app = express();

app.use(express.json());

app.get("/",auth,(req,res)=>{
    res.send("hello");
})

app.post("/signup",async(req: Request,res: any)=>{
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
        return res.send(error);
    }

    //DB logic
    // currUser = await client.user.findFirst({
    //     where:{
    //         username: req.body.username
    //     }
    // })

    // if(exist){}

    res.json({
        message: "all good"
    })
})

app.post("/login",(req,res)=>{
    let currUser = req.body;
    //DB logic 
    let token = jwt.sign({
        userId: req.body.username
    },jwt_sec);
    res.json({
        token: token
    })
})

app.post("/create",auth,(req,res)=>{
    res.json({
        message: "ready to create a room",
    })
})

app.listen(8081,()=>{
    console.log("http server has started");
})