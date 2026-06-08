import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
        ),
        title: 'Skill Gap Analysis',
        desc: 'Know exactly which skills to sharpen before the interview. Our AI pinpoints your weaknesses so you can focus your prep where it matters most.',
        gradient: 'from-[#ff2d78] to-pink-400',
        glow: 'rgba(255,45,120,0.15)',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        title: 'AI-Generated Questions',
        desc: 'Get a tailored mix of technical and behavioural questions generated directly from the actual job description you provide.',
        gradient: 'from-purple-500 to-violet-400',
        glow: 'rgba(139,92,246,0.15)',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        ),
        title: 'Day-wise Prep Roadmap',
        desc: 'A structured, day-by-day study plan from today to interview day. No more guessing what to study next.',
        gradient: 'from-emerald-500 to-teal-400',
        glow: 'rgba(16,185,129,0.15)',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
        ),
        title: 'Role-Specific, Not Generic',
        desc: 'Every question and roadmap is generated from the real job description. No more generic prep that misses the mark.',
        gradient: 'from-blue-500 to-cyan-400',
        glow: 'rgba(59,130,246,0.15)',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" />
            </svg>
        ),
        title: 'Resume Match Score',
        desc: 'Instantly see how well your profile matches the role with a percentage score and actionable improvements.',
        gradient: 'from-orange-500 to-amber-400',
        glow: 'rgba(249,115,22,0.15)',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
        title: 'Resume Generation',
        desc: 'Generate a polished, ATS-optimized resume PDF tailored to the specific role in seconds.',
        gradient: 'from-rose-500 to-pink-400',
        glow: 'rgba(244,63,94,0.15)',
    },
]

const STEPS = [
    {
        num: '01',
        title: 'Paste the Job Description',
        desc: 'Copy the full JD from any job board — LinkedIn, Indeed, company sites — and paste it in.',
        color: 'from-[#ff2d78] to-pink-400',
    },
    {
        num: '02',
        title: 'Add Your Profile',
        desc: 'Upload your resume (PDF/DOCX) or write a quick self-description. Takes less than a minute.',
        color: 'from-purple-500 to-violet-400',
    },
    {
        num: '03',
        title: 'Get Your Interview Strategy',
        desc: 'AI generates your match score, skill gaps, tailored questions, and a day-by-day prep plan instantly.',
        color: 'from-emerald-500 to-teal-400',
    },
]

const STATS = [
    { value: '10K+', label: 'Interviews Prepared' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '3s', label: 'Avg. Generation Time' },
    { value: '50+', label: 'Job Roles Supported' },
]

const Landing = () => {
    const navigate = useNavigate()
    const heroRef = useRef(null)
    const [scrolled, setScrolled] = useState(false)
    const [charCount, setCharCount] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const totalChars = 41
        let timerId

        const typeNextChar = (currentCount) => {
            if (currentCount > totalChars) return

            setCharCount(currentCount)

            // Pause for 800ms after finishing the first line "Walk in prepared." (17 characters)
            const delay = currentCount === 17 ? 800 : 75

            timerId = setTimeout(() => {
                typeNextChar(currentCount + 1)
            }, delay)
        }

        timerId = setTimeout(() => {
            typeNextChar(1)
        }, 150) // Short initial delay before starting typing

        return () => clearTimeout(timerId)
    }, [])

    const Cursor = () => (
        <span className="inline-block w-[3px] h-[0.9em] bg-[var(--color-accent)] ml-1 animate-pulse align-middle"></span>
    )

    return (
        <div className="w-full min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] overflow-x-hidden">

            {/* ── NAVBAR ───────────────────────────────────────────────── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-[var(--color-bg-page)]/90 backdrop-blur-xl border-b border-[var(--color-border-color)]'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[rgba(255,45,120,0.4)]">
                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                        </div>
                        <span className="font-bold text-base tracking-tight text-[var(--color-text-primary)]">SkillBridge AI</span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">How it works</a>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer bg-transparent border-none px-2"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-sm font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-purple-600 hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(255,45,120,0.35)] cursor-pointer border-none"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">

                {/* Animated background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-50"
                        style={{
                            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,45,120,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 60%, rgba(59,130,246,0.1) 0%, transparent 60%)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-x 8s ease infinite',
                        }}
                    />
                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                    />
                    {/* Floating orbs */}
                    <div
                        className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full blur-3xl opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(255,45,120,0.8), transparent)', animation: 'float 7s ease-in-out infinite' }}
                    />
                    <div
                        className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full blur-3xl opacity-15"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8), transparent)', animation: 'float 9s ease-in-out infinite reverse' }}
                    />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        AI-Powered Interview Preparation
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                        {"Walk in ".slice(0, charCount)}
                        {charCount < 8 && <Cursor />}
                        {charCount >= 8 && (
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(135deg, var(--color-accent), #a855f7, #3b82f6)' }}
                            >
                                {"prepared.".slice(0, charCount - 8)}
                            </span>
                        )}
                        {charCount >= 8 && charCount < 17 && <Cursor />}
                        <br />
                        {charCount >= 17 && (
                            <>
                                {"Walk out with the ".slice(0, charCount - 17)}
                                {charCount >= 17 && charCount < 35 && <Cursor />}
                            </>
                        )}
                        {charCount >= 35 && (
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(135deg, var(--color-accent), #a855f7, #3b82f6)' }}
                            >
                                {"offer.".slice(0, charCount - 35)}
                            </span>
                        )}
                        {charCount >= 35 && charCount < 41 && <Cursor />}
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
                        Your personal AI coach that analyzes any job description and your resume to generate targeted questions, identify skill gaps, and build a winning prep roadmap — in seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <button
                            id="hero-get-started"
                            onClick={() => navigate('/register')}
                            className="relative overflow-hidden group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[var(--color-accent)] to-purple-600 hover:opacity-90 transition-all duration-200 shadow-[0_8px_32px_rgba(255,45,120,0.4)] hover:shadow-[0_8px_40px_rgba(255,45,120,0.55)] active:scale-[0.98] cursor-pointer border-none"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Preparing Now
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>

                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                    <span className="text-xs text-[var(--color-text-muted)] tracking-widest uppercase">Scroll</span>
                    <div className="w-px h-8 bg-gradient-to-b from-[var(--color-text-muted)] to-transparent animate-pulse" />
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────────────── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section heading */}
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Everything you need</p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                            Built to get you{' '}
                            <span className="bg-gradient-to-r from-[var(--color-accent)] to-purple-400 bg-clip-text text-transparent">
                                hired
                            </span>
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto">
                            Every feature is designed around one goal: walking into your interview fully prepared.
                        </p>
                    </div>

                    {/* Feature grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                className="group relative p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-color)] hover:border-[rgba(255,45,120,0.25)] transition-all duration-300 overflow-hidden cursor-default"
                                style={{ '--glow': f.glow }}
                            >
                                {/* Hover glow */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                                    style={{ background: `radial-gradient(ellipse at 0% 0%, ${f.glow} 0%, transparent 70%)` }}
                                />

                                {/* Icon */}
                                <div className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                                    {f.icon}
                                </div>

                                <h3 className="relative z-10 text-base font-bold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                                <p className="relative z-10 text-sm text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
            <section id="how-it-works" className="py-24 px-6 bg-[var(--color-bg-card)]/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Simple process</p>
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                            Ready in{' '}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                3 steps
                            </span>
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto">
                            From zero to fully-prepared interview strategy in under a minute.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-10 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-[rgba(255,45,120,0.4)] via-[rgba(139,92,246,0.4)] to-[rgba(16,185,129,0.4)]" />

                        {STEPS.map((s, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-5">
                                {/* Number badge */}
                                <div className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-xl flex-shrink-0`}>
                                    <span className="text-2xl font-extrabold text-white">{s.num}</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{s.title}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────────── */}
            <section className="py-24 px-6 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,45,120,0.2) 0%, transparent 70%)',
                            animation: 'pulse-slow 5s ease-in-out infinite',
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        Your next interview{' '}
                        <br />
                        <span className="bg-gradient-to-r from-[var(--color-accent)] to-purple-400 bg-clip-text text-transparent">
                            starts here.
                        </span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
                        Join the smarter way to prepare for your next interview.                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            id="cta-get-started"
                            onClick={() => navigate('/register')}
                            className="relative overflow-hidden group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[var(--color-accent)] to-purple-600 hover:opacity-90 transition-all duration-200 shadow-[0_8px_32px_rgba(255,45,120,0.4)] hover:shadow-[0_8px_40px_rgba(255,45,120,0.55)] active:scale-[0.98] cursor-pointer border-none"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Create Your Account
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer bg-transparent border-none"
                        >
                            Already have an account →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────── */}
            <footer className="border-t border-[var(--color-border-color)] py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm text-[var(--color-text-primary)]">SkillBridge AI</span>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-[var(--color-text-muted)] m-0">
                        © {new Date().getFullYear()} SkillBridge AI. All rights reserved.
                    </p>

                    {/* Contact Links */}
                    <div className="flex items-center gap-6">
                        <span className="text-xs text-[var(--color-text-muted)] font-medium select-none">Connect:</span>
                        <a href="https://github.com/VanshVanapariya/skillBridge-AI" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors no-underline">GitHub</a>
                        <a href="https://www.linkedin.com/in/vansh-vanapariya-12556228b/" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors no-underline">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
