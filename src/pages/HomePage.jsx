import React from 'react';
import SideBar from '../components/SideBar';
import MessageContainer from '../components/MessageContainer';
import { useState } from 'react';

export default function HomePage() {
    const [selectedUser,setSelectedUser]=useState(null)
    const [isSideBarBisible,setIsSideBarBisible]=useState(true)

const handleUserSelect=(user)=>{
    setSelectedUser(user)
    setIsSideBarBisible(false)

}
const handleShowSidebar=()=>{
    setIsSideBarBisible(true)
    setSelectedUser(null)
}

    return (
        <div className="flex justify-between min-w-full md: md:max-w-[65%]
        px-2 h-[95%] md:h-full md:px-8
        rounded-xl shadow-lg md:pt-10
        bg-gray-400 bg-clip-padding
        backdrop-filter backdrop-blur-lg
        bg-opacity-0 ">
            <div className={`w-100   py-2 md:flex ${isSideBarBisible ? "" :'hidden'}`}>
                <SideBar onSelectUser={handleUserSelect} />
            </div>
            <div className={`divider divider-horizontal  px-3 md:flex ${isSideBarBisible ?'': 'hidden'} ${selectedUser ? 'block': 'hidden'}`}></div>
            <div className={`flex-auto ${selectedUser ? '' :'hidden md:flex'}  bg-gray-200`}>
            <MessageContainer onBackUser={handleShowSidebar}/>
            
            </div>
        </div>
    );
}
