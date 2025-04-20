"use client"
import Link from 'next/link';
import React, { useRef, useState } from 'react'

const page = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [msg, setMsg] = useState("");
    const createHandler = async()=>{
        console.log(inputRef.current?.value);
        const token = localStorage.getItem("token");
        if(!token){
            return;
        }
        const res = await fetch("http://localhost:8081/create",{
            method: "POST",
            body:JSON.stringify({
                roomName: inputRef.current?.value
            }),
            headers:{
                authorization: token,
                "Content-Type": 'application/json'
            }
        })
        const data = await res.json();
        setMsg(data.message);
    }
    return (
        <div className='h-full w-[70%] flex justify-center items-center'>
            <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] sm:w-[400px] flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a Room</h2>
                {msg && <div className='text-black'>{msg}</div>}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter Room ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none text-black focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={createHandler}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                >
                    Create Room
                </button>
                <p className='text-black'>Have a room id? , <Link href={"/home/joinRoom"}>Click here</Link></p>
            </div>

        </div>
    )
}

export default page