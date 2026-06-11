import jwt from "jsonwebtoken";
import User from "../models/user.models.js"
import bcrypt from "bcrypt"
import Blacklisttoken from "../models/blacklist.models.js"

const registerUser = async (req, res) => {
    try {
        // getting datas from body
        const { userName, email, password } = req.body;
        // console.log("got response from body:", req.body)
        // console.log("Hello")
        // if any field is empty
        if ([userName, email, password].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // what if userName or email already exists
        const existingUser = await User.findOne({
            $or: [{ userName }, { email }]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this username or email is already registered" })
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // create
        const user = await User.create({
            userName, email, password: hashedPassword
        })

        // token creation
        const token = jwt.sign({
            _id: user._id, email: user.email, userName: user.userName
        }, process.env.JWT_SECRET, { expiresIn: "1d" })


        // check if user created otherwise throw error

        if (!user) {
            return res.status(400).json({ success: false, message: "Failed to create a new user" })
        }
        // return json with user
        const cookieOptions = {
            httpOnly: true, // Prevents JavaScript from accessing the cookie (security)
            secure: true,   // Requires HTTPS (which Render and GitHub Pages both use)
            sameSite: "none" // CRITICAL: Allows cross-origin cookies!
        };
        res.cookie("token", token, cookieOptions)
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user:{
                username: user.userName,
                email: user.email,
                _id: user._id
            }
        })
    } catch (error) {
        console.log("Internal server error during registration.", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration.",
        })
        
    }

}

const loginUser = async (req, res) => {
    try {
        // get email, password from body

        const { email, password } = req.body;

        // fields should not be empty
        if([email, password].some((field) => field?.trim() === "")){
            res.status(400).json({ success: false, message: "All fields are required" })
        }

        // check any user with this email exists or not ?
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "User with this email does not exist." })};

        // now check the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        // console.log(isPasswordCorrect)
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { _id: existingUser._id, userName: existingUser.userName, email: existingUser.email }, process.env.JWT_SECRET, {expiresIn:"1d"}
        )


        const cookieOptions = {
            httpOnly: true, // Prevents JavaScript from accessing the cookie (security)
            secure: true,   // Requires HTTPS (which Render and GitHub Pages both use)
            sameSite: "none" // CRITICAL: Allows cross-origin cookies!
        };

        res.cookie("token", token, cookieOptions)
        return res.status(201).json({
            success: true,
            user:{
                email,
                username: existingUser.userName,
                _id: existingUser._id

            },
            message: "User successfully logged in."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during logging in.",
            error
        })

    }
}

const logoutUser = async(req, res) => {
    try {
         const token = req.cookies.token;

        //  console.log("Logging out user:",req.user)
        // console.log("Logout token: ", token)

        // what if token doesnot exist
        if (!token) return res.status(400).json({ success: false, messagae: "Unauthorized User" })
        
        // verify with jwt
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if (err) {
                return res.status(401).json({
                    success: false,
                    messagae: "Unauthorized User"
                })
            }
        })

        // store in blacklist
        const db_token = await Blacklisttoken.create({token})
        // console.log("Db response: ", db_token)

        res.clearCookie("token")

        // console.log("successfully logged out")
            return res.status(201).json({
                success: true,
                message: "User logged out successfully."
            })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during logging out.",
            error
        })

    }
}

const getUser = async(req, res) => {
try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(200).json({ user: null });

    const isBlacklisted = await Blacklisttoken.findOne({ token });

    if (isBlacklisted) return res.status(200).json({ user: null });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id); 
        
        if (!user) return res.status(200).json({ user: null });
    
    return res.status(201).json({
        message:"User fetched successfully",
        user:{
            id:user.id,
            email: user.email,
            userName: user.userName
        }
    })


    } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error while fetching user details.",
                error
            })

    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}