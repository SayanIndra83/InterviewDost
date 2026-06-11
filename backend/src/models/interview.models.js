import mongoose from "mongoose";


/**
 * - JD
 * - resume text
 * - self description
 * 
 * -ATSscrore: Number
 * - Technical questions : [{
 * question: "",
 * answer: "",
 * intention: "",
 * }]
 * - skill gaps : [{
 * skill: "",
 * severity:{
 * type: string,
 * enum: ["low", "med", "high"]
 * }
 * }]
 * - behavioral questions :[{
 * * question: "",
 * answer: "",
 * intention: "",
 * }]
 * - preparation plan : [{
 * day: number,
 * focusArea: "",
 * tasks:[""]
 * }]
 */

const technicalQuesSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"], 
    },
    answer: {
        type: String,
        required: [true, "Answer is required"], 
    },
    intention: {
        type: String,
        required: [true, "Intention is required"], 
    },
}, {_id: false})
const behavioralQuesSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behavioral question is required"], 
    },
    answer: {
        type: String,
        required: [true, "Answer is required"], 
    },
    intention: {
        type: String,
        required: [true, "Intention is required"], 
    },
}, {_id: false})


const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true, "Skill is required"]
    },
    severity:{
        type: String,
        enum:["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, {_id: false})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required"]
    },
focusArea:{
    type: String,
    required: [true, "Focus area is required"]
},
tasks:{
    type: [String],
    required: [true, "Tasks are required"] 
}
}, {_id: false})
const interviewReportSchema = new mongoose.Schema({
jobDescription:{
    type: String,
    required: true,
},
resume:{
    type: String,
},
selfDescription:{
    type: String,
},
ATSscore:{
    type: Number,
    min: 0,
    max: 100,
},
technicalQuestions:[
    technicalQuesSchema
],
skillGaps:[
    skillGapSchema
],
behavioralQuestions:[
    behavioralQuesSchema
],
preparationPlan:[
    preparationPlanSchema
],
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
title:{
    type: String,
     required: [true, "Job title is required"]
}
}, {timestamps: true})

export default mongoose.model("Report", interviewReportSchema)