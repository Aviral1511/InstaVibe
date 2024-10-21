import Feed from '@/components/Feed'
import RightSidebar from '@/components/RightSidebar'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import React from 'react'
import { Outlet } from 'react-router-dom'

const HomePage = () => {
  useGetAllPosts();
  return (
    <div className='flex'>
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default HomePage
