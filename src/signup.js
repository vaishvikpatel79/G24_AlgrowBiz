import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Sign_up = ({setAuth}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(''); // Reset error message
  
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    
    // to throw an error for invalid email address
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
  
    // password and confirm password should be equal
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      // sending the data to backend server
      const response = await fetch(`http://localhost:5000/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, email, password }),
      });
      
      // if there is some error in signup
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      // data received from backend server
      const data = await response.json();
  
      // Save userId to local storage for further use
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      } else {
        throw new Error('UserId not found in the response');
      }

      // set setAuth to true such that user can go to other pages
      setAuth(true);
      // Navigate to the next page, to collect initial basic info
      navigate('/initForm');
    } catch (err) {
      setError(err.message || 'Error signing up. Please try again later.');
    }
  };  

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-heading">Sign Up</h2>
        <div className="input-box">
          <input
            type="text"
            className="signup-input"
            placeholder="UserName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            className="signup-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            className="signup-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            className="signup-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="signup-error">{error}</p>}
        <button className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </button>
        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Sign_up;
