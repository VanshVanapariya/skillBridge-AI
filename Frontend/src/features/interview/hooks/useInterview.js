import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, deleteInterviewReport, regenerateQuestions as regenerateQuestionsApi } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, downloadLoading, setDownloadLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Failed to generate report:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        let fileHandle = null
        let usePicker = 'showSaveFilePicker' in window

        if (usePicker) {
            try {
                fileHandle = await window.showSaveFilePicker({
                    suggestedName: `resume_${interviewReportId}.pdf`,
                    types: [{
                        description: 'PDF Document',
                        accept: {
                            'application/pdf': ['.pdf'],
                        },
                    }],
                })
            } catch (pickerError) {
                if (pickerError.name === 'AbortError') {
                    // User cancelled the save operation
                    return
                }
                console.error("Save file picker error before download:", pickerError)
                usePicker = false
            }
        }

        setDownloadLoading(true)
        try {
            const response = await generateResumePdf({ interviewId: interviewReportId })
            const blob = new Blob([ response ], { type: "application/pdf" })

            if (usePicker && fileHandle) {
                const writable = await fileHandle.createWritable()
                await writable.write(blob)
                await writable.close()
            } else {
                fallbackDownload(blob, interviewReportId)
            }
        }
        catch (error) {
            console.error("Failed to download resume:", error)
            let msg = "Failed to download resume. Please try again."
            if (error.response && error.response.data instanceof Blob) {
                try {
                    const text = await error.response.data.text()
                    const parsed = JSON.parse(text)
                    msg = parsed.message || msg
                } catch (e) {
                    console.error("Failed to parse error blob", e)
                }
            } else if (error.response?.data?.message) {
                msg = error.response.data.message
            } else if (error.message) {
                msg = error.message
            }
            alert(msg)
        } finally {
            setDownloadLoading(false)
        }
    }

    const fallbackDownload = (blob, interviewReportId) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `resume_${interviewReportId}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])
    
    const deleteReport = async (interviewId) => {
        setLoading(true)
        try {
            await deleteInterviewReport(interviewId)
            setReports(prev => prev.filter(r => r._id !== interviewId))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const regenerateQuestions = async (interviewId, type) => {
        try {
            const response = await regenerateQuestionsApi(interviewId, type)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return { loading, downloadLoading, report, reports, generateReport, getReportById, getReports, getResumePdf, deleteReport, regenerateQuestions }

}