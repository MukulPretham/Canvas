import  JoinRoom  from '@repo/ui/JoinRoom';
import React from 'react'

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='w-[100vw] h-[100vh] flex'>
        <div className='overflow-scroll h-{100%} w-[30%] flex justify-center items-center border-2 border-white'>
            <JoinRoom/>
        </div>
        <div className='h-full w-[70%] border-2 border-red-600'>

        </div>
    </div>
  )
}

export default layout