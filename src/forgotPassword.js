import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./forgotPassword.css";
import config from "./config.js";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const navigate = useNavigate();

    const backendUrl = config.backendUrl;

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email to reset password.");
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/forgotPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || "Check your email for the reset link.");
                setShowCodeInput(true); // Show code input after sending the email
            } else {
                throw new Error(data.message || "Error sending reset link.");
            }
        } catch (err) {
            setMessage(err.message || "Error resetting password. Please try again.");
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            alert("Please enter a valid 6-digit code.");
            return;
        }

        try {
            const response = await fetch(`https://algrowbiz-backend-2.onrender.com/verifyCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verificationCode }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || "Code verified successfully. You can now reset your password.");
                // Navigate to reset password page with the email passed in state
                navigate("/resetPassword", { state: { email } });
            } else {
                throw new Error(data.message || "Invalid code. Please try again.");
            }
        } catch (err) {
            setMessage(err.message || "Error verifying code. Please try again.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <div className="form-title">Forgot Password</div>

                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                </div>

                <button className="action-btn" onClick={handleForgotPassword}>Send Code</button>

                {/* {message && <div className="message">{message}</div>} */}

                {message && (
                    <div
                        className={`forgot-message ${
                        message === 'Password reset email sent' ? 'forgot-message-green' : 'forgot-message-red'
                        }`}
                    >
                        {message}
                    </div>
                )}

                {showCodeInput && (
                    <div className="code-input-container">
                        <div className="code-description">Enter the 6-digit code sent to your email</div>
                        <input
                            type="text"
                            placeholder="Enter code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength="6"
                            className="code-input-field"
                        />
                        <button className="action-btn" onClick={handleVerifyCode}>Verify Code</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
