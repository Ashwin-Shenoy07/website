// src/admin/EventForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventForm.css";

const EventForm = ({ onSuccess, editData, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    image: "",
    eventDate: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    try {
      if (editData) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/events/${editData._id}`,
          form,
          { withCredentials: true }
        );
        setMessage("✅ Event updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/events`,
          form,
          { withCredentials: true }
        );
        setMessage("✅ Event created successfully");
      }

      onSuccess();
      onClose();
    } catch {
      setMessage("❌ Failed to save event");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>

      {message && <p className="message">{message}</p>}

      <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} required />
      <input name="summary" placeholder="Short Summary" value={form.summary} onChange={handleChange} required />
      <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />

      <textarea
        name="description"
        placeholder="Event Description"
        rows="5"
        value={form.description}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {editData ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
};

export default EventForm;
