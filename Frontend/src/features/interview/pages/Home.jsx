import React, { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Header from '../../../components/Header'

const LOADING_MESSAGES = [
    "Analyzing job requirements...",
    "Extracting key skills from your profile...",
    "Matching your experience to the role...",
    "Generating technical questions...",
    "Preparing behavioral scenarios...",
    "Finalizing your interview game plan...",
    "Almost there..."
]

const InteractiveLoader = () => {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => {
                if (prev >= LOADING_MESSAGES.length - 1) {
                    clearInterval(interval)
                    return prev
                }
                return prev + 1
            })
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <main className='w-full min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-bg-page)]'>
            <div className='w-12 h-12 border-4 border-[rgba(255,45,120,0.2)] border-t-[var(--color-accent)] rounded-full animate-spin'></div>
            <h2 className='text-2xl font-semibold text-[var(--color-text-primary)] m-0 text-center animate-pulse'>{LOADING_MESSAGES[msgIndex]}</h2>
            <p className='text-[var(--color-text-muted)] text-sm m-0'>This usually takes few seconds.</p>
        </main>
    )
}

const Home = () => {

    const { loading, generateReport, getReports, reports, deleteReport } = useInterview()
    const [jobDescription, setJobDescription] = useState(() => localStorage.getItem('sb_jobDescription') || "")
    const [selfDescription, setSelfDescription] = useState(() => localStorage.getItem('sb_selfDescription') || "")
    const [fileName, setFileName] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name)
        }
    }

    const handleJobDescriptionChange = (e) => {
        setJobDescription(e.target.value)
        localStorage.setItem('sb_jobDescription', e.target.value)
    }

    const handleSelfDescriptionChange = (e) => {
        setSelfDescription(e.target.value)
        localStorage.setItem('sb_selfDescription', e.target.value)
    }

    const handleGenerateReport = async () => {
        try {
            const resumeFile = resumeInputRef.current?.files[0]
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                // Clear persisted form data after successful generation
                localStorage.removeItem('sb_jobDescription')
                localStorage.removeItem('sb_selfDescription')
                navigate(`/interview/${data._id}`)
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to generate interview report. The AI service might be busy (Rate Limit). Please wait a moment and try again.")
        }
    }

    const isFormValid = jobDescription.trim().length > 0 && (selfDescription.trim().length > 0 || fileName !== "")

    if (loading) {
        return <InteractiveLoader />
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] font-sans flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 gap-8 relative'>
            <Header />

            {/* ── MOBILE LAYOUT (< 500px) ─────────────────────────────── */}
            <div className='w-full flex flex-col gap-5 max-[500px]:flex max-[500px]:flex-col min-[500px]:hidden'>

                {/* Mobile Page Header */}
                <header className='text-center px-1'>
                    <h1 className='text-2xl min-[400px]:text-3xl font-bold mb-1.5 text-[var(--color-text-primary)]'>
                        <span className='inline-block whitespace-nowrap'>Create Your Custom</span>{' '}
                        <span className='inline-block text-[var(--color-accent)] whitespace-nowrap'>Interview Plan</span>
                    </h1>
                    <p className='text-[var(--color-text-muted)] text-sm leading-relaxed'>
                        Let AI analyze the job &amp; your profile to build a winning strategy.
                    </p>
                </header>

                {/* Step 1 — Job Description */}
                <div className='w-full bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-2xl overflow-hidden'>
                    {/* Step Header */}
                    <div className='flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-color)]'>
                        <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[#cc2460] flex items-center justify-center shrink-0'>
                            <span className='text-white text-xs font-extrabold'>1</span>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-sm font-semibold text-[var(--color-text-primary)] m-0'>Target Job Description</h2>
                            <p className='text-[0.7rem] text-[var(--color-text-muted)] m-0'>Paste the full JD from any job board</p>
                        </div>
                        <span className='text-[0.65rem] font-bold py-0.5 px-2 rounded uppercase tracking-wider bg-[rgba(255,45,120,0.15)] text-[var(--color-accent)] border border-[rgba(255,45,120,0.3)] shrink-0'>Required</span>
                    </div>
                    {/* Textarea */}
                    <div className='p-4 flex flex-col gap-1.5'>
                        <textarea
                            onChange={handleJobDescriptionChange}
                            value={jobDescription}
                            className='w-full h-36 bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-xl py-3 px-3.5 text-[var(--color-text-primary)] text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors leading-relaxed placeholder-[var(--color-text-muted)]'
                            placeholder={`Paste the full job description here...`}
                            maxLength={5000}
                        />
                        <div className='text-right text-xs text-[var(--color-text-muted)]'>{jobDescription.length} / 5000</div>
                    </div>
                </div>

                {/* Step 2 — Your Profile */}
                <div className='w-full bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-2xl overflow-hidden'>
                    {/* Step Header */}
                    <div className='flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-color)]'>
                        <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#7c3aed] flex items-center justify-center shrink-0'>
                            <span className='text-white text-xs font-extrabold'>2</span>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-sm font-semibold text-[var(--color-text-primary)] m-0'>Your Profile</h2>
                            <p className='text-[0.7rem] text-[var(--color-text-muted)] m-0'>Resume or a quick self-description</p>
                        </div>
                    </div>

                    <div className='p-4 flex flex-col gap-4'>
                        {/* Compact Resume Upload */}
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center justify-between'>
                                <label className='text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider'>Upload Resume</label>
                                <span className='text-[0.65rem] font-bold py-0.5 px-2 rounded uppercase tracking-wider bg-[rgba(255,45,120,0.15)] text-[var(--color-accent)] border border-[rgba(255,45,120,0.3)]'>Best Results</span>
                            </div>
                            <label
                                htmlFor='resume-mobile'
                                className='flex items-center gap-3 p-3.5 bg-[var(--color-bg-input)] border-2 border-dashed border-[var(--color-border-color)] rounded-xl cursor-pointer hover:border-[var(--color-accent)] hover:bg-[rgba(255,45,120,0.05)] transition-colors'
                            >
                                <span className='text-[var(--color-accent)] shrink-0'>
                                    {fileName ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    )}
                                </span>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-[var(--color-text-primary)] m-0 truncate'>
                                        {fileName ? fileName : 'Tap to upload PDF or DOCX'}
                                    </p>
                                    <p className='text-xs text-[var(--color-text-muted)] m-0'>
                                        {fileName ? 'Tap to change file' : 'Max 3MB'}
                                    </p>
                                </div>
                                <input onChange={handleFileChange} ref={resumeInputRef} hidden type='file' id='resume-mobile' name='resume' accept='.pdf,.docx' />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='flex items-center gap-3 text-[var(--color-text-muted)] text-xs'>
                            <div className='flex-1 h-px bg-[var(--color-border-color)]' />
                            <span>OR</span>
                            <div className='flex-1 h-px bg-[var(--color-border-color)]' />
                        </div>

                        {/* Self-Description */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider' htmlFor='selfDesc-mobile'>Quick Self-Description</label>
                            <textarea
                                    onChange={handleSelfDescriptionChange}
                                    value={selfDescription}
                                id='selfDesc-mobile'
                                name='selfDescription'
                                className='h-20 w-full bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-xl py-3 px-3.5 text-[var(--color-text-primary)] text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors leading-relaxed placeholder-[var(--color-text-muted)]'
                                placeholder="Describe your experience & key skills..."
                            />
                        </div>

                        {/* Info note */}
                        <div className='flex items-start gap-2 p-3 bg-[var(--color-info-bg)] border border-[var(--color-info-border)] rounded-xl'>
                            <span className='shrink-0 text-[#4a90e2] mt-px'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p className='m-0 text-xs text-[#8ab4f8] leading-relaxed'>
                                Either a <strong className='text-[var(--color-text-primary)]'>Resume</strong> or <strong className='text-[var(--color-text-primary)]'>Self Description</strong> is required.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Generate Button */}
                <button
                    disabled={!isFormValid}
                    onClick={handleGenerateReport}
                    className='w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[#cc2460] text-white text-sm font-bold border-none rounded-2xl cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale transition-all shadow-[0_8px_24px_rgba(255,45,120,0.35)]'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                    Generate My Interview Strategy
                </button>

                {/* Mobile Recent Reports */}
                <section className='flex flex-col gap-3 w-full'>
                    <h2 className='text-base font-bold m-0 text-[var(--color-text-primary)]'>My Recent Interview Plans</h2>
                    {reports.length === 0 ? (
                        <p className='text-sm text-[var(--color-text-muted)] m-0'>You haven't generated any plans yet.</p>
                    ) : (
                        <ul className='flex flex-col gap-2.5 p-0 m-0 list-none'>
                            {reports.map(report => (
                                <li
                                    key={report._id}
                                    className={`group relative bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl p-4 flex items-center gap-3 cursor-pointer border-l-2 ${report.matchScore >= 80 ? 'border-l-[var(--color-severity-low)]' : report.matchScore >= 60 ? 'border-l-[var(--color-severity-medium)]' : 'border-l-[var(--color-severity-high)]'}`}
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-sm font-semibold m-0 text-[var(--color-text-primary)] pr-6'>{report.title || 'Untitled Position'}</h3>
                                        <div className='flex items-center gap-2 mt-0.5'>
                                            <p className='text-xs text-[var(--color-text-muted)] m-0'>{new Date(report.createdAt).toLocaleDateString()}</p>
                                            <span className='text-[var(--color-border-color)]'>·</span>
                                            <p className={`text-xs font-semibold m-0 ${report.matchScore >= 80 ? 'text-[var(--color-severity-low)]' : report.matchScore >= 60 ? 'text-[var(--color-severity-medium)]' : 'text-[var(--color-severity-high)]'}`}>{report.matchScore}% match</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteReport(report._id); }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-all border-none cursor-pointer"
                                        title="Delete plan"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {/* ── DESKTOP LAYOUT (≥ 500px) ────────────────────────────── */}
            <div className='w-full max-[500px]:hidden flex flex-col items-center gap-8'>

                {/* Page Header */}
                <header className='text-center'>
                    <h1 className='text-2xl min-[400px]:text-3xl sm:text-4xl font-bold mb-2 text-[var(--color-text-primary)]'>
                        <span className='inline-block whitespace-nowrap'>Create Your Custom</span>{' '}
                        <span className='inline-block text-[var(--color-accent)] whitespace-nowrap'>Interview Plan</span>
                    </h1>
                    <p className='text-[var(--color-text-muted)] text-[0.95rem] max-w-lg mx-auto leading-relaxed'>
                        Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                    </p>
                </header>

                {/* Main Card */}
                <div className='w-full max-w-[900px] bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-2xl overflow-hidden'>
                    <div className='flex flex-col md:flex-row min-h-[520px]'>

                        {/* Left Panel - Job Description */}
                        <div className='flex-1 flex flex-col gap-4 p-6'>
                            <div className='flex items-center gap-2 mb-1'>
                                <span className='flex items-center text-[var(--color-accent)]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2 className='text-base font-semibold text-[var(--color-text-primary)] flex-1 m-0'>Target Job Description</h2>
                                <span className='text-[0.7rem] font-semibold py-0.5 px-2 rounded uppercase tracking-wider bg-[rgba(255,45,120,0.15)] text-[var(--color-accent)] border border-[rgba(255,45,120,0.3)]'>Required</span>
                            </div>
                            <div className='flex-1 flex flex-col gap-1.5 min-h-[300px] md:min-h-none'>
                                <textarea
                                    onChange={handleJobDescriptionChange}
                                    value={jobDescription}
                                    className='flex-1 w-full bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-lg py-3 px-4 text-[var(--color-text-primary)] text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors leading-relaxed placeholder-[var(--color-text-muted)]'
                                    placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                    maxLength={5000}
                                />
                                <div className='text-right text-xs text-[var(--color-text-muted)]'>{jobDescription.length} / 5000 chars</div>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='w-px bg-[var(--color-border-color)] shrink-0 hidden md:block' />

                        {/* Right Panel - Profile */}
                        <div className='flex-1 flex flex-col gap-3 p-6'>
                            <div className='flex items-center gap-2 mb-1'>
                                <span className='flex items-center text-[var(--color-accent)]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2 className='text-base font-semibold text-[var(--color-text-primary)] flex-1 m-0'>Your Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='flex flex-col gap-2 flex-1'>
                                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-1'>
                                    Upload Resume
                                    <span className='text-[0.7rem] font-semibold py-0.5 px-2 rounded uppercase tracking-wider bg-[rgba(255,45,120,0.15)] text-[var(--color-accent)] border border-[rgba(255,45,120,0.3)]'>Best Results</span>
                                </label>
                                <label className='flex-1 flex flex-col items-center justify-center gap-1.5 p-6 bg-[var(--color-bg-input)] border-2 border-dashed border-[var(--color-border-color)] rounded-lg cursor-pointer hover:border-[var(--color-accent)] hover:bg-[rgba(255,45,120,0.05)] transition-colors' htmlFor='resume'>
                                    {fileName ? (
                                        <>
                                            <span className='text-[var(--color-accent)] mb-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" /></svg>
                                            </span>
                                            <p className='text-sm font-semibold text-[var(--color-accent)] m-0'>{fileName}</p>
                                            <p className='text-xs text-[var(--color-text-muted)] m-0'>Click to change file</p>
                                        </>
                                    ) : (
                                        <>
                                            <span className='text-[var(--color-accent)] mb-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                            </span>
                                            <p className='text-sm font-medium text-[var(--color-text-primary)] m-0'>Click to upload or drag &amp; drop</p>
                                            <p className='text-xs text-[var(--color-text-muted)] m-0'>PDF or DOCX (Max 3MB)</p>
                                        </>
                                    )}
                                    <input onChange={handleFileChange} ref={resumeInputRef} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className='flex items-center gap-3 text-[var(--color-text-muted)] text-xs before:content-[""] before:flex-1 before:h-px before:bg-[var(--color-border-color)] after:content-[""] after:flex-1 after:h-px after:bg-[var(--color-border-color)] whitespace-nowrap'>
                                <span>OR</span>
                            </div>

                            {/* Quick Self-Description */}
                            <div className='flex flex-col gap-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-1' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    onChange={handleSelfDescriptionChange}
                                    value={selfDescription}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='flex-none h-24 w-full bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-lg py-3 px-4 text-[var(--color-text-primary)] text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors leading-relaxed placeholder-[var(--color-text-muted)]'
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                />
                            </div>

                            {/* Info Box */}
                            <div className='flex items-start gap-2.5 p-3 bg-[var(--color-info-bg)] border border-[var(--color-info-border)] rounded-lg'>
                                <span className='shrink-0 text-[#4a90e2] mt-px'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                                </span>
                                <p className='m-0 text-xs text-[#8ab4f8] leading-relaxed'>Either a <strong className='text-[var(--color-text-primary)]'>Resume</strong> or a <strong className='text-[var(--color-text-primary)]'>Self Description</strong> is required to generate a personalized plan.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='flex items-center justify-between p-4 px-6 border-t border-[var(--color-border-color)]'>
                        <span className='text-xs text-[var(--color-text-muted)]'>Personalized Interview Plan</span>
                        <button
                            disabled={!isFormValid}
                            onClick={handleGenerateReport}
                            className='flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-[var(--color-accent)] to-[#cc2460] text-white text-sm font-semibold border-none rounded-lg cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale transition-all'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>

                {/* Recent Reports List */}
                <section className='flex flex-col gap-3 w-full max-w-[900px]'>
                    <h2 className='text-xl font-bold m-0 text-[var(--color-text-primary)]'>My Recent Interview Plans</h2>
                    {reports.length === 0 ? (
                        <p className='text-sm text-[var(--color-text-muted)] m-0'>You haven't generated any plans yet.</p>
                    ) : (
                        <ul className='flex gap-3 flex-wrap p-0 m-0 list-none'>
                            {reports.map(report => (
                                <li key={report._id} className='group relative bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-lg p-4 flex-1 flex flex-col gap-2 cursor-pointer shrink-0 min-w-[250px]' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteReport(report._id); }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 rounded-md transition-all border-none cursor-pointer"
                                        title="Delete plan"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                    <h3 className='text-base font-semibold m-0 text-[var(--color-text-primary)] pr-8'>{report.title || 'Untitled Position'}</h3>
                                    <p className='text-sm text-[var(--color-text-muted)] m-0'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <p className={`text-xs font-semibold m-0 ${report.matchScore >= 80 ? 'text-[var(--color-severity-low)]' : report.matchScore >= 60 ? 'text-[var(--color-severity-medium)]' : 'text-[var(--color-severity-high)]'}`}>Match Score: {report.matchScore}%</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Home