"use client"
import AuthPage from '@/components/AuthPage'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        console.log(token);
        async function validate(token: string) {
            const result = await fetch("http://localhost:8081/",{
                headers:{
                    authorization: token
                }
            });
            console.log(result);
            if(result.status == 200){
                
                redirect("/home");
            }
        }
        validate(token);
    }, [])

    return (
        <div className='h-[100vh] w-[100vw] flex flex-col justify-center items-center'>
            <div className='h-[50%] w-[50%] flex flex-col justify-center items-center'>
                <AuthPage type='login' />
            </div>
        </div>
    )
}

export default page