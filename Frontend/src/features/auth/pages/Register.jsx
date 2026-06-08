import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
        <main className="w-full min-h-screen flex items-center justify-center bg-[var(--color-bg-page)] px-4 py-12 relative overflow-hidden">

            {/* Animated gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse 70% 70% at 10% 80%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,45,120,0.15) 0%, transparent 60%)',
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
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1.5">Create your account</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Already have one?{' '}
                            <Link to="/login" className="text-[var(--color-accent)] font-semibold hover:underline underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label htmlFor="register-username" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                id="register-username"
                                name="username"
                                type="text"
                                placeholder="johndoe"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="register-email" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                id="register-email"
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
                            <label htmlFor="register-password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                id="register-password"
                                name="password"
                                type="password"
                                placeholder="••••••••••"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-input)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                            />
                            <p className="text-[0.7rem] text-[var(--color-text-muted)] mt-1">
                                Min 8 chars · uppercase · lowercase · number · special character
                            </p>
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
                            id="register-submit"
                            className="relative overflow-hidden group w-full h-12 mt-2 rounded-xl font-semibold text-sm text-white cursor-pointer border-none bg-gradient-to-r from-purple-600 to-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_32px_rgba(139,92,246,0.5)]"
                        >
                            <span className="relative z-10">Create Account →</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Register