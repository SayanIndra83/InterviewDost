import { useContext } from "react";
import {AuthContext} from "../auth.context.jsx"
import {getMe, Login, Register, Logout} from "../services/auth.api.js"
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
export const useAuth = () => {

    const navigate = useNavigate()
    // Taking instance of AuthContext
    const context = useContext(AuthContext)

    // taking out all values inside AuthContext
    const {user, setUser, loading, setLoading} = context

    // taking all apis here
    const  handleLogin = async(email, password) => {
    setLoading(true)
    try {
        const res = await Login({email, password});
        setUser(res.user)
        toast.success(res.message ?? "Log in successful")
        navigate("/")

    } catch (error) {
       const errorMessage = error.response?.data?.message || "Login failed";
        toast.error(errorMessage)
    } finally {
        setLoading(false)
    }
}

    const handleRegister = async (userName, email, password) => {
        
        setLoading(true)
        // console.log(userName)
        try {
        const res = await Register({userName, email, password});
        // console.log(res)
        setUser(res.user)
        toast.success(res.message ?? "User created")
        navigate("/")
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Internal server error";
            toast.error(errorMessage,{
                duration: 1500,
                position: "top-right"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await Logout();
            setUser(null)
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Logout failed";
            toast.error(errorMessage,{
                duration: 1500,
                position: "top-right"
            })
        } finally {
            setLoading(false)
        }
    }




    return {handleLogin, handleRegister, handleLogout, user, loading}   
}