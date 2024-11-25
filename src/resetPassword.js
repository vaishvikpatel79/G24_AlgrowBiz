import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./resetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation(); // To get the email from navigation state
  const email = location.state?.email; // Extract email from state

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill out both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Password reset successfully.");
      } else {
        throw new Error(data.message || "Error resetting password. Please try again.");
      }
    } catch (err) {
      setMessage(err.message || "Error resetting password. Please try again.");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-form">
        <div className="reset-heading">Reset Password</div>

        <div className="reset-input-box">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="reset-input"
          />
        </div>

        <div className="reset-input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="reset-input"
          />
        </div>

        <button className="reset-btn" onClick={handleResetPassword}>
          Reset Password
        </button>

        {message && <div className="reset-message">{message}</div>}
      </div>
    </div>
  );
}

export default ResetPassword;
