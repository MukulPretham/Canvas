"use client"
import { redirect } from 'next/navigation'
import React, { useRef, useState } from 'react'

const inputBoxStyles = "border-2 w-[85%] border-white p-2 focus:outline-none rounded-2xl"

const AuthPage = ({ type }: {
    type: "signup" | "login"
}) => {
    
    let usernameRef = useRef<HTMLInputElement>(null);
    let passwordRef = useRef<HTMLInputElement>(null);

    

    const [message,setMessage] = useState("");

    let signinHandler = async()=>{
        let response = await fetch("http://localhost:8081/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body:JSON.stringify({
                username: usernameRef.current?.value,
                password: passwordRef.current?.value
            })
        });
        if(response.status == 200){
            redirect('/login')
        }
        let data = await response.json();
        console.log(data);
        setMessage(data.name);
    }

    let loginHandler = async()=>{
        let response = await fetch("http://localhost:8081/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body:JSON.stringify({
                username: usernameRef.current?.value,
                password: passwordRef.current?.value
            })
        });
        let data = await response.json();
        console.log(data);
        if(response.status == 200){
            localStorage.setItem("token",data.token);
            redirect('/home');
        }
        
        setMessage(data.message);
    }

    return (
        <div className='w-[50%] flex flex-col justify-center items-center gap-5'>
            {type=="signup"?<div className='text-2xl' >Create new account</div> : 
            <div className='text-2xl' >Log into existing account</div>}
            {message && <div className='text-red-500'>{message}</div>}
            <input ref={usernameRef} className={inputBoxStyles} type="text" placeholder='username' />
            <input ref={passwordRef} className={inputBoxStyles} type="password" placeholder='password' />
            <button onClick={type=="signup" ? signinHandler: loginHandler } className='bg-white text-black p-1.5 w-[24%] rounded-2xl'>{type}</button>
        </div>
    )
}

export default AuthPage
