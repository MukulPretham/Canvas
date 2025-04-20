import { JwtPayload } from "jsonwebtoken"

export interface decodedMsg extends JwtPayload{
    userId: string
}

export type userInfo = {
    userId: string
    name: string
}

export type ChatPayload = {
    message: string
}

export type Message = {
    type: "join" | "message" | "leave"
    roomId: string
    messagePayload?: ChatPayload
}

export interface User {
    socket: WebSocket
    userId: string
    roomId : string[]
}