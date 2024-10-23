import Messages from '@/components/Messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setSelectedUser } from '@/redux/authSlice';
import { MessageCircleCodeIcon } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const ChatPage = () => {
    const { user, suggestedUsers, selectedUser } = useSelector(user => user.auth);
    const isOnline = true;
    const dispatch = useDispatch();

    return (
        <div className='flex ml-[16%] h-screen'>
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold text-xl mb-4 px-3'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            return (
                                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer'>
                                    <Link to={`/profile/${user?._id}`}>
                                        <Avatar className='w-14 h-14'>
                                            <AvatarImage src={suggestedUser?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-bold'>{selectedUser?.username}</span>
                            </div>
                        </div>
                            <Messages selectedUser={selectedUser}/>
                            <div className='flex items-center p-4 border-t border-t-gray-300'>
                                <Input type='text' placeholder='Messages...' className='flex-1 mr-2'/>
                                <Button>Send</Button>
                            </div>
                    </section>
                ) : (
                    <div className='flex flex-col justify-center items-center mx-auto'>
                        <MessageCircleCodeIcon className='h-32 w-32 my-4'/>
                        <h1 className='font-medium text-xl'>Your Messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage
