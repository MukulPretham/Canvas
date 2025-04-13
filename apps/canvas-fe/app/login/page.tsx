"use client"
import AuthPage from '@/components/AuthPage'
import React from 'react'

const page = () => {
    return (
        <div className='h-[100vh] w-[100vw] flex flex-col justify-center items-center'>
            <div className='h-[50%] w-[50%] flex flex-col justify-center items-center'>
                <AuthPage type='login' />
            </div>
        </div>
    )
}

export default page