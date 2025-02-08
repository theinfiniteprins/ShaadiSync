import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isSignin, setIsSignin] = useState(false);

    // Check if token exists in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            setIsSignin(true);
        }
    }, []);

    // Login Function
    const login = (newToken) => {
        setToken(newToken);
        setIsSignin(true);
        localStorage.setItem("token", newToken);
    };

    // Logout Function
    const logout = () => {
        setToken(null);
        setIsSignin(false);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, isSignin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
