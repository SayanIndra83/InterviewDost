import { useContext } from "react";
import {AuthContext} from "../auth.context.jsx"
import {getMe, Login, Register, Logout} from "../services/auth.api.js"
import { useNavigate } from "react-router";
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
        navigate("/")

    } catch (error) {
       const errorMessage = error.response?.data?.message || "Login failed";
        alert(errorMessage)
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
        navigate("/")
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed";
            alert(errorMessage)
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
            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }




    return {handleLogin, handleRegister, handleLogout, user, loading}   
}