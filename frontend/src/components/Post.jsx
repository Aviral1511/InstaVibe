import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'
import { useSelector } from 'react-redux'

const Post = ({post}) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    const changeEventHandler = (e) => {
        const input = e.target.value;
        if(input.trim()){
            setText(input);
        } else {
            setText("");
        }
    }

    return (
        <div className='p-2 my-8 w-full max-w-sm mx-auto border border-gray-200 rounded-lg'>
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                    <Avatar>
                        <AvatarImage src={post?.author?.profilePicture} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post?.author?.username} </h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant='ghost' className='cursor-pointer w-fit hover:text-red-500 text-[#ED4956] font-bold'>Unfollow</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit '>Add to favouraites</Button>
                        {
                            user  && user?._id === post?.author?._id && <Button variant='ghost' className='cursor-pointer w-fit'>Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post?.image} alt='post_img' />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-normal block mb-2'>{post?.likes?.length} likes</span>
            <p>
                <span className='font-medium mr-2'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            <span onClick={() => setOpen(true)} className='cursor-pointer text-sm text-gray-500' >View all {post?.comments?.length} comments</span>
            <CommentDialog open={open} setOpen={setOpen}/>
            <div className='flex items-center justify-between my-2'>
                <Input type="text" placeholder='Add a comment...' onChange={changeEventHandler} className='outline-none text-sm w-full mr-2'/>
                {
                    text && <button className='text-[#3BADF8]'>Post</button> 
                }
                
            </div>

        </div>
    )
}

export default Post
