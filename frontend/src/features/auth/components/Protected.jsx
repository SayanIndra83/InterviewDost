import {useAuth} from "../hooks/useAuth.js"
import React from 'react'
import { Navigate } from "react-router"
function Protected({children}) {
    const {loading, user} = useAuth()
    if(loading) return (<main><h3>Loading...</h3></main>)

    if(!user){
           return <Navigate to={"/login"}/>
        }
  return (
    children
  )
}

export default Protected
