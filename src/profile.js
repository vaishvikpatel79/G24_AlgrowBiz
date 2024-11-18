import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    mobileNumber: '',
    companyName: '',
    city: '',
    state: '',
    categoriesSold: []
  });
  const [isEditing, setIsEditing] = useState(false);

  const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  const categoryList = ['Electronics', 'Food', 'Health', 'Clothing', 'Home Appliances'];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile');
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setProfile({
      ...profile,
      categoriesSold: selectedOptions
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/editprofile', profile);
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-field">
        <label>User ID:</label>
        <p>{profile.userId}</p>
      </div>

      <div className="profile-field">
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="userName"
            value={profile.userName}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.userName}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="userEmail"
            value={profile.userEmail}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.userEmail}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Mobile Number:</label>
        {isEditing ? (
          <input
            type="text"
            name="mobileNumber"
            value={profile.mobileNumber}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.mobileNumber}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Company Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.companyName}</p>
        )}
      </div>

      <div className="profile-field">
        <label>City:</label>
        {isEditing ? (
          <input
            type="text"
            name="city"
            value={profile.city}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.city}</p>
        )}
      </div>

      <div className="profile-field">
        <label>State:</label>
        {isEditing ? (
          <select name="state" value={profile.state} onChange={handleChange}>
            <option value="">Select State</option>
            {statesList.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        ) : (
          <p>{profile.state}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Categories Sold:</label>
        {isEditing ? (
          <select
            name="categoriesSold"
            multiple
            value={profile.categoriesSold}
            onChange={handleCategoryChange}
          >
            {categoryList.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        ) : (
          <p>{profile.categoriesSold.join(', ')}</p>
        )}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={handleEdit}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;

