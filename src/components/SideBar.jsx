import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, MoveLeft, Search } from 'lucide-react';
import { axiosInstance } from '../config/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import userConversation from '../store/conversationStore';
import { useSocketContext } from '../config/socketContext';

export default function SideBar({ onSelectUser }) {
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessageUsers, setNewMessageUsers] = useState('')
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { message, selectedConversation, setSelectedConversation } = userConversation()
    const [auth, setAuth] = useState(null);
    const { onlineUser,setMessage, messages,socket } = useSocketContext();

    const newOnline = chatUser.map((user) => (user?._id))

    const isOnline = newOnline.map(userId => onlineUser.includes(userId));

    const navigate = useNavigate()


    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            setNewMessageUsers(newMessage)
        })
        return()=>socket?.off("newMessage")
    },[socket,messages])
    


    useEffect(() => {
        const chantUserHandler = async () => {
            try {
                const chatters = await axiosInstance.get('/user/currentChatters', { withCredentials: true });
                setChatUser(chatters?.data);
            } catch (error) {
                console.log(error);
            }
        };

        chantUserHandler();
    }, []);

    // Handle search submit
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) {
            toast.info('Please enter something to search');
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.get(`user/search?search=${searchInput}`, {
                withCredentials: true,
            });
            if (response.data.length === 0) {
                toast.info('User Not Found');
            }
            setSearchResult(response.data);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const checkAuth = async () => {
        try {
          const response = await axiosInstance.get('/user/profile', { withCredentials: true });
          setAuth(response?.data?.data);
        
          
        } catch (error) {
          console.error('Error checking authentication:', error);
        }
      };
      useEffect(() => {
        checkAuth();
      }, []);
    

    // Handle user click
    const handleUserClick = (user) => {
        onSelectUser(user)
        setSelectedConversation(user)
        setSelectedUserId(user._id);
        setNewMessageUsers('')

    };

    const handleSearchBack = () => {
        setSearchInput('')
        setSearchResult([])

    }
    const handleLogout = () => {
        console.log("Initiating logout");

        // Prompt the user before making the API call
        if (window.confirm('Are you sure you want to logout?')) {
            axiosInstance.post('/user/logout', {}, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    toast.success(response.data.message);
                    navigate('/');
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                    toast.error("An error occurred during logout");
                });
        } else {
            // User canceled logout
            console.log("Logout canceled");
        }
    };



    return (
        <div className="h-full  bg-slate-100 shadow-lg rounded-lg p-4">
            <div className="flex justify-between gap-2 items-center mb-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center w-full space-x-2">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type="text"
                        className=" p-2 border bg-white border-gray-300 rounded-full"
                        placeholder="Search"
                    />
                    <button type="submit" className="p-2 bg-sky-700 text-white rounded-full hover:bg-sky-600">
                        <Search />
                    </button>
                </form>
                <div></div>
                <img
                    src="https://st5.depositphotos.com/20923550/70467/v/450/depositphotos_704675848-stock-illustration-cute-cartoon-boy-baseball-cap.jpg"
                    alt="profile"
                    className="h-12 w-12 rounded-full cursor-pointer"
                />
            </div>

            <div className="divider mb-4"></div>

            {searchResult.length > 0 ? (
                <div className="max-h-screen overflow-y-auto"> {/* Make the results scrollable */}
                    {searchResult.map((user, index) => (
                        <div
                            key={user._id}
                            className="flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-200 rounded-lg"
                            onClick={() => handleUserClick(user)}
                        >
                            <div className={`avatar w-10 h-10 rounded-full ${isOnline[index] ? 'online' : ''}`}>
                                <img src={user.profilePic} alt={user.userName} className="w-10 h-10 rounded-full" />
                            </div>

                            <span>{user.userName}</span>
                        </div>
                    ))}
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handleSearchBack} className='bg-white rounded-full px-2 py-1 self-center'>
                            <ArrowLeft size={25} />

                        </button>
                    </div>
                </div>

            ) : (
                <div className="space-y-">
                    {chatUser.length === 0 ? (
                        <div className="text-center text-xl text-gray-500">
                            <p>Why are you alone? 🤔</p>
                            <p>Search for someone to chat with!</p>
                        </div>
                    ) : (
                        <div className=" overflow-y-auto"> {/* Make the chat list scrollable */}
                            {chatUser.map((user, index) => (
                                <div
                                    key={user._id}
                                    className={`flex items-center space-x-4 p-2  cursor-pointer hover:bg-gray-200 rounded-lg ${selectedUserId === user._id ? 'bg-sky-100' : ''
                                        }`}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className={`avatar w-10 h-10 rounded-full ${isOnline[index] ? 'online' : ''}`}>
                                        <img src={user.profilePic} alt={user.userName} className="w-10 h-10 rounded-full" />
                                    </div>

                                    <span>{user.userName}</span>

                                    <div className='pl-40 items-center flex justify-center'>
                                        { newMessageUsers.reciverId === auth?._id && newMessageUsers.senderId === user?._id ?
   <div className='ml-auto bg-green-700 text-xs text-white px-2 rounded-full'>+1</div>:<></>
                                        }
                                     
                                    </div>
                                </div>

                            ))}
                        </div>
                    )}
                    <div onClick={handleLogout} className='justify-items-end mt-96 ite px-1 py-1 flex cursor-pointer hover:text-white hover:bg-red-600 overflow-hidden w-32 rounded-lg'>
                        <button className=' w-10 c rounded-lg'>
                            <LogOut size={25} />
                        </button>
                        <p className='text-sm py-1'>Logout</p>
                    </div>
                </div>

            )}

        </div>


    );
}
