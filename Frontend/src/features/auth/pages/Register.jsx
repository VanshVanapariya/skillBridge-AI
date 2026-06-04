import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const CAPABILITIES = [
   {
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>),
        label: 'Skill Gap Analysis',
        desc: 'Know exactly which skills to sharpen before the interview.',
    },
    {
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>),
        label: 'AI-Generated Questions',
        desc: 'Technical & behavioural questions tailored to the JD.',
    },
    {
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>),
        label: 'Day-wise Prep Roadmap',
        desc: 'A structured study plan from today to interview day.',
    },
    {
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6" /><path d="M12 9v6" /><circle cx="12" cy="12" r="10" /></svg>),
        label: 'Resume Match Score',
        desc: 'Instantly see how well your profile matches the role.',
    }
]

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!username || !email || !password) {
            setError("All fields are required.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.")
            return
        }
        if (!/(?=.*[a-z])/.test(password)) {
            setError("Password must contain at least one lowercase letter.")
            return
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            setError("Password must contain at least one uppercase letter.")
            return
        }
        if (!/(?=.*[0-9])/.test(password)) {
            setError("Password must contain at least one number.")
            return
        }
        if (!/(?=.*[!@#$%^&*])/.test(password)) {
            setError("Password must contain at least one special character (!@#$%^&*).")
            return
        }

        const result = await handleRegister({ username, email, password })
        if (result && result.success) {
            navigate("/login")
        } else if (result && result.error) {
            setError(result.error)
        }
    }

    if (loading) {
        return (
            <main className="w-full min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-accent)]/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent)] animate-spin"></div>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm tracking-widest uppercase animate-pulse">Creating account</p>
                </div>
            </main>
        )
    }

    return (
        <main className="w-full min-h-screen flex bg-[var(--color-bg-page)]">

            {/* ── LEFT PANEL ─────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 overflow-hidden mb-10">

                {/* Animated gradient mesh background */}
                <div className="absolute inset-0 bg-[var(--color-bg-page)]">
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            background: 'radial-gradient(ellipse 70% 70% at 10% 80%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,45,120,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)',
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

                <div className="relative z-10 flex flex-col gap-10">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[rgba(255,45,120,0.4)]">
                        <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                    </div>
                    <span className="text-[var(--color-text-primary)] font-bold text-lg tracking-tight">SkillBridge AI</span>
                </div>

                {/* Hero copy */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight">
                            Start your journey <span></span>
                            <span className="bg-gradient-to-r from-purple-400 to-[var(--color-accent)] bg-clip-text text-transparent">
                                to success
                            </span>{' '}today.
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-xx">
                            Everything you need to walk into any interview fully prepared &mdash; generated in seconds.
                        </p>
                    </div>

                    {/* Capabilities grid */}
                    <div className="space-y-3">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">What you get</p>
                        <div className="grid grid-cols-2 gap-3">
                            {CAPABILITIES.map((c, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-[rgba(255,45,120,0.2)] hover:bg-white/[0.05] transition-all duration-300 group">
                                    <div className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors mb-2">{c.icon}</div>
                                    <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">{c.label}</p>
                                    <p className="text-[0.7rem] text-[var(--color-text-muted)] leading-relaxed">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </div>

            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                {/* Subtle left border */}
                <div className="hidden lg:block absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-border-color)] to-transparent"></div>

                <div className="w-full max-w-sm animate-slide-in-right">
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Create your account</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Already have one?{' '}
                            <Link to="/login" className="text-[var(--color-accent)] font-semibold hover:underline underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="johndoe"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

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
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••••"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="relative overflow-hidden group w-full h-12 mt-2 rounded-xl font-semibold text-sm text-white cursor-pointer border-none bg-gradient-to-r from-purple-600 to-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_32px_rgba(139,92,246,0.5)]"
                        >
                            <span className="relative z-10">Create Account →</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                       <span></span>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register