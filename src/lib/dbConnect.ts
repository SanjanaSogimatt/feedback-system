import mongoose, { mongo } from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected)
    {
        console.log("Connected to database already")
        return
    }
    try{
        const db=await mongoose.connect(process.env.MONGO_URI || '')
        connection.isConnected=db.connections[0].readyState
        console.log("DB connected successfully")
    }catch(error){
        console.log(error,"Database connection falied")
        process.exit(1)
    }
}

export default dbConnect