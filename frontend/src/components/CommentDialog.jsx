import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const CommentDialog = ({ open, setOpen }) => {

    const [text, setText] = useState("");

    const changeEventHandler = (e) => {
        const input = e.target.value;
        if(input.trim()){
            setText(input);
        } else {
            setText("");
        }
    }

    const sendMessageHandler = async () => {
        console.log(text);
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className="flex flex-1">
                    <div className='w-1/2'>
                        <img className='rounded-l-lg h-full w-full object-cover' src={'/nature.jpeg'} alt='post_img' />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between m-3'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>username</Link>
                                    {/* <span>Bio...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer'/>
                                </DialogTrigger>
                                <DialogContent className='flex flex-col items-center text-center text-sm '>
                                    <div className='cursor-pointer w-full text-red-500 font-bold'>Unfollow</div>
                                    <div className='cursor-pointer w-full'>Add to Favorites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            Comments
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <Input type='text' placeholder='Add a comment ...' value={text} onChange={changeEventHandler} className='w-full outline-none border border-gray-300 p-2 rounded'/>
                                <Button disabled={!text.trim()} onClick={sendMessageHandler}>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
