import { USER_API_ENDPOINT } from '@/utils/ApiEndPoints'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const {user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    
    const items = [
        { icon: <Home />, text: 'Home' },
        { icon: <Search />, text: 'Search' },
        { icon: <TrendingUp />, text: 'Explore' },
        { icon: <MessageCircle />, text: 'Messages' },
        { icon: <Heart />, text: 'Notifications' },
        { icon: <PlusSquare />, text: 'Create' },
        {
            icon: (
                <Avatar className='w-7 h-7'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: 'Profile'
        },
        { icon: <LogOut />, text: 'Logout' }
    
    ]
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {withCredentials:true});
            if(res.data.success){
                dispatch(setUser(null));
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (text) => {
        if(text === 'Logout') logoutHandler();
        else if (text === 'Create') setOpen(true);
    }

    return (
        <div className='fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        items.map((item, index) => {
                            return (
                                <div key={index} onClick={() => sidebarHandler(item.text)} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 '>
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen}/>
        </div>
    )
}

export default LeftSidebar
