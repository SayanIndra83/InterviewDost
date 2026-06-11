import { useState, useEffect } from "react";
import { createContext } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({children}) => {
const [loading, setLoading] = useState(true)
const [user, setUser] = useState(null)

useEffect(() => {
    const getAndSetUser = async () => {
        // console.log("trying to get response from getUser")
        try {
            const data = await getMe()
            // console.log(data.user)
            if(data && data.user) {setUser(data.user)}
            
        } catch (error) {
            setUser(null)
        }finally{
            setLoading(false)
        }
    }

    getAndSetUser()
}, [])

return(
    <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
        {children}
    </AuthContext.Provider>
)
}

