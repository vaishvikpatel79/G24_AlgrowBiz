import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useState} from "react";
import axios from 'axios'; 
import "./home.css";
import config from "./config.js";

const Home_page = () => {
    const userId = localStorage.getItem('userId');
    const [userName, setUserName] = useState('');

    const backendUrl = config.backendUrl;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/home/${userId}`);
                if(response.data){
                    setUserName(response.data);
                }
            } catch (err) {
                console.error('An error occurred:', err);
            }
        };
        fetchData();
    }, [userId]); // Add userId as a dependency if it's being updated dynamically    

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome {userName !== '' ? {userName} : "to AlgrowBiz" } !</h1>
                <p>Explore various features to manage your business.</p>
            </header>
            
            <div className="card-container">
                {/* <Link to="/profile" className="card">
                    <h3>Profile</h3>
                    <p>View and edit your profile details.</p>
                </Link> */}
                <Link to="/forecast" className="card">
                    <h3>Forecast</h3>
                    <p>View sales forecasts and plan ahead.</p>
                </Link>
                <Link to="/inventoryManagement" className="card">
                    <h3>Inventory</h3>
                    <p>Manage your product inventory with ease.</p>
                </Link>
                <Link to="/inventoryOptimization" className="card">
                    <h3>Inventory Optimization</h3>
                    <p>Optimise your inventory with ease.</p>
                </Link>
                <Link to="/trends" className="card">
                    <h3>Trends</h3>
                    <p>Analyze the latest trends in your industry.</p>
                </Link>
            </div>
        </div>
    );
};

export default Home_page;
