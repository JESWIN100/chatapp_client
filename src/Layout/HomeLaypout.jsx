import React from 'react'
import { Outlet } from 'react-router-dom'

export default function HomeLaypout() {
  return (
    <div>
        <div className='min-h-screen bg-white text-black'>
        <Outlet/>
        </div>
    </div>
  )
}
