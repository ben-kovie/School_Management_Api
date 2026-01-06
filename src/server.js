import dotenv from "dotenv"
import app from "./app.js"
import {connectDB} from "../config/connectDB.js"

dotenv.config({path: "./config/.env"})

const PORT = process.env.PORT || 5000

const startServe = async ()=>{
    await connectDB()
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
}

startServe()