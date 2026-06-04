import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/auth.api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await forgotPassword(email);
            setMessage(response.message || 'Reset link sent');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-page)] px-4 relative overflow-hidden">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 bg-[var(--color-bg-page)] pointer-events-none">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(255,45,120,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 60%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradient-x 8s ease infinite',
                    }}
                ></div>
                {/* Subtle dot grid */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                ></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border-color)] shadow-2xl animate-fade-in-up space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Forgot Password</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        Enter your email address to receive a password reset link.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email-address" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded-xl px-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/50 outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 hover:border-[#3a4560]"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {message && <div className="text-green-500 text-sm text-center font-medium bg-green-500/10 py-3 rounded-xl border border-green-500/20">{message}</div>}
                    {error && <div className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative overflow-hidden group w-full h-12 mt-2 rounded-xl font-semibold text-sm text-white cursor-pointer border-none bg-gradient-to-r from-[var(--color-accent)] to-[#9333ea] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(255,45,120,0.35)] hover:shadow-[0_4px_32px_rgba(255,45,120,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : "Send Reset Link"}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <Link to="/login" className="font-semibold text-sm text-[var(--color-accent)] hover:underline underline-offset-4 transition-all">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
