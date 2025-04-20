"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type room = {
    slug: string,
    roomId: string
}

const JoinRoom = () => {
    const router = useRouter();
    let init: room[] = []
    const [rooms, setRooms] = useState(init);
    const img = "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
    useEffect(() => {
        async function fetchData(token: string) {
            const res = await fetch("http://localhost:8081/rooms", {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                }
            });
            const data = await res.json();
            setRooms(data)
        }
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const rooms = fetchData(token);
    }, [])
    return (
        <>
            <button onClick={() => {
                router.push("/home/createRoom")
            }} className='bg-white mb-3 p-2.5 rounded-3xl text-black cursor-pointer mt-3 hover:bg-purple-500 hover:text-white'>Create a Room</button>
            
            {rooms.map( room => <div key={room.roomId} className="flex items-center gap-4 p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer w-full">
  <img src={img} className="w-12 h-12 rounded-full object-cover" />
  <div className="text-base font-medium text-white">{room.slug}</div>
</div>
 )}
        </>
    )
}

export default JoinRoom