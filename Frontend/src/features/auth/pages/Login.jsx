import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const HIGHLIGHTS = [
    {
        label: 'Role-specific, not generic',
        desc: 'Every question and roadmap is generated from the actual job description you provide.',
        color: 'from-[var(--color-accent)] to-pink-400',
    },
    {
        label: 'Technical & behavioural coverage',
        desc: 'Get a balanced mix of coding, system design, and soft-skill questions.',
        color: 'from-purple-500 to-violet-400',
    },

    {
        label: 'Resume gap detection',
        desc: 'See exactly which skills the employer wants that your profile is missing.',
        color: 'from-emerald-500 to-teal-400',
    },
]

const Login = () => {
    const navigate = useNavigate()
    const { loading, handleLogin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleLogin({ email, password })
        if (result && result.success) navigate("/")
        else alert(result?.error || "Login Failed")
    }

    if (loading) {
        return (
            <main className="w-full min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-accent)]/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent)] animate-spin"></div>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm tracking-widest uppercase animate-pulse">Authenticating</p>
                </div>
            </main>
        )
    }

    return (
        <main className="w-full min-h-screen flex bg-[var(--color-bg-page)]">

            {/* ── LEFT PANEL ─────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 overflow-hidden mb-5">

                {/* Animated gradient mesh background */}
                <div className="absolute inset-0 bg-[var(--color-bg-page)]">
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(255,45,120,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(59,130,246,0.1) 0%, transparent 60%)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-x 8s ease infinite',
                        }}
                    ></div>
                    {/* Subtle dot grid */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                    ></div>
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-bg-page)_100%)]"></div>
                </div>

                {/* Brand */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[rgba(255,45,120,0.4)]">
                        <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                    </div>
                    <span className="text-[var(--color-text-primary)] font-bold text-lg tracking-tight">SkillBridge AI | Interview Coach</span> 
                </div>
                <br></br>
                <br></br>
                
                {/* Hero copy */}
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight">
                            Ace your next <span />
                            <span className="bg-gradient-to-r from-[var(--color-accent)] to-purple-400 bg-clip-text text-transparent">
                                interview
                            </span>{' '}with AI.
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-xx">
                            Your personal AI coach that prepares you with real questions, insights, and a targeted roadmap.
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-3">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">Why it works</p>
                        <ul className="space-y-3">
                            {HIGHLIGHTS.map((h, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors duration-200">
                                    <div className={`shrink-0 mt-1 w-1 h-8 rounded-full bg-gradient-to-b ${h.color}`}></div>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">{h.label}</p>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{h.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                {/* Subtle top separator line */}
                <div className="hidden lg:block absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-border-color)] to-transparent"></div>

                <div className="w-full max-w-sm animate-slide-in-right">
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Sign in</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[var(--color-accent)] font-semibold hover:underline underline-offset-4">
                                Create one
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-[var(--color-accent)] hover:underline underline-offset-4">Forgot password?</Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="relative overflow-hidden group w-full h-12 mt-2 rounded-xl font-semibold text-sm text-white cursor-pointer border-none bg-gradient-to-r from-[var(--color-accent)] to-[#9333ea] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(255,45,120,0.35)] hover:shadow-[0_4px_32px_rgba(255,45,120,0.5)]"
                        >
                            <span className="relative z-10">Continue →</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login