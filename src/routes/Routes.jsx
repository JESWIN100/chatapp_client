import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RootLayout from "../Layout/RootLayout";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";




export const router=createBrowserRouter([
    {
        path:"/",
        element:<RootLayout/>,
        children:[
            {
                path:"/",
                element:<LoginPage/>

            },
            {
                path:"sign-up",
                element:<SignUpPage/>

            },

              {
                path:"home",
                element:<HomePage/>

            }

        ]
    }
])
