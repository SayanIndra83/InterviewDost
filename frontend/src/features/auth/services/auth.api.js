import axios from "axios"

const auth = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})

auth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export async function Register({userName, email, password}) {
    try {
        const res = await auth.post(`/api/auth/signup`, {
            userName, email, password
        }) 
    //    console.log(res)
    const data = res?.data
       if(data.success){
        if(data.token) localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        return data
       }
       
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

       const data = res.data
       if(data.success){
        if(data.token) localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        return data
       }
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