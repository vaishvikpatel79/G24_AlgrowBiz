import React from "react";
import { db } from "./firebase";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { auth } from "./firebase";

const Landing_page = () => {
    return (
        <div className='container'>
            <div className='form'>
                <h2>Welcome to Landing Page</h2>
            </div>
        </div>
    );
};

export default Landing_page;