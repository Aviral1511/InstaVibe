import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
        MainLayout
      <div><Outlet /></div>
    </div>
  )
}

export default MainLayout
