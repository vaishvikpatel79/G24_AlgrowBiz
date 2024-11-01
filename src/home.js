import React from "react";
import { db } from "./firebase";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { auth } from "./firebase";

const Home_page = () => {
    return (
        <div className='container'>
            <div className='form'>
                <h2>Welcome to Home Page</h2>
                <button className='submit-btn'>Profile</button>
                <button className='submit-btn'>Inventory Management</button>
                <button className='submit-btn'>Forecast</button>
                <button className='submit-btn'>Trends</button>
            </div>
            
        </div>
    );
};

export default Home_page;
