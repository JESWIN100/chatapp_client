import { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

export const UserAuth = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axiosInstance.get('user/check-user', {
          withCredentials: true,
        });
        setUser(response.data);
        console.log("response================", response);
      } catch (error) {
        console.error("Error checking user:", error);
        setUser(null);
        navigate('/user/login'); 
      }
    };

    checkUser();
  }, [navigate]);

  return user ? (
    children
  ) : (
    <div className="bg-white flex items-center justify-center "style={{height:"100vh"}}>
 <div className="loading loading-spinner text-sky-500">Loading...</div>
    </div>
   
  );
};
