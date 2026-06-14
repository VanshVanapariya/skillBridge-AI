import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout } from "../services/auth.api";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, bootLoading } = context
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
            navigate("/landing")
        } catch (err) {

        }
        finally {
            setLoading(false)
        }
    }

    return { user, loading, bootLoading, handleRegister, handleLogin, handleLogout }
}