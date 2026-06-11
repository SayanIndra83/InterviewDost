import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
userName:{
    type: String,
    required:true,
    unique:[true, "This userName is already taken"]
},
email:{
    type: String,
    unique:[true, "This Email is already registered"],
    required: true,
},
password:{
    type: String,
    required: true,
},
}, {timestamps: true})

export default mongoose.model("User", userSchema);