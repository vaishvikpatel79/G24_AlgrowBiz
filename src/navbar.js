// Navbar.js
import React, { useState } from 'react';
import './navbar.css';
import { Link, NavLink } from 'react-router-dom';
import { FaUserCircle, FaChartLine } from 'react-icons/fa'; // Importing user icon from react-icons

export default function Navbar({setAuth}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleSignOut = () => {
    setAuth(false);
    NavLink('/');
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">
        <FaChartLine size={28} className="navbar-icon" />
        AlgrowBiz
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/forecast" className="nav-item" activeClassName="active">Forecast</NavLink>
        </li>
        <li>
          <NavLink to="/inventory" className="nav-item" activeClassName="active">Inventory</NavLink>
        </li>
        <li>
          <NavLink to="/inventoryOptimisation" className="nav-item" activeClassName="active">Inventory Optimisation</NavLink>
        </li>
        <li>
          <NavLink to="/trends" className="nav-item" activeClassName="active">Trends</NavLink>
        </li>
        
        {/* Profile icon with dropdown */}
        <li className="profile-icon" onClick={toggleDropdown}>
          <FaUserCircle size={28} />
          {showDropdown && (
            <div className="dropdown-menu">
            <NavLink to="/profile" className="dropdown-link nav-item">Profile</NavLink>
            <NavLink to="/" className="dropdown-link signOut" onClick={handleSignOut}>Sign Out</NavLink>
          </div>
          
          )}
        </li>
      </ul>
    </nav>
  );
}
