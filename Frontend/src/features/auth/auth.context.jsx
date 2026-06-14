import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)   // action loading (login/register/logout)
    const [bootLoading, setBootLoading] = useState(true) // initial session check on app load

    // Bootstrap: verify session cookie exactly once when app loads
    useEffect(() => {
        getMe()
            .then(data => setUser(data?.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setBootLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, bootLoading }}>
            {children}
        </AuthContext.Provider>
    )
}