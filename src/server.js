import dotenv from "dotenv"
import app from "./app.js"
import {connectDB} from "./config/connectDB.js"
import helmet from "helmet";

dotenv.config({ path:("./src/config/.env") });
app.use(helmet());

const PORT = process.env.PORT || 5000

const startServe = async ()=>{
    await connectDB()
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
}

startServe()