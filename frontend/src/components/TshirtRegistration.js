import { useState } from "react";
import axios from "axios";
import "./TshirtRegistration.css";
import logo from '../asset/logo.png';
import tshirt from '../asset/tshirt.jpeg';

const TshirtRegistration = () => {
  
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    shirtSize: "",
    isActive: true
  });

  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setForm({ ...form, [form.isActive]: true });
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/tshirt/register`,
      form
    );

    setConfirmation(res.data.registration);
  };

  if (confirmation) {
    return (
      
      <div className="confirm-card">
        <h2>🎉 Registration Successful!</h2>
        <p className="reg-number">
          Order No: <b>{confirmation.tshirtReg}</b>
        </p>
        <p className="thank-you">
          Thank you for ordering the volunteer T-shirt ❤️
        </p>
      </div>

    );
  }

  return (
    <>
    <div className="menubar">
          <div className="logo">
            <img src={logo} alt="CCL Logo" />
            <h1>CCL 2026</h1>
          </div>
    </div>
    <div className="tshirt-container">
      <form className="tshirt-form" onSubmit={submitForm}>
        <h3>Vijaya Cricketers Saligrama T-Shirt</h3>
        <p>Rs.400/- per T-shirt.</p>
        <img
          src={tshirt}
          alt="Tshirt"
          className="tshirt-image"
        />
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />

        <input type="text" name="whatsapp" placeholder="WhatsApp Number" value={form.whatsapp} onChange={handleChange} required />
        
        <div className="sizes">
            <label>Select T-shirt Size:</label>
            {['24','26','28', '30','32','34', '36', '38', '40', '42','44', '46', '48'].map(b => (
              <label key={b}><input type="radio" name="shirtSize" value={b} checked={form.shirtSize === b} onChange={handleChange} /> {b}</label>
            ))}
          </div>
        <button type="submit">Register</button>
      </form>
    </div>
    </>
  );
};

export default TshirtRegistration;
