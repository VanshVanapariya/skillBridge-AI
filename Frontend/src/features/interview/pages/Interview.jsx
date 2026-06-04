import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import Header from '../../../components/Header'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='bg-[var(--color-bg-panel)] border border-[var(--color-border-color)] rounded-lg overflow-hidden transition-colors hover:border-[#38435f]'>
            <div className='flex items-start gap-3 p-4 cursor-pointer select-none' onClick={() => setOpen(o => !o)}>
                <span className='shrink-0 text-[0.7rem] font-bold text-[var(--color-accent)] bg-[rgba(255,45,120,0.1)] border border-[rgba(255,45,120,0.2)] rounded px-1.5 py-0.5 mt-0.5'>Q{index + 1}</span>
                <p className='flex-1 m-0 text-sm font-medium text-[var(--color-text-primary)] leading-relaxed'>{item.question}</p>
                <span className={`shrink-0 text-[var(--color-text-muted)] transition-transform mt-0.5 ${open ? 'rotate-180 text-[var(--color-accent)]' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='px-4 pb-4 flex flex-col gap-3 border-t border-[var(--color-border-color)] pt-3'>
                    <div className='flex flex-col gap-1.5'>
                        <span className='text-[0.68rem] font-bold uppercase tracking-[0.06em] py-0.5 px-2 rounded w-fit text-[#a78bfa] bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.2)]'>Intention</span>
                        <p className='m-0 text-[0.835rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed'>{item.intention}</p>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <span className='text-[0.68rem] font-bold uppercase tracking-[0.06em] py-0.5 px-2 rounded w-fit text-[#3fb950] bg-[rgba(63,185,80,0.1)] border border-[rgba(63,185,80,0.2)]'>Model Answer</span>
                        {(() => {
                            if (item.approach) {
                                return (
                                    <>
                                        <div className='mt-2'>
                                            <span className='font-bold text-[#3fb950] text-[0.8rem]'>Approach:</span>
                                            <p className='m-0 mt-1 text-[0.835rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed whitespace-pre-line'>{item.approach}</p>
                                        </div>
                                        <div className='mt-3'>
                                            <span className='font-bold text-[#3fb950] text-[0.8rem]'>Sample Answer:</span>
                                            <p className='m-0 mt-1 text-[0.835rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed whitespace-pre-line'>{item.answer}</p>
                                        </div>
                                    </>
                                )
                            } else {
                                let text = item.answer || "";
                                const appIdx = text.indexOf("Approach:");
                                const samIdx = text.indexOf("Sample Answer:");

                                if (appIdx !== -1 && samIdx !== -1) {
                                    const approachText = text.substring(appIdx + 9, samIdx).trim();
                                    const sampleText = text.substring(samIdx + 14).trim();
                                    return (
                                        <>
                                            <div className='mt-2'>
                                                <span className='font-bold text-[#3fb950] text-[0.8rem]'>Approach:</span>
                                                <p className='m-0 mt-1 text-[0.835rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed whitespace-pre-line'>{approachText}</p>
                                            </div>
                                            <div className='mt-3'>
                                                <span className='font-bold text-[#3fb950] text-[0.8rem]'>Sample Answer:</span>
                                                <p className='m-0 mt-1 text-[0.835rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed whitespace-pre-line'>{sampleText}</p>
                                            </div>
                                        </>
                                    )
                                } else {
                                    return <p className='m-0 text-[0.835rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed whitespace-pre-line'>{text}</p>
                                }
                            }
                        })()}
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapPhase = ({ phase }) => {
    const isLegacy = typeof phase.day !== 'undefined';
    const numberText = isLegacy ? `Day ${phase.day}` : `Phase ${phase.phaseNumber}`;
    const nameText = isLegacy ? 'Daily Prep' : phase.phaseName;
    const durationText = isLegacy ? '1 Day' : phase.durationEstimate;
    const focusText = phase.focus;

    return (
        <div className='flex flex-col gap-2 py-4 pl-14 relative before:content-[""] before:absolute before:left-[21px] before:top-5 before:w-3.5 before:h-3.5 before:rounded-full before:bg-[var(--color-bg-card)] before:border-2 before:border-[var(--color-accent)]'>
            <div className='flex flex-wrap items-center gap-2.5'>
                <span className='text-[0.7rem] font-bold text-[var(--color-accent)] bg-[rgba(255,45,120,0.1)] border border-[rgba(255,45,120,0.25)] py-0.5 px-2.5 rounded-full'>{numberText}</span>
                <span className='text-[0.7rem] font-semibold text-[var(--color-text-muted)] bg-[var(--color-bg-panel)] border border-[var(--color-border-color)] py-0.5 px-2.5 rounded-full'>{durationText}</span>
                <h3 className='m-0 text-[0.95rem] font-semibold text-[var(--color-text-primary)]'>{nameText}</h3>
            </div>
            <div className='text-xs text-[var(--color-text-muted)] font-medium pl-1'>
                Focus: <span className='text-[var(--color-text-primary)] opacity-90'>{focusText}</span>
            </div>
            <ul className='list-none m-0 p-0 flex flex-col gap-1.5 mt-1'>
                {phase.tasks.map((task, i) => (
                    <li key={i} className='flex items-start gap-2 text-[0.845rem] text-[var(--color-text-primary)] opacity-80 leading-relaxed'>
                        <span className='shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] mt-2' />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [isRegeneratingTechnical, setIsRegeneratingTechnical] = useState(false)
    const [isRegeneratingBehavioral, setIsRegeneratingBehavioral] = useState(false)
    const { report, getReportById, loading, downloadLoading, getResumePdf, regenerateQuestions } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handleRegenerate = async (type) => {
        if (type === 'technical') setIsRegeneratingTechnical(true)
        if (type === 'behavioral') setIsRegeneratingBehavioral(true)

        try {
            await regenerateQuestions(interviewId, type)
        } catch (error) {
            console.error("Failed to regenerate", error)
            alert(error.response?.data?.message || "Failed to generate new questions. Please try again.")
        } finally {
            if (type === 'technical') setIsRegeneratingTechnical(false)
            if (type === 'behavioral') setIsRegeneratingBehavioral(false)
        }
    }



    if (loading || !report) {
        return (
            <main className='w-full min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-bg-page)]'>
                <div className='w-12 h-12 border-4 border-[rgba(255,45,120,0.2)] border-t-[var(--color-accent)] rounded-full animate-spin'></div>
                <h1 className='text-2xl font-semibold text-[var(--color-text-primary)] m-0 animate-pulse'>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'border-[var(--color-severity-low)]' :
            report.matchScore >= 60 ? 'border-[var(--color-severity-medium)]' : 'border-[var(--color-severity-high)]'

    const scoreText =
        report.matchScore >= 80 ? 'Strong match for this role' :
            report.matchScore >= 60 ? 'Moderate match for this role' : 'Weak match for this role'

    const scoreTextColor =
        report.matchScore >= 80 ? 'text-[var(--color-severity-low)]' :
            report.matchScore >= 60 ? 'text-[var(--color-severity-medium)]' : 'text-[var(--color-severity-high)]'


    return (
        <div className='w-full min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] font-sans flex items-stretch p-6 box-border relative'>
            <Header />
            <div className='flex w-full max-w-[1280px] mx-auto mt-8 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-2xl justify-between'>

                {/* ── Left Nav ── */}
                <nav className='w-[220px] shrink-0 py-7 px-4 flex flex-col justify-between gap-1'>
                    <div>
                        <p className='text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] px-3 mb-2'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`flex items-center gap-2.5 w-full py-2.5 px-3 bg-transparent border-none rounded-lg text-[var(--color-text-muted)] font-sans text-sm cursor-pointer text-left transition-colors hover:bg-[var(--color-bg-panel)] hover:text-[var(--color-text-primary)] ${activeNav === item.id ? 'bg-[rgba(255,45,120,0.1)] text-[var(--color-accent)] hover:bg-[rgba(255,45,120,0.1)] hover:text-[var(--color-accent)] [&>span]:text-[var(--color-accent)]' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='flex items-center shrink-0'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        disabled={downloadLoading}
                        className='flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-br from-[var(--color-accent)] to-[#cc2460] text-white text-sm font-semibold border-none rounded-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed' >
                        {downloadLoading ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Downloading Resume...
                            </>
                        ) : (
                            <>
                                <svg height={"0.8rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                                Download Resume
                            </>
                        )}
                    </button>
                </nav>

                <div className='w-px bg-[var(--color-border-color)] shrink-0' />

                {/* ── Center Content ── */}
                <main className='flex-1 py-7 px-8 overflow-y-auto max-h-[calc(100vh-3rem)] pb-20 items-start'>
                    {activeNav === 'technical' && (
                        <section className='min-h-full'>
                            <div className='flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-color)]'>
                                <h2 className='text-lg font-bold text-[var(--color-text-primary)] m-0'>Technical Questions</h2>
                                <span className='text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-panel)] py-0.5 px-2.5 rounded-full border border-[var(--color-border-color)]'>{report.technicalQuestions.length} questions</span>
                                <button
                                    onClick={() => handleRegenerate('technical')}
                                    disabled={isRegeneratingTechnical}
                                    className='ml-auto flex items-center gap-2 text-[0.75rem] font-medium text-[var(--color-accent)] bg-[rgba(255,45,120,0.1)] hover:bg-[rgba(255,45,120,0.15)] border border-[rgba(255,45,120,0.2)] py-1.5 px-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isRegeneratingTechnical ? (
                                        <>
                                            <div className='w-3 h-3 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin'></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                                            Generate New Questions
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className='flex flex-col gap-3'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className='min-h-full'>
                            <div className='flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-color)]'>
                                <h2 className='text-lg font-bold text-[var(--color-text-primary)] m-0'>Behavioral Questions</h2>
                                <span className='text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-panel)] py-0.5 px-2.5 rounded-full border border-[var(--color-border-color)]'>{report.behavioralQuestions.length} questions</span>
                                <button
                                    onClick={() => handleRegenerate('behavioral')}
                                    disabled={isRegeneratingBehavioral}
                                    className='ml-auto flex items-center gap-2 text-[0.75rem] font-medium text-[var(--color-accent)] bg-[rgba(255,45,120,0.1)] hover:bg-[rgba(255,45,120,0.15)] border border-[rgba(255,45,120,0.2)] py-1.5 px-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isRegeneratingBehavioral ? (
                                        <>
                                            <div className='w-3 h-3 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin'></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                                            Generate New Questions
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className='flex flex-col gap-3'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className='min-h-full'>
                            <div className='flex items-baseline gap-3 mb-6 pb-4 border-b border-[var(--color-border-color)]'>
                                <h2 className='text-lg font-bold text-[var(--color-text-primary)] m-0'>Preparation Road Map</h2>
                                <span className='text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-panel)] py-0.5 px-2.5 rounded-full border border-[var(--color-border-color)]'>
                                    {report.preparationPlan[0] && typeof report.preparationPlan[0].day !== 'undefined'
                                        ? `${report.preparationPlan.length}-day plan`
                                        : `${report.preparationPlan.length} phases`}
                                </span>
                            </div>
                            <div className='flex flex-col relative before:content-[""] before:absolute before:left-[28px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-accent)] before:to-[rgba(255,45,120,0.1)] before:rounded-sm'>
                                {report.preparationPlan.map((phase, idx) => (
                                    <RoadMapPhase key={phase.phaseNumber || phase.day || idx} phase={phase} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='w-px bg-[var(--color-border-color)] shrink-0' />

                {/* ── Right Sidebar ── */}
                <aside className='w-[240px] shrink-0 py-7 px-5 flex flex-col gap-5'>

                    {/* Match Score */}
                    <div className='flex flex-col items-center gap-2.5'>
                        <p className='text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] m-0 self-start'>Match Score</p>
                        <div className={`w-[90px] h-[90px] rounded-full flex items-center justify-center border-4 ${scoreColor}`}>
                            <span className='text-2xl font-extrabold text-[var(--color-text-primary)] leading-none'>
                                {report.matchScore}
                                <span className='text-xs text-[var(--color-text-muted)] ml-0.5 font-semibold'>%</span>
                            </span>
                        </div>
                        <p className={`m-0 text-[0.75rem] ${scoreTextColor} text-center`}>{scoreText}</p>
                    </div>

                    <div className='h-px bg-[var(--color-border-color)]' />

                    {/* Skill Gaps */}
                    <div className='flex flex-col gap-3'>
                        <p className='text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] m-0'>Skill Gaps</p>
                        <div className='flex flex-wrap gap-2'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`text-[0.775rem] font-medium py-1 px-2.5 rounded-md border cursor-default ${gap.severity === 'high' ? 'text-[var(--color-severity-high)] bg-[rgba(255,77,77,0.1)] border-[rgba(255,77,77,0.25)]' : gap.severity === 'medium' ? 'text-[var(--color-severity-medium)] bg-[rgba(245,166,35,0.1)] border-[rgba(245,166,35,0.25)]' : 'text-[var(--color-severity-low)] bg-[rgba(63,185,80,0.1)] border-[rgba(63,185,80,0.25)]'}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview