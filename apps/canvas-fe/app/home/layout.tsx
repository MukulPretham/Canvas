import  JoinRoom  from '../components/JoinRoom';
import React from 'react'

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='w-[100vw] h-[100vh] flex'>
        <div className='overflow-scroll h-[100%] w-[30%] border-2 border-white flex flex-col items-center'>
            <JoinRoom/>
        </div>
        {children}
    </div>
  )
}

export default layout