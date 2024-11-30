import React from "react";
import "./forecast.css";
import { useState } from "react";
import axios from "axios";
import config from "./config.js";

export default function Forecast() {
  // State to manage form inputs
  const [info, setInfo] = useState({
    state: "",
    itemCategory: "",
    subCategory: "",
    months: "",
    prevSale: "",
  });

  // State for forecast results, loading indicator, and error messages
  const [forecastResult, setForecastResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // To store error messages

  const backendUrl = config.backendUrl;

  // List of states and product categories for dropdown options
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep",
    "Puducherry", "Ladakh", "Jammu and Kashmir",
  ];

  const productCategories = [
    "Electronics", "Fashion", "Home & Kitchen", "Books", "Health & Beauty",
    "Sports & Outdoors", "Toys & Games", "Automotive", "Pet Supplies",
    "Office Supplies", "Stationeries",
  ];

  // Subcategories depend on the selected product category
  const subCategories = {
    Electronics: ["Smartphone", "Laptop", "Smartwatch", "Television", "Camera"],
    Fashion: ["Shirts", "Pants", "Dresses", "Jackets", "Socks"],
    Stationeries: ["Pens", "Notebooks", "Markers", "Staplers", "Folders"],
    Books: ["Fiction", "Non-fiction", "Textbooks", "Magazines", "Comics"],
    "Home & Kitchen": ["Cookware", "Furniture", "Home Decor", "Storage", "Cleaning"],
    Toys: ["Action Figures", "Puzzles", "Board Games", "Dolls", "Remote Control Cars"],
    "Health & Beauty": ["Skincare", "Haircare", "Makeup", "Perfume", "Body Lotion"],
  };

  // Update form state as user types/selects values
  function handleChange(event) {
    const { name, value } = event.target;

    // Reset the subCategory field if itemCategory changes
    setInfo((prevInfo) => {
      if (name === "itemCategory" && value !== prevInfo.itemCategory) {
        return { ...prevInfo, [name]: value, subCategory: "" };
      }
      return { ...prevInfo, [name]: value };
    });

    // Clear error when user makes a change
    setError("");
  }

  // Validate input fields and fetch forecast from the server
  async function handleForecast() {
    // Ensure all fields are filled
    if (!info.state || !info.itemCategory || !info.subCategory || !info.months || !info.prevSale) {
      setError("All fields are required. Please fill out all fields.");
      return;
    }

    // Start loading
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Make POST request to the backend with user input
      const response = await axios.post(
        `${backendUrl}/forecast`,
        info
      );
      // Update forecast result with the server response
      setForecastResult(response.data.predictedSale);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setError("Failed to fetch forecast. Please try again later.");
    } finally {
      // Stop loading after the request is complete
      setLoading(false);
    }
  }

  return (
    <div className="forecast-container">
      {/* Motivational text */}
      <div className="forecast-text">
        <h6>The best way to predict the future is to create it,</h6>
        <h6>Through data-driven insights and informed decisions.</h6>
      </div>

      {/* Form section */}
      <div className="forecast-form">
        {/* State selection */}
        <label htmlFor="state" className="forecast-label">Select State:</label>
        <select
          id="state"
          value={info.state}
          name="state"
          onChange={handleChange}
          className="forecast-select"
        >
          <option value="" disabled>--Choose State--</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        {/* Product category selection */}
        <label htmlFor="itemCategory" className="forecast-label">Select Item's Category:</label>
        <select
          id="itemCategory"
          value={info.itemCategory}
          name="itemCategory"
          onChange={handleChange}
          className="forecast-select"
        >
          <option value="" disabled>--Choose Category--</option>
          {productCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Subcategory selection */}
        <label htmlFor="subCategory" className="forecast-label">Select Product Name:</label>
        <select
          id="subCategory"
          name="subCategory"
          value={info.subCategory}
          onChange={handleChange}
          className="forecast-select"
          disabled={!info.itemCategory} // Disabled until a category is selected
        >
          <option value="" disabled>--Choose Product--</option>
          {info.itemCategory &&
            subCategories[info.itemCategory]?.map((subCategory, index) => (
              <option key={index} value={subCategory}>{subCategory}</option>
            ))}
        </select>

        {/* Months selection */}
        <label htmlFor="months" className="forecast-label">For How Many Months Do You Need Forecast?</label>
        <select
          id="months"
          name="months"
          value={info.months}
          onChange={handleChange}
          className="forecast-select"
        >
          <option value="" disabled>--Select Months--</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
          ))}
        </select>

        {/* Previous sales input */}
        <label className="forecast-label">
          What was your last {info.months} {info.months === 1 ? "month" : "months"} sales for {info.subCategory || "the selected product"}?
        </label>
        <input
          type="text"
          name="prevSale"
          value={info.prevSale}
          onChange={handleChange}
          placeholder="31"
          className="forecast-input"
        />

        {/* Submit button */}
        <button
          onClick={handleForecast}
          className="forecast-button"
          disabled={loading}
        >
          {loading ? "Forecasting..." : "Forecast!"}
        </button>

        {/* Error message */}
        {error && <p className="forecast-error">{error}</p>}

        {/* Forecast result */}
        {forecastResult !== null && (
          <div className="forecast-result">
            <h3>
              Expected Sales of {info.subCategory || "the selected product"} in next {info.months} {info.months === 1 ? "month" : "months"} is: {forecastResult}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
