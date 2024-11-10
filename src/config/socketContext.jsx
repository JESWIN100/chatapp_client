import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { axiosInstance } from './axiosInstance';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [auth, setAuth] = useState(null);

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

    useEffect(() => {
        if (auth) {
            const socket = io("http://localhost:3000/", {
                query: {
                    userId: auth?._id,
                }
            });
            socket.on("getOnlineUsers", (users) => {
                setOnlineUser(users);
            });
            setSocket(socket);
            return () => socket.close();
        } else {
            if (socket) {
                setSocket(null);
            }
        }
    }, [auth]);

    return (
        <SocketContext.Provider value={{ socket, onlineUser }}>
            {children}
        </SocketContext.Provider>
    );
};
