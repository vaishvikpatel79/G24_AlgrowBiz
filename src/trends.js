import React, { useState } from "react"; 
import { Pie, Bar } from "react-chartjs-2"; // Importing Pie and Bar chart components from chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js"; // for renderig charts
import axios from "axios"; // to handle API requests
import "./trends.css"; // CSS file for styling the page
import config from './config.js';

// Registering necessary chart components with Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function Trends() {
  const [selectedState, setSelectedState] = useState("");       // State to hold the selected state
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected product category
  const [categoryData, setCategoryData] = useState([]);         // State to store fetched trends data
  const [loading, setLoading] = useState(false);                // State to track loading status
  const [error, setError] = useState(null);                     // State to store error message if API call fails

  const backendUrl = config.backendUrl;

  // List of states to be displayed in the state dropdown
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir",
  ];

  // List of product categories to be displayed in the category dropdown
  const productCategories = [
    "Beauty & Personal Care",
    "Books",
    "Clothes",
    "Electronics",
    "Footwear",
    "Furniture",
    "Groceries",
    "Home Appliances",
    "Stationery",
    "Toys",
  ];

  // Function to handle the "Show Trend" button click and fetch data
  const handleShowTrend = async () => {
    // Check if both state and category are selected
    if (!selectedState || !selectedCategory) {
      setError("Please select both a state and category."); // Show error if not selected
      return;
    }
    setError(null); // Reset error message
    setLoading(true); // Set loading state to true
    try {
      // Make API request to fetch trend data
        const response = await axios.post(
            `${backendUrl}/trends`,
            {
            state: selectedState, // Passing data to backend
            category: selectedCategory,
            }
        );

      // If response is successful, update categoryData state with fetched data
      if (response.status === 200) {
        setCategoryData(response.data);
      } else {
        setError("Failed to fetch trending products."); // Show error if response status is not 200
      }
    } catch (error) {
      // Handle any errors during the API request
      setError("Error fetching trend data.");
      console.error(error); // Log the error for debugging
    }
    setLoading(false); // Set loading state to false after the request completes
  };

  // Define a set of colors to use for the charts
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  // Data for Pie chart (trending products and their sales)
  const chartData = {
    labels: categoryData.map((product) => product.itemName), // Mapping product names to labels
    datasets: [
      {
        label: "Sales", // Label for the Pie chart
        data: categoryData.map((product) => product.sales),         // Map sales data to Pie chart values
        backgroundColor: colors.slice(0, categoryData.length),      // Use predefined colors for the slices
        hoverBackgroundColor: colors.slice(0, categoryData.length), // Set hover effect for slices
      },
    ],
  };

  // Data for Bar chart (trending products and their sales in horizontal bars)
  const barChartData = {
    labels: categoryData.map((product) => product.itemName), // Mapping product names to Bar chart labels
    datasets: [
      {
        label: "Sales", // Label for the Bar chart
        data: categoryData.map((product) => product.sales), // Mapping sales data to Bar chart values
        backgroundColor: colors.slice(0, categoryData.length),
      },
    ],
  };

  return (
    <div className="trends-container">
      {/* Header with quote and title */}
      <div className="trends-header">
        <h5 className="trends-quote">
          Success in retail lies in anticipating what’s next, not just following
          the crowd.
        </h5>
        <h2 className="trends-title">Trending Items by Category</h2>
        {/* Dropdowns for selecting state and category */}
        <div className="trends-filters">
          <select
            value={selectedState} // Binding the selected state to the dropdown
            onChange={(e) => setSelectedState(e.target.value)} // Update selected state on change
            className="trends-select"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory} // Binding the selected category to the dropdown
            onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category on change
            className="trends-select"
          >
            <option value="">Select Category</option>
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button onClick={handleShowTrend} className="trends-button">
            Show Trend
          </button>

          {/* Display error message if there is an error */}
          {error && <p className="trends-error">{error}</p>}
        </div>
      </div>

      {/* Display loading text if data is being fetched */}
      {loading && <p>Loading...</p>}

      {/* If category data is available, render the charts */}
      {categoryData.length > 0 && (
        <div className="charts-container">
          <div className="charts-wrapper">
            {/* Display the Pie chart */}
            <div className="trends-chart">
              <Pie data={chartData} />
            </div>
            {/* Display the Bar chart and trending product information */}
            <div className="trends-chart">
              <Bar data={barChartData} options={{ indexAxis: "y" }} />
              <p>
                The Most Trending Product in {selectedCategory} Category is{" "}
                {categoryData[0].itemName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
