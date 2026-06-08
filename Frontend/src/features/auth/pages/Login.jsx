import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()
    const { loading, handleLogin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleLogin({ email, password })
        if (result && result.success) navigate("/")
        else setError(result?.error || "Login failed. Please check your credentials.")
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
        <main className="w-full min-h-screen flex items-center justify-center bg-[var(--color-bg-page)] px-4 relative overflow-hidden">

            {/* Animated gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,45,120,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 90%, rgba(139,92,246,0.12) 0%, transparent 60%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradient-x 8s ease infinite',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                />
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md animate-fade-in-up">

                {/* Back to landing */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/landing')}
                        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to home
                    </button>
                </div>

                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-2xl p-8 shadow-2xl">

                    {/* Brand */}
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[rgba(255,45,120,0.4)]">
                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm text-[var(--color-text-primary)] tracking-tight">SkillBridge AI</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1.5">Welcome back</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[var(--color-accent)] font-semibold hover:underline underline-offset-4">
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="login-email" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="login-password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-[var(--color-accent)] hover:underline underline-offset-4">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="••••••••••"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            id="login-submit"
                            className="relative overflow-hidden group w-full h-12 mt-2 rounded-xl font-semibold text-sm text-white cursor-pointer border-none bg-gradient-to-r from-[var(--color-accent)] to-[#9333ea] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(255,45,120,0.35)] hover:shadow-[0_4px_32px_rgba(255,45,120,0.5)]"
                        >
                            <span className="relative z-10">Continue →</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login