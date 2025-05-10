import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavbarPvc from "./Navbar";
import './MyProfile.css'; // Import the CSS file

function MyProfile() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="my-profile-container">
      <NavbarPvc />
      <h1 className="my-profile-title">Bienvenido</h1>
      <p className="my-profile-description">Bienvenido a carpeta PVC</p>
      {/* Add the button here */}
      <button className="transfer-button" onClick={() => navigate('/transfer')}>
        Go to Transfer
      </button>
    </div>
  );
}

export default MyProfile;