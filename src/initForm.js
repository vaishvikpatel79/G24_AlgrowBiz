import React from "react";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';

export default function InitForm(){
    const [custInfo, setCustInfo] = useState({
        companyName: "",
        state: "",
    })

    const [prodCategories,setProdCategories] = useState([]);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
        'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
        'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Lakshadweep',
        'Puducherry', 'Ladakh', 'Jammu and Kashmir'
      ];

      const productCategories = [
        'Electronics',
        'Fashion',
        'Home & Kitchen',
        'Books',
        'Health & Beauty',
        'Sports & Outdoors',
        'Toys & Games',
        'Automotive',
        'Pet Supplies',
        'Office Supplies',
        'Stationaries'
      ];
      

    function handleChange(event){
        const { name, value } = event.target;
        setCustInfo(prevCustInfo => ({
            ...prevCustInfo,
            [name]: value // Use value directly, not [value]
    }));
    }

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
    
        // Add or remove the category based on whether it's checked or unchecked
        if (checked) {
            setProdCategories(prodCategories => [...prodCategories, value]);
        } 
        else {
            setProdCategories(prodCategories.filter((category) => category !== value));
        }
      };

    async function handleSubmit(event){
        event.preventDefault();
        const newError = {};

        // Validate required fields
        if (!custInfo.companyName) {
            newError.companyName = "Company name is required.";
        }
        if (!custInfo.state) {
            newError.state = "State is required.";
        }
        if (prodCategories.length === 0) {
            newError.prodCategories = "At least one category must be selected.";
        }

        setError(newError);

        if (Object.keys(newError).length === 0) {
            const data = {
                companyName: custInfo.companyName,
                state: custInfo.state,
                prodCategories: prodCategories
            };

            try{
                const response = await axios.post('http://localhost:5000/initForm', data, {
                    headers: {"Content-Type": "application/json"}
                });

                if(response.status === 200){
                    console.log("init Form submitted successfully !");
                    setError({});
                    navigate("/home");
                }
                else {
                    console.error('Form submission failed:', response.statusText);
                    setError({ submit: 'Form submission failed. Please try again.' });
                }
            }
            catch(err){
                console.error('An error occurred:', err);
                setError({ submit: err.response?.data?.message || 'An error occurred. Please try again later.' });
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="userName">Company Name</label>
            <input 
                type="text" 
                placeholder="Gada Electronics" 
                value={custInfo.companyName}
                onChange={handleChange}
                name='companyName'
            />

            <br />

            {error.companyName && <p className="error">{error.companyName}</p>}

            <label htmlFor="state">Select State: </label>
            <select
                id='state'
                value={custInfo.state}
                name="state"
                onChange={handleChange}
            >
            <option value="">--Choose State--</option>
            {
                states.map((state) => (
                    <option key={state} value={state}>
                        {state}
                    </option>
                ))
            }
            </select>

            <br />

            {error.state && <p className="error">{error.state}</p>}

            <label>Select Categories:</label>
            <div>
                {productCategories.map((category) => (
                    <div key={category}>
                        <input
                            type="checkbox"
                            id={category}
                            value={category}
                            checked={prodCategories.includes(category)}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor={category}>{category}</label>
                    </div>
                ))}
            </div>

            {error.prodCategories && <p className="error">{error.prodCategories}</p>}

            <button>Proceed</button>

        </form>
    );
}