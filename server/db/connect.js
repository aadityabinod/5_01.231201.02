import mongoose from "mongoose";

export const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
        });
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Error connecting to database",err);
        process.exit(1);
    }
}