import jwt from "jsonwebtoken"
import Blacklisttoken from "../models/blacklist.models.js";
export const isAuthinticated = async(req, res, next) => {
    // console.log(req.headers.authorization)
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token) return res.status(400).json({success: false, message:"Access Denied. No token found."})
    
        
    try {
        // what if token already exists in db for blacklist?
        const existingToken = await Blacklisttoken.findOne({token});
        if(existingToken){
            return res.status(401).json({success: false, message:"Unauthorized User. Token is blacklisted."})}

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ 
            success:false,
            message:"Invalid token"
        })
    }
}