import React, { useEffect, useRef, useState } from 'react';
import userConversation from '../store/conversationStore';
import { axiosInstance } from '../config/axiosInstance';
import { ArrowLeft, MessagesSquare, SendIcon } from 'lucide-react';
import audio from '../assets/Sending Message Sound.mp3'
import { useSocketContext } from '../config/socketContext';

export default function MessageContainer({ onBackUser }) {
  const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
  const [auth, setAuth] = useState(null);
  const {socket}=useSocketContext()
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false)
  const [sendData, setSendData] = useState("")
  const lastMessageRef = useRef()


useEffect(()=>{
 socket?.on("newMessage",(newMessage)=>{
  const sendSound = new Audio(audio);
sendSound.volume = 0.3;
sendSound.play()
setMessage([...messages,newMessage])
 })
 return()=>socket?.off("newMessage")
},[socket,setMessage,messages])



  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, 100);
  }, [messages])


  // Fetch messages for selected conversation
  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(`/message/get/${selectedConversation._id}`, { withCredentials: true });
        setMessage(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, setMessage]);

  // Check user authentication and profile information
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

  const handleMessage = (e) => {
    setSendData(e.target.value)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
setSending(true)


try {

const send=await axiosInstance.post(`/message/send/${selectedConversation?._id}`,{message:sendData},{withCredentials:true})
const data=await send.data
console.log(data);

setSending(false)
setSendData('')
setMessage([...messages,data])


} catch (error) {
  setSending(false)
  console.log(error);
  
}
  }



  return (
    <div className="md:min-w-[99%] h-screen flex flex-col py-4 bg-gray-100 rounded-lg shadow-lg">
    {selectedConversation === null ? (
      <div className="flex items-center justify-center w-full h-full">
        <div className="px-4 text-center text-2xl text-gray-800 font-semibold flex flex-col items-center gap-2">
          <p className="text-2xl">Welcome! 👋 {auth?.fullName}</p>
          <p className="text-lg text-gray-600">Select a chat to start messaging</p>
          <MessagesSquare className="w-full h-10 text-center text-sky-500" />
        </div>
      </div>
    ) : (
      <>
       <div className="flex justify-between items-center gap-2 bg-sky-600 px-4 py-2 rounded-lg shadow-md mb-2 sticky top-0 z-10">
  <button onClick={() => onBackUser(true)} className="md:hidden bg-white px-2 py-1 rounded-full">
    <ArrowLeft size={25} className="text-sky-600" />
  </button>
  <div className="flex items-center gap-3">
    <img className="rounded-full w-10 h-10 cursor-pointer shadow-sm" src={selectedConversation?.profilePic} alt="Profile" />
    <span className="text-white text-xl font-semibold">{selectedConversation?.userName}</span>
  </div>
</div>

  
        <div className="flex-1 overflow-auto bg-white rounded-lg p-4 shadow-inner">
          {loading ? (
            <div className="flex w-full h-full justify-center items-center">
              <div className="loading loading-spinner text-sky-500"></div>
            </div>
          ) : messages?.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">Send a message to start a conversation 😉</p>
          ) : (
            messages?.map((message, index) => (
              <div key={index} ref={lastMessageRef} className={`chat ${message.senderId === auth?._id ? 'chat-end' : 'chat-start'} mb-4`}>
                <div className=" bg-sky-600 text-white px-4 py-2 rounded-lg shadow-md">{message.message}</div>
                <div className="chat-footer text-xs text-gray-400 mt-1">
                  {new Date(message?.createdAt).toLocaleDateString('en-In', { hour: 'numeric', minute: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>
  
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm">
            <input
              onChange={handleMessage}
              value={sendData}
              required
              id="message"
              type="text"
              placeholder="Type your message..."
              className="w-full bg-transparent outline-none px-4 py-2 rounded-full text-gray-800 placeholder-gray-500"
            />
            <button type="submit" className="flex items-center justify-center p-2">
              {sending ? (
                <div className="loading loading-spinner text-sky-500"></div>
              ) : (
                <SendIcon size={25} className="text-sky-600 cursor-pointer rounded-full bg-gray-100 p-1" />
              )}
            </button>
          </div>
        </form>
      </>
    )}
  </div>
  
  );
}
