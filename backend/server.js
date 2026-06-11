import app from "./src/app.js"
import "dotenv/config";
import { db_connect } from "./src/db/index.js"
const port = 8000

db_connect()
.then(() => {
    app.listen(port, () => {
    console.log("Server is running on port:", port)
    app.on("error", (error) =>{
        console.log("Not able to communicate with database :", error);
        process.exit(1)
    })
});
})
.catch((err) =>{
    console.log("Failed to connect db", err)
})