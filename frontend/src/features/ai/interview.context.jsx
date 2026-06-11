import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({children}) => {
    const [report, setReport] = useState("")
    const [loading, setLoading] = useState(false)
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={{report, setLoading, loading, setReport, reports, setReports}}>
            {children}
        </InterviewContext.Provider>
    )
}