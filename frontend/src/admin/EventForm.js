import React, { useState } from "react";
import axios from "axios";
import "./EventForm.css";

const EventForm = () => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/events`,
        form,
        { withCredentials: true }
      );

      setMessage("✅ Event created successfully");
      setForm({ title: "", date: "", venue: "", description: "" });

    } catch {
      setMessage("❌ Failed to create event");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Create Event</h2>

      {message && <p className="message">{message}</p>}

      <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm;
