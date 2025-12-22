import React from 'react';
import './RegistrationClosed.css';
import banner from '../asset/banner.png';

const RegistrationClosed = () => {
  return (
    <div className="registration-container">
      <div className="form-card registration-closed">
        <img src={banner} alt="banner.png" />

        <h1>Player Registration Closed</h1>

        <p>
          Thank you for the overwhelming response 🙏 <br />
          Player registrations for this season are now officially closed.
        </p>

        <div style={{ margin: '20px' }}>
          <a
            href="/players"
            className="view-players-btn"
          >
            View Registered Players
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationClosed;
