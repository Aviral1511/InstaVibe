import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { POST_API_ENDPOINT, readFileAsDataUrl } from '@/utils/ApiEndPoints';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({open, setOpen}) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const {posts} = useSelector(store=>store.post);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataUrl(file);
            setImagePreview(dataUrl);
        }
    }

    const createPostHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if(imagePreview) formData.append('image', file);
        formData.append('caption', caption);
        try {
            setLoading(true);
            const res = await axios.post(`${POST_API_ENDPOINT}/addpost`, formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                withCredentials : true
            });
            if(res.data.success){
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
            <DialogHeader className='flex items-center text-center font-semibold'>Create new post</DialogHeader>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="img"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-semibold text-xs'>{user?.username}</h1>
                    <span className='text-gray-600 text-xs'>{user?.bio}</span>
                </div>
            </div>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='Write a caption...'/>
            {
                imagePreview && (
                    <div className='w-full h-80 flex items-center justify-center'>
                        <img src={imagePreview} alt="img" className="w-full h-full rounded-md object-cover" />
                    </div>
                )
            }
            <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler}/>
            <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-blue-500 hover:bg-blue-600'>Select from device</Button>
            {
                imagePreview && (
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        </Button>
                    ) : (
                        <Button type='submit' className='w-full' onClick={createPostHandler}>Post</Button>
                    )
                )
            }
        </DialogContent>
    </Dialog>
  )
}

export default CreatePost
