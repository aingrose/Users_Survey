
import bcrypt from "bcrypt"
import { client } from "./index.js"
import { ObjectId } from "mongodb";  

const genPassword = async (Password) =>{
    const salt =  await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(Password,salt)
    return hashPassword
}


const createUser = async (Username,Password) =>{
    return await client.db("BackEndTask").collection("Users").insertOne({Username:Username,Password:Password})
}
 
const getUser = async (Username) => {
    return await client.db("BackEndTask").collection("Users").findOne({Username:Username})
}

const createSurvey = async (survey) => {
    return  await client.db("BackEndTask").collection("Surveys").insertOne(survey)
}

const takesurvey = async(survey) => {
    return await client.db("BackEndTask").collection("SurveyResults").insertOne(survey)
}

const getsurveyId = async(surveyId) => {
    return client.db("BackEndTask").collection("Surveys").findOne({_id :new ObjectId(surveyId)})
}

const getsurvey = async(surveyId)  =>{
    return client.db("BackEndTask").collection("SurveyResults").find({surveyId :surveyId}).toArray()
}

export {genPassword ,createUser,getUser,createSurvey,takesurvey,getsurveyId,getsurvey}