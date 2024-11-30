import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./initForm.css";
import config from "./config.js";

export default function InitForm() {
  const [custInfo, setCustInfo] = useState({
    companyName: "",
    state: "",
    city: "",
    mobileNumber: "",
  });

  const [prodCategories, setProdCategories] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const backendUrl = config.backendUrl;

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
    'Beauty & Personal Care', 'Books', 'Clothes', 'Electronics', 'Footwear',
    'Furniture', 'Groceries', 'Home Appliances', 'Stationery', 'Toys'
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustInfo((prevCustInfo) => ({
      ...prevCustInfo,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setProdCategories((prevProdCategories) => [...prevProdCategories, value]);
    } else {
      setProdCategories((prevProdCategories) =>
        prevProdCategories.filter((category) => category !== value)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newError = {};

    console.log("proceed clicked");

    // Validate required fields
    if (!custInfo.companyName) {
      newError.companyName = "Company name is required.";
    }
    if (!custInfo.state) {
      newError.state = "State is required.";
    }
    if (!custInfo.city) {
      newError.city = "City is required.";
    }
    if (!custInfo.mobileNumber) {
      newError.mobileNumber = "Mobile number is required.";
    }
    if (prodCategories.length === 0) {
      newError.prodCategories = "At least one category must be selected.";
    }

    setError(newError);

    if (Object.keys(newError).length === 0) {
      const data = {
        companyName: custInfo.companyName,
        state: custInfo.state,
        city: custInfo.city,
        mobileNumber: custInfo.mobileNumber,
        prodCategories: prodCategories,
      };

      console.log(data);

      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.post(
          `${backendUrl}/initForm?userId=${userId}`,
          data,
          { headers: { "Content-Type": "application/json" } }
        );

        console.log('Data sent to backend');

        if (response.status === 200) {
          console.log("init Form submitted successfully!");
          setError({});
          navigate("/home");
        } else {
          console.error("Form submission failed:", response.statusText);
          setError({ submit: "Form submission failed. Please try again." });
        }
      } catch (err) {
        console.error("An error occurred:", err);
        setError({ submit: "An error occurred. Please try again later." });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="initform-container">
      <label htmlFor="companyName">Company Name</label>
      <input
        type="text"
        placeholder="Gada Electronics"
        value={custInfo.companyName}
        onChange={handleChange}
        name="companyName"
      />
      {error.companyName && <p className="error">{error.companyName}</p>}

      <label htmlFor="state">Select State: </label>
      <select
        id="state"
        value={custInfo.state}
        name="state"
        onChange={handleChange}
      >
        <option value="">--Choose State--</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      {error.state && <p className="error">{error.state}</p>}

      <label htmlFor="city">City</label>
      <input
        type="text"
        placeholder="Enter your city"
        value={custInfo.city}
        onChange={handleChange}
        name="city"
      />
      {error.city && <p className="error">{error.city}</p>}

      <label htmlFor="mobileNumber">Mobile Number</label>
      <input
        type="text"
        placeholder="Enter mobile number"
        value={custInfo.mobileNumber}
        onChange={handleChange}
        name="mobileNumber"
      />
      {error.mobileNumber && <p className="error">{error.mobileNumber}</p>}

      <label>Select Categories:</label>
      <div className="categories-grid">
        {productCategories.map((category) => (
          <div key={category} className="initForm-category-div">
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

      <button type="submit">Proceed</button>
      {error.submit && <p className="error-submit-initform">{error.submit}</p>}
    </form>
  );
}
