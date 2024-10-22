import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useGetUserProfile from '@/hooks/useGetUserProfile'
import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile } = useSelector(store => store.auth);
  const isLoggedInUserProfile = true;
  const isFollowing = true;

  return (
    <div className='max-w-5xl flex justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
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
                      <Button variant='secondary' className='bg-gray-200 hover:bg-gray-300 h-8'>Edit Profile</Button>
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
              <div>
                
              </div>
            </div>
          </section>
        </div>
      </div >
    </div >
  )
}

export default Profile
