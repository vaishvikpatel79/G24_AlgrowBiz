import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import config from './config.js';

const LoginPage = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const backendUrl = config.backendUrl;

    const handleLogin = async () => {
        setError(""); // Clear previous errors
        setMessage(""); // Clear previous messages
        try {
            // send credentials to backend server
            const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // if there is an error in login
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            // login successful...
            const data = await response.json();
            console.log("Login successful:", data);

            setMessage("Login successful!");

            // store userId so that it can be used later
            if (data.userId) {
                localStorage.setItem('userId', data.userId);
            }
            else {
                throw new Error('UserId not found in the response');
            }
            setAuth(true); // Update authentication state, so that user can visit other pages
            navigate("/home"); // Redirect to home page
        } catch (err) {
            setError(err.message || "Error logging in. Please try again later.");
        }
    };

    const handleForgotPassword = async () => {
        navigate("/forgotPassword");
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Display error and success messages */}
                {error && <p className="error-message">{error}</p>}
                {message && <p className="message success-message">{message}</p>}
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
                <button
                    className="forgot-password-button"
                    onClick={handleForgotPassword}
                >
                    Forgot Password?
                </button>
                <p className="signup-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
