import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="background-overlay"></div>

      {/* Project Logo */}
      <div className="content-container">
        <div className="logo-container">
          <img src='/algrowbiz-logo.jpg' alt="AlgrowBiz Logo" className="logo" />
        </div>

        <div className="description">
          <h1>Welcome to <span>AlgrowBiz</span></h1>
          <p>
            AlgrowBiz empowers you with smart retail sales forecasting and seamless inventory management.
            Make informed decisions, uncover product trends, and drive success with data-driven insights.
          </p>
        </div>

        {/* <div className='landingQuote'>Success in business is driven by data, and AlgrowBiz turns that data into growth.</div> */}

        <div className="">
          <Link to="/login" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
