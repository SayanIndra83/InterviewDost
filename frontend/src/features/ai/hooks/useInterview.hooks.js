import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context.jsx"
import { generateReport, getReport, getReports, getResume} from "../services/interview.api.js"
import { useNavigate, useParams } from "react-router"
import toast from 'react-hot-toast'

export const useInterview =()=> {

    const navigate = useNavigate();
    const {interviewId} = useParams()
    const context = useContext(InterviewContext)
    const {report, setLoading, loading, setReport, reports, setReports} = context

    const generateAiReport = async ({resumeFile, selfDescription, jobDescription}) => {
        let res = null;
        try {
            setLoading(true)
            // console.log("Resume sent to generateReport")
            res = await generateReport({resumeFile, selfDescription, jobDescription})

            // console.log("got report", res)
            setReport(res.interviewReport)
            const newinterviewId = res.interviewReport._id;
            toast.success(res.message ?? "Report generated")
            navigate(`/interview/${newinterviewId}`)
        }
        catch(err){
            const errorMassage = err.response?.data?.message ?? "Report creation failed";
            // console.log(errorMassage)
            toast.error(errorMassage)
        }
        finally{
            setLoading(false)
        }

        return res.interviewReport
    };

    const getAiReport = async(interviewId) =>{
        
        try {
            setLoading(true)
            const res = await getReport(interviewId)
            // console.log(res.report)
            setReport(res.report);
        } catch (err) {
            const errorMassage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMassage)
        }
        finally{
            setLoading(false)
        }
    }

    const getAiReports = async() => {

        setLoading(true)
        try {
            const res = await getReports();
            setReports(res.reports)
        } catch (err) {
            const errorMassage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMassage)
        }
        finally{
            setLoading(false)
        }

    }

    const ResumePdf = async (interviewId) => {
        
        try {
            setLoading(true)
            const response = await getResume(interviewId);
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume_${interviewId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Tailored resume created")
        } catch (err) {
            const errorMassage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMassage)
        }
        finally{
            setLoading(false)       
        }
    } 

    useEffect(() => {
        if(interviewId){
            getAiReport(interviewId)
        }
    },[interviewId])

    return {loading, report, reports, generateAiReport, getAiReport, getAiReports, ResumePdf}
}
