"use client"
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [msg, setMsg] = useState("");
    const [socket , setSocket] = useState<WebSocket>();

    const joinHandler = async()=>{
        console.log(inputRef.current?.value);
        socket?.send(JSON.stringify({
            type: "join",
            roomId: inputRef.current?.value
        }))
    }

    useEffect(()=>{
        const token = localStorage.getItem("token");
        const socket = new WebSocket(`ws://localhost:8080?token=${
            token
        }`);
        socket.onopen = ()=>{
            setSocket(socket);
        }
        socket.onmessage = (data)=>{
            console.log(data.data);
            const Message = JSON.parse(data.data);
            setMsg(Message.message);
        }
    },[]);

    return (
        <div className='h-full w-[70%] flex justify-center items-center'>
            <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] sm:w-[400px] flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Join a Room</h2>
                {msg && <div className='text-black'>{msg}</div>}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter Room ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none text-black focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={joinHandler}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                >
                    Join Room
                </button>
            </div>

        </div>
    )
}

export default page