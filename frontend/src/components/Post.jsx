import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import { POST_API_ENDPOINT } from '@/utils/ApiEndPoints'
import { setPosts } from '@/redux/postSlice'

const Post = ({post}) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const {posts} = useSelector(store=>store.post);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [postComments, setPostComments] = useState(post.comments);
    const dispatch = useDispatch();


    const changeEventHandler = (e) => {
        const input = e.target.value;
        if(input.trim()){
            setText(input);
        } else {
            setText("");
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${POST_API_ENDPOINT}/delete/${post?._id}`, {withCredentials:true});
            if(res.data.success){
                const updatedPost = posts.filter((postItem) =>  postItem._id !== post?._id);
                dispatch(setPosts(updatedPost));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const likeDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${POST_API_ENDPOINT}/${post._id}/${action}`, {withCredentials : true});
            if(res.data.success){
                const updatedLike = liked ?  postLike - 1 : postLike + 1;
                setPostLike(updatedLike);
                setLiked(!liked);
                toast.success(res.data.message);
                const updatedPost = posts.map((postItem) => postItem._id === post._id ? {
                    ...postItem, likes : liked ? postItem.likes.filter(id => id !== user._id) : [...postItem.likes, user._id]
                } : postItem);
                dispatch(setPosts(updatedPost));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`${POST_API_ENDPOINT}/${post._id}/comment`, {text}, {
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
                    p._id === post._id ? {...p, comments:updatedComment} : p
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
                            user  && user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit'>Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post?.image} alt='post_img' />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    {
                        liked ? <FaHeart size={'22px'} className='cursor-pointer text-red-600' onClick={likeDislikeHandler}/> : 
                        <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' onClick={likeDislikeHandler}/>
                    }
                    <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-normal block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            <span onClick={() => setOpen(true)} className='cursor-pointer text-sm text-gray-500' >View all {postComments.length} comments</span>
            <CommentDialog open={open} setOpen={setOpen}/>
            <div className='flex items-center justify-between my-2'>
                <Input type="text" placeholder='Add a comment...' value={text} onChange={changeEventHandler} className='outline-none text-sm w-full mr-2'/>
                {
                    text && <button className='text-[#3BADF8]' onClick={commentHandler}>Post</button> 
                }
                
            </div>

        </div>
    )
}

export default Post
