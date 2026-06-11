import axios from "axios"

const auth = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})
export async function Register({userName, email, password}) {
    try {
        const res = await auth.post(`/api/auth/signup`, {
            userName, email, password
        }) 
    //    console.log(res)
       return res.data
       
    } catch (error) {
        throw error;
    }
}

export async function Login({email, password}) {
    try {
        const res = await auth.post(`/api/auth/login`,
            {
                password, email
            }
        )

        return res.data
    } catch (error) {
        throw error;
    }
}
export async function Logout() {
    try {
        const res = await auth.get(`/api/auth/logout`)

        return res.data
    } catch (error) {
        throw error;
    }
}
export async function getMe() {
    try {
        // console.log("Sending response to the api \n")
        const res = await auth.get(`/api/auth/get-me`)
        // console.log(res)
        return res.data
    } catch (error) {
        return null
    }
}