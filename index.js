import express from "express"
import { MongoClient } from "mongodb"
import "dotenv/config"
import { UserRouter } from "./Routes/Users.js";
import { surveyRoute } from "./Routes/Survey.js";
import { imageRoute } from "./Routes/Image.js";


let app = express()

app.use(express.json())

const createConnection = async ()=> {
    try{ 
        let client = new MongoClient(process.env.MONGODB_URL)
        await client.connect()
        console.log("Mongodb is connected");
        return client
    }
    catch(error){
        console.log(error)


    }
  
} 


export const client = await createConnection()


app.use("/users",UserRouter)

app.use("/survey",surveyRoute)

app.use("/image",imageRoute)
// Image Thumbnail Generation Endpoint




app.listen(process.env.PORT,()=>console.log(`port is lisiening on ${process.env.PORT}`))