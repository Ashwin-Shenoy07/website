import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; // We'll create this CSS next

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', age: '', battingStyle: 'Right-handed',
    bowlingStyle: 'None', role: 'Batsman', teamName: '', experience: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MONGO_URI =", process.env.MONGO_URI);
    setLoading(true);
    try {
      await axios.post('https://ccl2026backend.onrender.com/api/players/register', formData);
      setMessage('Registration Successful! Welcome to CCL 2025!');
      setFormData({
        fullName: '', email: '', phone: '', age: '', battingStyle: 'Right-handed',
        bowlingStyle: 'None', role: 'Batsman', teamName: '', experience: ''
      });
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="form-card">
        <div className="header-section">
          <h1>CCL 2025</h1>
          <p>Player Registration Form</p>
          <span>Join the Legacy • Play with Passion</span>
        </div>

        {message && (
          <div className={`message ${message.includes('Success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <label>Full Name</label>
          </div>

          <div className="input-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            <label>Phone Number</label>
          </div>

          <div className="input-group">
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            <label>Age</label>
          </div>

          <div className="row">
            <div className="input-group">
              <select name="battingStyle" value={formData.battingStyle} onChange={handleChange}>
                <option>Right-handed</option>
                <option>Left-handed</option>
              </select>
              <label>Batting Style</label>
            </div>

            <div className="input-group">
              <select name="bowlingStyle" value={formData.bowlingStyle} onChange={handleChange}>
                <option>None</option>
                <option>Right-arm Fast</option>
                <option>Left-arm Fast</option>
                <option>Right-arm Spin</option>
                <option>Left-arm Spin</option>
              </select>
              <label>Bowling Style</label>
            </div>
          </div>

          <div className="input-group">
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option>Batsman</option>
              <option>Bowler</option>
              <option>All-rounder</option>
              <option>Wicket-keeper</option>
            </select>
            <label>Primary Role</label>
          </div>

          <div className="input-group">
            <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} />
            <label>Team Name (Optional)</label>
          </div>

          <div className="input-group">
            <textarea name="experience" value={formData.experience} onChange={handleChange} rows="3" />
            <label>Cricket Experience (Optional)</label>
          </div>

          <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>

        <div className="footer-note">
          <p>Be a part of CCL 2025 • Limited Spots Available!</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
