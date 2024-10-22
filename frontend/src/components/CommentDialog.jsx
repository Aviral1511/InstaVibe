import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { POST_API_ENDPOINT } from '@/utils/ApiEndPoints'
import { setPosts } from '@/redux/postSlice'
import { toast } from 'react-toastify'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const {selectedPost} = useSelector(store=>store.post);
    const {posts} = useSelector(store=>store.post);
    const [postComments, setPostComments] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPost) {
            setPostComments(selectedPost.comments);
        }
    },[selectedPost]);

    const changeEventHandler = (e) => {
        const input = e.target.value;
        if(input.trim()){
            setText(input);
        } else {
            setText("");
        }
    }

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`${POST_API_ENDPOINT}/${selectedPost._id}/comment`, {text}, {
                headers : {
                    'Content-Type' : 'application/json',
                },
                withCredentials : true
            });
            // console.log(res.data);
            if(res.data.success){
                const updatedComment = [...postComments, res.data.comment];
                setPostComments(updatedComment);

                const updatedPostData = posts.map(p=>
                    p._id === selectedPost._id ? {...p, comments:updatedComment} : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className="flex flex-1">
                    <div className='w-1/2'>
                        <img className='rounded-l-lg h-full w-full object-cover' src={selectedPost?.image} alt='post_img' />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between m-3'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture}/>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
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
                            {
                                postComments?.map((comment) => <Comment key={comment._id} comment={comment}/>)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <Input type='text' placeholder='Add a comment ...' value={text} onChange={changeEventHandler} className='w-full text-sm outline-none border border-gray-300 p-2 rounded'/>
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
