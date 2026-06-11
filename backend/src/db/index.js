import mongoose from "mongoose";

const db_connect = async() => {
    try {
       const connectionInstance = await mongoose.connect(process.env.MONGO_URI) 
       console.log(`\n Congratulations, MongoDB is connected !! DB_HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Failed to connect to Mongo DB", error)
        process.exit(1)
    }
}

export {db_connect}