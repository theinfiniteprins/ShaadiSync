import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../configs/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isSignin, setIsSignin] = useState(!!localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    // Fetch user data function
    const fetchUser = async (authToken) => {
        try {
            const response = await axios.get(
                `${config.baseUrl}/api/users/me`,
                {
                    headers: { 
                        Authorization: `Bearer ${authToken}`,
                        'Cache-Control': 'no-cache'
                    }
                }
            );
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            // If unauthorized, logout
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        if (token && !user) {
            fetchUser(token);
        }
    }, [token, user]);

    // Set up axios interceptor for token
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [token]);

    // Login Function
    const login = (newToken,role='user') => {
        if(role==='user'){
            localStorage.setItem("token", newToken);
            setToken(newToken);
            setIsSignin(true);
            fetchUser(newToken);
        }else{
            localStorage.setItem("artistToken", newToken);
            setToken(newToken);
            setIsSignin(true);
            fetchUser(newToken);
        }
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setIsSignin(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, isSignin, login, logout, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
