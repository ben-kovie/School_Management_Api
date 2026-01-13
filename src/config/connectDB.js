import mongoose from "mongoose"

 export const connectDB = async ()=>{
    try{
 const db = process.env.MONGO_URL
    await mongoose.connect(db, {})
    console.log("DataBase connected succesfully")

    }catch
    (err){
       console.log("failed to connect to dataBase")
       process.exit(1)
    }
}