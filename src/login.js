import React from "react";
import { db } from "./firebase";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";

const Login_page = ({setAuth}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuth(true);  
      navigate('/home');  // Redirect to home or another page after successful login
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          alert("No user found with this email. Please sign up.");
          break;
        case 'auth/wrong-password':
          alert("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          alert("Invalid email format. Please check and try again.");
          break;
        default:
          alert("Login failed. Please check your credentials and try again.");
          break;
      }   
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        alert("No user found with this email. Please check or sign up.");
      } else {
        alert("Error resetting password. Please try again.");
      }
    }
  };

  return (
    <div className='container'>
      <div className='form'>
        <h2>Login</h2>
        <div className='box'>
          <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='box'>
          <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error">{error}</p>}
        <button className='submit-btn' onClick={handleLogin}>Login</button>
        <button className='forgotpswrd-btn' onClick={handleForgotPassword}>Forgot Password?</button>
        <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
      </div>
    </div>
  );

  /*return (
    <div className="container">
      <div className="form">
        <h2>Login</h2>
        <div className="box">
          <input type="text" placeholder="UserName"></input>
        </div>
        <div className="box">
          <input type="email" placeholder="Email"></input>
        </div>
        <div className="box">
          <input type="password" placeholder="Password"></input>
        </div>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <button>Login</button>
      </div>
    </div>
  );*/

};

export default Login_page;
