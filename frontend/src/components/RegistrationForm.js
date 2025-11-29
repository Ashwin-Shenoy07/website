import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', place: '', aadharLast4: '', category: 'Batsman',
    battingStyle: 'Right-Handed', bowlingStyle: 'None', jerseySize: 'S',
    nameOnJersey: '', numberOnJersey: '', playedLastSeason: 'No'
  });
  const [files, setFiles] = useState({ aadharFile: null, profilePhoto: null });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (files.aadharFile) data.append('aadharFile', files.aadharFile);
    if (files.profilePhoto) data.append('profilePhoto', files.profilePhoto);

    try {
      const res = await axios.post(
        'https://ccl2026backend.onrender.com/api/players/register',
        data
      );

      if (res.data.success) {
        setMessage(
          <div style={{color:'green', fontSize:'1.4rem', fontWeight:'bold'}}>
            Registration Successful! <br/>
            Reg No: {res.data.regNumber} <br/>
            Name: {res.data.name} <br/>
            Place: {res.data.place}
          </div>
        );
        setFormData({ name: '', mobile: '', place: '', aadharLast4: '', category: 'Open',
          battingStyle: 'Right Hand', bowlingStyle: 'None', jerseySize: 'M',
          nameOnJersey: '', numberOnJersey: '', playedLastSeason: 'No' });
        setFiles({ aadharFile: null, profilePhoto: null });
      }
    } catch (err) {
      setMessage(
        <div style={{color:'red', fontWeight:'bold'}}>
          {err.response?.data?.message || "Registration Failed! Try again."}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="form-card">
        <h1>CCL 2026 Player Registration</h1>
        <p>Official Registration Portal</p>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* All your fields here - Name, Mobile, Place, etc. */}
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
          <input name="place" placeholder="Place / Area" value={formData.place} onChange={handleChange} required />
          <input name="aadharLast4" placeholder="Aadhar Last 4 Digits" maxLength="4" value={formData.aadharLast4} onChange={handleChange} required />

          <label>Aadhar Proof (PDF only)</label>
          <input type="file" name="aadharFile" accept=".pdf" onChange={handleFile} required />

          <label>Profile Photo (JPG/PNG)</label>
          <input type="file" name="profilePhoto" accept="image/*" onChange={handleFile} required />

          <div className="radio-group">
            <label>Category:</label>
            {['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'].map(c => (
              <label key={c}><input type="radio" name="category" value={c} checked={formData.category === c} onChange={handleChange} /> {c}</label>
            ))}
          </div>

          <div className="radio-group">
            <label>Batting:</label>
            {['Right-Handed', 'Left-Handed'].map(b => (
              <label key={b}><input type="radio" name="battingStyle" value={b} checked={formData.battingStyle === b} onChange={handleChange} /> {b}</label>
            ))}
          </div>

          <div className="radio-group">
            <label>Bowling:</label>
            {['Right Arm', 'Left Arm', 'None'].map(b => (
              <label key={b}><input type="radio" name="bowlingStyle" value={b} checked={formData.bowlingStyle === b} onChange={handleChange} /> {b}</label>
            ))}
          </div>

          <div className="radio-group">
            <label>Jersey Size:</label>
            {['S', 'M', 'L','XL', 'XXL', '3XL','4XL'].map(b => (
              <label key={b}><input type="radio" name="jerseySize" value={b} checked={formData.jerseySize === b} onChange={handleChange} /> {b}</label>
            ))}
          </div>
          {/* <select name="jerseySize" value={formData.jerseySize} onChange={handleChange}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select> */}

          <input name="nameOnJersey" placeholder="Name on Jersey" value={formData.nameOnJersey} onChange={handleChange} required />
          <input name="numberOnJersey" placeholder="Number on Jersey" value={formData.numberOnJersey} onChange={handleChange} required />

          <div className="radio-group">
            <label>Played Last Season?</label>
            {['Yes', 'No'].map(y => (
              <label key={y}><input type="radio" name="playedLastSeason" value={y} checked={formData.playedLastSeason === y} onChange={handleChange} /> {y}</label>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'SUBMIT REGISTRATION'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;