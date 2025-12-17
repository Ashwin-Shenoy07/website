import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventForm.css";

const EventForm = ({ onSuccess, editData, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    image: "",
    date: ""
  });

  const [message, setMessage] = useState("");

  // -------------------- PREFILL FORM FOR EDIT --------------------
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        summary: editData.summary || "",
        description: editData.description || "",
        image: editData.image || "",
        date: editData.date
          ? new Date(editData.date).toISOString().split("T")[0]
          : ""
      });
    }
  }, [editData]);

  // -------------------- HANDLE INPUT CHANGE --------------------
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------- SUBMIT FORM --------------------
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    try {
      if (editData) {
        // UPDATE EVENT
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/events/${editData._id}`,
          form,
          { withCredentials: true }
        );
        setMessage("✅ Event updated successfully");
      } else {
        // CREATE EVENT
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/events`,
          form,
          { withCredentials: true }
        );
        setMessage("✅ Event created successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Event save error:", err.response?.data || err.message);
      setMessage("❌ Failed to save event");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Edit Event" : "Create Event"}</h3>

      {message && <p className="message">{message}</p>}

      <input
        name="title"
        placeholder="Event Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <input
        name="summary"
        placeholder="Short Summary"
        value={form.summary}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Event Description"
        rows="5"
        value={form.description}
        onChange={handleChange}
        required
      />

      <div className="form-actions">
        <button type="submit">
          {editData ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
