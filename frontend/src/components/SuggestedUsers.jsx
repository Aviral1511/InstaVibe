import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600 mx-3'>Suggested for you</h1>
                <span className='font-medium ml-3'>See all</span>
            </div>
            {
                suggestedUsers.map((user) => (
                    <div key={user._id} className='flex items-center justify-between my-5'>
                        <div className='flex items-center gap-4'>
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className=''>
                                <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user.username}</Link> </h1>
                                <span className='text-sm text-gray-600'>{user?.bio || 'Bio here...'}</span>
                            </div>
                        </div>
                        <span className='font-bold text-xs text-blue-400 hover:text-blue-500 cursor-pointer'>Follow</span>
                    </div>
                ))
            }
        </div>
    )
}

export default SuggestedUsers
