import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex my-3 items-center'>
            <Avatar className='mr-1'>
                <AvatarImage src={comment?.author?.profilePicture} alt="shadcn"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm'>{comment?.author?.username}<span className='font-normal pl-1 '>{comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default Comment
