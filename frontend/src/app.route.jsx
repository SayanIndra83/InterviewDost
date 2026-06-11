import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login.jsx"
import Register from "./features/auth/pages/Register.jsx"
import Protected from "./features/auth/components/Protected.jsx"
import Home from "./features/ai/pages/Home.jsx"
import Interview from "./features/ai/pages/Interview.jsx"
import AppLayout from "./layout/AppLayout.jsx"


export const router = createBrowserRouter(
    [
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
{   element: <AppLayout/>,
children:[
    {
        path:"/",
        element: <Home/>
    }
]
    },
    {
        element: <Protected><AppLayout/></Protected>,
        children:[
    {
        path:"/interview/:interviewId",
        element: <Interview/>
    },
        ]
    }
    
],
{
    basename: '/Interview-Ai'
}) 
