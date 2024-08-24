
import express from "express";
import { auth } from "../Middleware/Auth.js"
import { createSurvey, getsurvey, takesurvey, getsurveyId } from "../Helper.js";



const router = express.Router();

// Create Survey Route
router.post("/create", auth, async (req, res) => {
    try {
        const { title, questions } = req.body;

        if (!title || !questions || !questions.length) {
            return res.status(400).json({ message: "Title and Questions are required" });
        }

        const newSurvey = {
            title,
            questions,
            createBy: req.user.id, 
            createAt: new Date(),
        };

        const result = await createSurvey(newSurvey);
        res.status(201).json({ message: "Survey created successfully", surveyId: result.insertedId });

    } catch (error) {
        console.error("Error creating survey:", error);
        res.status(500).send({ message: "Failed to create survey" });
    }
});



// Take Survey Route

router.post("/take/:id", auth, async (req, res) => {
    try {
        const surveyId = req.params.id;
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers) || !answers.every(a => typeof a === 'boolean')) {
            return res.status(400).json({ message: "Answers must be an array of boolean values (true/false)" });
        }

        const survey = await getsurveyId(surveyId);

        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }  

        if (answers.length !== survey.questions.length) {
            return res.status(400).json({ message: "Number of answers does not match number of questions" });
        }

        const surveyResult = {
            surveyId:surveyId,
            userId: req.user.id,
            answers,
            submittedAt: new Date(),
        };

        const result = await takesurvey(surveyResult);
        res.status(201).json({ message: "Survey answers submitted successfully" });
    } catch (error) {
        console.error("Error taking survey:", error);  // Log the exact error
        res.status(500).send({ message: `Failed to submit survey answers: ${error.message}` });  // Include error message in response
    }
});




// Get Survey Results Route
router.get("/result/:id", auth, async (req, res) => {
    try {
        const surveyId = req.params.id;

        const survey = await getsurveyId(surveyId);
        console.log("survey",survey);
        
        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }
        
        const result = await getsurvey(surveyId);
    
        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting survey results:", error);
        res.status(500).send({ message: "Failed to fetch survey results" });
    }
});

export const surveyRoute = router;