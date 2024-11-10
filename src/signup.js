import React from 'react'
import {db} from './firebase'
import './style.css'
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'

const Sign_up = ({setAuth}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setAuth(true); 
          navigate('/home');  // Redirect to login after successful signup
        } catch (err) {
          switch (err.code) {
            case 'auth/email-already-in-use':
              alert("This email is already in use. Please try logging in or use another email.");
              break;
            case 'auth/invalid-email':
              alert("Invalid email format. Please check and try again.");
              break;
            case 'auth/weak-password':
              alert("Password is too weak. Use at least 6 characters.");
              break;
            default:
              alert("Error signing up. Please try again later.");
              break;
          }
        }
      };
    
    return (
        <div className='container'>
          <div className='form'>
            <h2>Sign Up</h2>
            <div className='box'>
              <input type='text' placeholder='UserName' onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='box'>
              <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='box'>
              <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="error">{error}</p>}
            <button className='submit-btn' onClick={handleSignUp}>Sign Up</button>
            <p>Already have an account? <Link to='/initForm'>Login</Link></p>
          </div>
        </div>
      );
  /*return (
    <div className='container'>
        <div className='form'>
            <h2>Sign Up</h2>
            <div className='box'>
                <input type='text' placeholder='UserName' onChange={(e)=>setName(e.target.value)}></input>
            </div>
            <div className='box'>
                <input type='email' placeholder='Email' onChange={(e)=>setEmail(e.target.value)}></input>
            </div>
            <div className='box'>
                <input type='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)}></input>
            </div>
            <p>Already have an account? <Link to='/login'>Login</Link></p>
            <button>Sign Up</button>
        </div>
    </div>
  )*/
}

export default Sign_up