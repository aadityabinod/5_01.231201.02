import axios from 'axios';
import toast from 'react-hot-toast';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [verificationToken, setVerificationToken] = useState("");
    const navigate = useNavigate();
    const serverUrl = "http://localhost:5000";

    const registerUser = async (e) => {
        e.preventDefault();

        if (
            !userState.email.includes("@") ||
            !userState.password ||
            userState.password.length < 6
        ) {
            toast.error("Please enter a valid email and password (min 6 characters)");
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/auth/register`, userState);
            console.log("User registered successfully", res.data);
            toast.success("User registered successfully");

            setUserState({
                name: "",
                email: "",
                password: "",
            });
            navigate("/verifyEmail");
        } catch (error) {
            console.log("Error registering user", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to register user");
        }
    };

    const verifyEmail = async (code) => {
        try {
            const res = await axios.post(`${serverUrl}/auth/verifyEmail`, { code });
            console.log("User verified successfully", res.data);
            setUser(res.data.user);
            navigate("/login");
        } catch (error) {
            console.log("Error verifying user", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to verify email");
        }
    };

    const loginUser = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${serverUrl}/auth/login`, userState);
            console.log("User logged in successfully", res.data);
            setUser(res.data.user);
            navigate("/");
        } catch (error) {
            console.log("Error logging in user", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to log in");
        }
    };

    const logoutUser = async () => {
        try {
            await axios.get(`${serverUrl}/auth/logout`);
            setUser({});
            navigate("/login");
        } catch (error) {
            console.log("Error logging out user", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to log out");
        }
    };

    const checkAuth = async () => {
        try {
            const res = await axios.get(`${serverUrl}/auth/checkAuth`);
            console.log("User authenticated", res.data);
            setUser(res.data.user);
        } catch (error) {
            console.log("Error authenticating user", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to authenticate");
        }
    };

    const forgotPassword = async (email) => {
        try {
            const res = await axios.post(`${serverUrl}/auth/forgotPassword`, { email });
            console.log("Password reset email sent", res.data);
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error sending password reset email", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to send reset email");
        }
    };

    const resetPassword = async (password, token) => {
        try {
            const res = await axios.post(`${serverUrl}/auth/resetPassword`, { password, token });
            console.log("Password reset successfully", res.data);
            toast.success(res.data.message);
            navigate("/login");
        } catch (error) {
            console.log("Error resetting password", error.response?.data.message);
            toast.error(error.response?.data.message || "Failed to reset password");
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                userState,
                setUserState,
                registerUser,
                verifyEmail,
                loginUser,
                logoutUser,
                checkAuth,
                forgotPassword,
                resetPassword,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);