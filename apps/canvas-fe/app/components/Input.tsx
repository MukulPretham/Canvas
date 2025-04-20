import React from 'react'

type inputParams = {
    placeholder: string,
    bg: string,
    color: string
}

const Input = ({ placeholder,bg,color }:inputParams) => {
    return (
        <input className='border-2 w-[250px] h-' type="text" placeholder={placeholder} />
    )
}

export default Input