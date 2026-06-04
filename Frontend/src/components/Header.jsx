import React, { useState, useEffect } from 'react'
import { useAuth } from '../features/auth/hooks/useAuth'

const Header = () => {
    const { user, handleLogout } = useAuth()
    const [isLight, setIsLight] = useState(() => {
        return localStorage.getItem('theme') === 'light'
    })

    useEffect(() => {
        if (isLight) {
            document.documentElement.classList.add('light')
            localStorage.setItem('theme', 'light')
        } else {
            document.documentElement.classList.remove('light')
            localStorage.setItem('theme', 'dark')
        }
    }, [isLight])

    if (!user) return null

    return (
        <header className="absolute top-0 left-0 right-0 py-4 px-6 flex items-center justify-between z-50">
            {/* User Profile */}
            <div className="flex items-center gap-2 ml-2">
                <div className="w-9 h-9 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center font-bold text-sm">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-[var(--color-text-primary)] font-medium text-sm">
                    {user.username || 'user'}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle Pill Switch */}
                <button 
                    onClick={() => setIsLight(!isLight)}
                    className={`relative w-[3.25rem] h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 border-none outline-none ${isLight ? 'bg-indigo-200' : 'bg-[var(--color-bg-input)] shadow-inner'}`}
                    aria-label="Toggle Theme"
                >
                    <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out transform shadow-sm ${isLight ? 'translate-x-5 bg-white text-indigo-500' : 'translate-x-0 bg-[var(--color-bg-card)] text-orange-400'}`}
                    >
                        {isLight ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        )}
                    </div>
                </button>

            {/* Logout Divider */}
            <div className="w-px h-6 bg-[var(--color-border-color)] mx-1"></div>

            {/* Logout Button */}
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors cursor-pointer bg-transparent border-none mr-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
            </button>
            </div>
        </header>
    )
}

export default Header
