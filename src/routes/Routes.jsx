import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RootLayout from "../Layout/RootLayout";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";
import { UserAuth } from "./protectRoutes/UserAuth";
import HomeLaypout from "../Layout/HomeLaypout";




export const router=createBrowserRouter([
    {
        path:"/user",
        element:<RootLayout/>,
        children:[
            {
                path:"login",
                element:<LoginPage/>

            },
            {
                path:"sign-up",
                element:<SignUpPage/>

            },


        ]
    },
    {
        path:"/",
        element:<UserAuth><HomeLaypout/></UserAuth>,
        children:[
         
              {
                path:"/",
                element:<HomePage/>

            }

        ]
    }
])
