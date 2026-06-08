import { useAuth } from "../hooks/useAuth";
import React from 'react'
import { Navigate } from "react-router-dom"

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <main className="w-full min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
                <div className="w-12 h-12 border-4 border-[rgba(255,45,120,0.2)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                <h1 className="text-xl font-bold m-0 animate-pulse">Loading...</h1>
            </main>
        )
    }

    if (!user) {
        return <Navigate to="/landing" />
    }

    return children
}

export default Protected