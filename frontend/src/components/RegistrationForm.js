import React, { useState,useRef } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import banner from '../asset/banner.png';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', place: '', aadharLast4: '', category: 'Batsman',
    battingStyle: 'Right-Handed', bowlingStyle: 'None', jerseySize: 'S/38',
    nameOnJersey: '', numberOnJersey: '', playedLastSeason: 'No'
  });
  const [files, setFiles] = useState({ aadharFile: null, profilePhoto: null });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // ← NEW: Hide form on success
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const aadharRef = useRef();
  const photoRef = useRef();
  const ref = useRef();

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'mobile') {
    // Remove all non-digits
    let digits = value.replace(/\D/g, '');

    // Allow only if first digit is 6,7,8,9 (or empty)
    if (digits.length > 0) {
      const firstDigit = digits[0];
      if (!['6', '7', '8', '9'].includes(firstDigit)) {
        // Don't update state if invalid first digit
        return;
      }
    }

    // Limit to 10 digits
    digits = digits.slice(0, 10);

    setFormData({ ...formData, mobile: digits });
  }
  else if (name === 'aadharLast4') {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, aadharLast4: digits });
  }
  else if(name == 'dob'){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosenDate = new Date(value); 
    chosenDate.setHours(0, 0, 0, 0);
    if (chosenDate < today) {
        setError('');
        setFormData({ ...formData, dob: value });
      } else {
        setError('Invalid Date Of Birth');
      }
  }
  else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleFile = (e) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large! Max allowed size is 5 MB.");
      e.target.value = ""; 
      return;
    }
    else
    {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', mobile: '', place: '', aadharLast4: '', category: 'Batsman',
      battingStyle: 'Right-Handed', bowlingStyle: 'None', jerseySize: 'S/38',
      nameOnJersey: '', numberOnJersey: '', playedLastSeason: 'No'
    });
    setFiles({ aadharFile: null, profilePhoto: null });
    setMessage('');
    setIsSuccess(false);  // ← THIS LINE WAS MISSING!
    setLoading(false);
    if (aadharRef.current) aadharRef.current.value = '';
    if (photoRef.current) photoRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);
    console.log("collection name:",process.env.COLLECTION_NAME);

    // Final mobile validation
    if (formData.mobile.length !== 10) {
      setMessage('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (files.aadharFile) data.append('aadharFile', files.aadharFile);
    if (files.profilePhoto) data.append('profilePhoto', files.profilePhoto);
    
    const backendURL = process.env.REACT_APP_BACKEND_URL;

    try {
      const res = await axios.post(
        `${backendURL}api/players/register`,
        data
      );

      if (res.data.success) {
        setIsSuccess(true); // ← Hide form
        setMessage(
          <div className="success-box">
            <h2>Registration Successful!</h2>
            <p><strong>Reg No:</strong> {res.data.regNumber}</p>
            <p><strong>Name:</strong> {res.data.name}</p>
            <p><strong>Place:</strong> {res.data.place}</p>
            <button onClick={resetForm} className="new-reg-btn">
              Register Another Player
            </button>
          </div>
        );
        // setFormData({ name: '', mobile: '', place: '', aadharLast4: '', category: 'Open',
        //   battingStyle: 'Right Hand', bowlingStyle: 'None', jerseySize: 'M',
        //   nameOnJersey: '', numberOnJersey: '', playedLastSeason: 'No' });
        // setFiles({ aadharFile: null, profilePhoto: null });
      }
    } catch (err) {
      setMessage(
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          {err.response?.data?.message || "Registration failed. Please try again."}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="registration-container success-screen">
        <div className="form-card">{message}</div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="form-card">
        <img src={banner} alt='banner.png'/>
        <h1>Player Registration</h1>
        <p>Join the Legacy • Play with Passion</p>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* All your fields here - Name, Mobile, Place, etc. */}
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
          <input name="place" placeholder="Place / Area" value={formData.place} onChange={handleChange} required />
          <input name="dob" type="text" ref={ref} placeholder="Date of Birth" onChange={handleChange} onFocus={() => {if (ref.current) {
                ref.current.type = "date"}}} onBlur={() => {if (ref.current) { ref.current.type = formData.dob ? "date" : "text"}}} value={formData.dob} />
          <span style={{ color:'#FF0000' }}>Note: Date of Birth will be your password for future communication</span>          
          <input name="aadharLast4" placeholder="Aadhar Last 4 Digits" maxLength="4" value={formData.aadharLast4} onChange={handleChange} required />

          <label>Aadhar Proof(Max File Size 5MB)</label>
          <input type="file" multiple={false} name="aadharFile" onChange={handleFile} required />

          <label>Profile Photo (JPG/PNG)(Max File Size 5MB)</label>
          <input type="file" name="profilePhoto" multiple={false} accept="image/*" onChange={handleFile} required />

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
            {['S/38', 'M/40', 'L/42','XL/44', 'XXL/46', '3XL/48'].map(b => (
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
          <input name="numberOnJersey" placeholder="Number on Jersey" value={formData.numberOnJersey} maxLength="3" onChange={handleChange} required />

          <div className="radio-group">
            <label>Played Last Season?</label>
            {['Yes', 'No'].map(y => (
              <label key={y}><input type="radio" name="playedLastSeason" value={y} checked={formData.playedLastSeason === y} onChange={handleChange} /> {y}</label>
            ))}
          </div>

          {error && <span style={{ color: 'red' }}>{error}</span>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'REGISTER NOW'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
