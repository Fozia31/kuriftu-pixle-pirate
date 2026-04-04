import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('kuriftu_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const getBaseUrl = () => {
        return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://localhost:3000/api'
            : 'https://kuriftu-pixle-pirate.onrender.com/api';
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${getBaseUrl()}/auth/login`, { email, password });
            setUser(res.data);
            localStorage.setItem('kuriftu_user', JSON.stringify(res.data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const signup = async (name, email, password, role, preferences = []) => {
        try {
            const res = await axios.post(`${getBaseUrl()}/auth/signup`, { name, email, password, role, preferences });
            setUser(res.data);
            localStorage.setItem('kuriftu_user', JSON.stringify(res.data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kuriftu_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
