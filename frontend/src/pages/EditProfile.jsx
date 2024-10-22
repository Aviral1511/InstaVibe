import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { setUser } from '@/redux/authSlice';
import { readFileAsDataUrl, USER_API_ENDPOINT } from '@/utils/ApiEndPoints';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useDebugValue, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({...input, profilePicture:file});
        }
    }

    const selectChangeHandler = (value) => {
        setInput({...input, gender:value});
    }

    const editProfileHandler = async () => {
        const formdata = new FormData();
        formdata.append('profilePicture', input.profilePicture);
        formdata.append('gender',  input.gender);
        formdata.append('bio', input.bio);
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_ENDPOINT}/profile/edit`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials : true,
            });
            if(res.data.success){
                const updatedUser = {
                    ...user, 
                    bio : res.data.user?.bio,
                    profilePicture :  res.data.user?.profilePicture,
                    gender : res.data.user?.gender
                }
                dispatch(setUser(updatedUser));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col w-full gap-6 my-8'>
                <h1 className='font-bold text-xl'>Edit Your Profile</h1>
                <div className='flex items-center justify-between bg-gray-200 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className=''>
                            <h1 className='font-bold text-sm'>{user.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                    <Button onClick={() => imageRef.current.click()} className='h-8 bg-blue-500 hover:bg-blue-600'>Change Photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-lg mb-2'>Bio</h1>
                    <Textarea name='bio' value={input.bio} onChange={(e) =>  setInput({...input, bio:e.target.value})} />
                </div>
                <div>
                    <h1 className='font-bold text-lg mb-2'>Gender : </h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                {
                    loading ? (
                        <Button className='w-fit bg-blue-500 hover:bg-blue-600'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please Wait
                        </Button>
                    ) : ( <Button type='submit' onClick={editProfileHandler} className='w-fit bg-blue-500 hover:bg-blue-600'>Submit</Button>)
                }
                    
                </div>
            </section>
        </div>
    )
}

export default EditProfile
