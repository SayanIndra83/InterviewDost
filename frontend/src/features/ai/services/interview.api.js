import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})

export async function generateReport({resumeFile, selfDescription, jobDescription}){
    try {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("selfDescription", selfDescription);
        formData.append("jobDescription", jobDescription);
        console.log("sending datas to server")
        const response = await api.post("/api/interview/", formData);
        return response.data
    } catch (error) {
        throw error
    }
}

export async function getReport(interviewId){
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`); 
        return response.data
    } catch (error) {
        throw error
    }
}

export async function getReports(){
    try {
        const response = await api.get("/api/interview/reports"); 
        return response.data
    } catch (error) {
        throw error
    }   
}

export async function getResume(interviewId) {
    try {
        const res = await api.post(`/api/interview/resume/pdf/${interviewId}`, {}, {
            responseType: "blob",}
        )

        return res.data
    } catch (error) {
        throw error
    }
}