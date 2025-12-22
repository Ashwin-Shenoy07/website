import { useState } from "react";
import axios from "axios";
import "./TshirtRegistration.css";

const TshirtRegistration = () => {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    shirtSize: ""
  });

  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

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
          Registration No: <b>{confirmation.regNumber}</b>
        </p>
        <p className="thank-you">
          Thank you for registering for the special T-shirt ❤️  
          We’ll contact you soon on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="tshirt-container">
      <form className="tshirt-form" onSubmit={submitForm}>
        <h2>Special T-Shirt Registration</h2>

        <img
          src="/tshirt.jpg"
          alt="Tshirt"
          className="tshirt-image"
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={handleChange}
          required
        />

        <div className="sizes">
          <label>
            <input type="radio" name="shirtSize" value="S" onChange={handleChange} /> S
          </label>
          <label>
            <input type="radio" name="shirtSize" value="M" onChange={handleChange} /> M
          </label>
          <label>
            <input type="radio" name="shirtSize" value="L" onChange={handleChange} /> L
          </label>
          <label>
            <input type="radio" name="shirtSize" value="XL" onChange={handleChange} /> XL
          </label>
          <label>
            <input type="radio" name="shirtSize" value="XXL" onChange={handleChange} /> XXL
          </label>
        </div>

        <img
          src="/size-chart.jpg"
          alt="Size Chart"
          className="size-chart"
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default TshirtRegistration;
