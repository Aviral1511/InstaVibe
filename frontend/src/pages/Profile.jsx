import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='max-w-5xl flex justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-40 w-40'>
              <AvatarImage src={userProfile?.profilePicture} alt='profile' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to={`/account/edit`}><Button variant='secondary' className='bg-gray-200 hover:bg-gray-300 h-8'>Edit Profile</Button></Link>
                      <Button variant='secondary' className='bg-gray-200 hover:bg-gray-300 h-8'>View Archieve</Button>
                      <Button variant='secondary' className='bg-gray-200 hover:bg-gray-300 h-8'>Ad Tool</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='bg-gray-200 hover:bg-gray-300 h-8'>Unfollow</Button>
                        <Button variant='secondary' className='bg-gray-200 hover:bg-gray-300 h-8'>Message</Button>
                      </>

                    ) : (
                      <Button className='bg-blue-400 h-8 hover:bg-blue-500'>Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='font-semibold'>{userProfile?.bio || 'Bio here...'}</span>
                <Badge variant={'secondary'} className={'w-fit'}><AtSign className='pr-1' />{userProfile?.username}</Badge>
                <span>👩🏻‍💻Learnig code with me 🤩</span>
                <span>😍 Teaching Fun😍</span>
                <span>🤩 Enjoying Life 😁</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-300'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-b border-b-black' : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-b border-b-black' : ''}`} onClick={() => handleTabChange('saved')}>SAVED</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold border-b border-b-black' : ''}`} onClick={() => handleTabChange('reels')}>REELS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold border-b border-b-black' : ''}`} onClick={() => handleTabChange('tags')}>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPosts.map((post) => {
                return (
                  <div key={post._id} className='relative group cursor-pointer'>
                    <img src={post?.image} alt="postimage" className='rounded-md my-2 w-full aspect-square object-cover'/>
                    <div className='absolute rounded-md my-2 inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='text-white flex items-center space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes?.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments?.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div >
    </div >
  )
}

export default Profile
