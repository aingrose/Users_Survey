import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { genPassword ,createUser,getUser} from "../Helper.js"
const router = express.Router()



router.post("/register",async(req,res)=>{ 
    try{
       const {Username,Password} = req.body
       
       const IsUserExist = await getUser(Username)

       if(IsUserExist){
        return res.status(400).send({message:"Username already exist"})
          
       }

       else if(!/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%&_#]).{8,}$/g.test(Password)){
       return res.status(400).json({message:"Password doesn't match"}) 
       } 

       
        const hashPassword = await genPassword(Password);
        const db =  createUser(Username,hashPassword)
        res.status(201).send({Message: "Successfully created"})

       
    }
    catch(error){
       console.log("Error", error);
       return res.status(500).send({message:"Internal Server Error"})
       
    }
})


router.post("/login",async (req,res) =>{
    const {Username,Password} = req.body
     const userFromDB = await getUser(Username)

     if(!userFromDB){
       return res.send({message:"Invalid Credentials"})
     }
      
     let PasswordfromDb = userFromDB.Password
     
     const ismatch =await bcrypt.compare(Password,PasswordfromDb)
     if(!ismatch){
         return res.status(201).send({Message:"invalid credential"})
     }
     
     let token = jwt.sign({id:userFromDB._id},process.env.SECRET_KEY)
     console.log(token);

     return res.status(200).json({message:"Successfull logged in",token:token})
         
})
 
export const UserRouter = router 