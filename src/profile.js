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
  const categoryList = ['Electronics', 'Clothes', 'Stationery', 'Groceries', 'Books', 'Furniture', 'Toys', 'Home Appliances', 'Footwear', 'Beauty & Personal Care'];

  useEffect(() => {
    fetchProfileData();
  }, []);

  // fetching the profile data to show
  const fetchProfileData = async () => {
    const uID = localStorage.getItem('userId');
    try {
      const response = await axios.get('http://localhost:5000/profile?userId=${uID}');
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // to change the input field value as soon as we change the value in the input field
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate mobile number
    if (name === 'mobileNumber') {
      const mobileRegex = /^[6-9]\d{9}$/; // Validates Indian 10-digit numbers starting with 6-9
      if (!mobileRegex.test(value)) {
        alert('Invalid mobile number. It must be 10 digits and start with 6, 7, 8, or 9.');
      }
    }

    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e, category) => {
    if (e.target.checked) {
      // Add category to the list
      setProfile((prevProfile) => ({
        ...prevProfile,
        categoriesSold: [...prevProfile.categoriesSold, category],
      }));
    } else {
      // Remove category from the list
      setProfile((prevProfile) => ({
        ...prevProfile,
        categoriesSold: prevProfile.categoriesSold.filter((c) => c !== category),
      }));
    }
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
      
      <div className="checkbox-container">
        <label className="checkbox-label">Categories Sold:</label>
        {isEditing ? (
          <div className="checkbox-field">
            {categoryList.map((category) => (
              <div className="each-checkbox" key={category}>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.categoriesSold.includes(category)}
                    onChange={(e) => handleCheckboxChange(e, category)}
                  />
                  {category}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="checkbox-para">{profile.categoriesSold.join(', ')}</p>
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

