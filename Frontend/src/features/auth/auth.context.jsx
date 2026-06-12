import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Bootstrap: verify session cookie once when app loads
    useEffect(() => {
        getMe()
            .then(data => setUser(data?.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}