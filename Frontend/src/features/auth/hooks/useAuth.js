import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout, getMe } from "../services/auth.api";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const navigate = useNavigate()

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            await register({ username, email, password })
            return { success: true }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message }
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data) {
                setUser(data.user)
                return { success: true }
            } else {
                return { success: false, error: "Invalid response from server" }
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message }
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            navigate("/login")
        } catch (err) {

        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            }
            catch (err) { }
            finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}