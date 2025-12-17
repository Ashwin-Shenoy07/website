import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./EventForm.css";

const EventForm = ({ onSuccess, editData, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    date: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const imageRef = useRef(null);

  // -------------------- PREFILL FOR EDIT --------------------
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        summary: editData.summary || "",
        description: editData.description || "",
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

  // -------------------- HANDLE FILE --------------------
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setMessage("❌ Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("❌ Only image files are allowed");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  // -------------------- SUBMIT --------------------
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("summary", form.summary);
      data.append("description", form.description);
      data.append("date", form.date);

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editData) {
        // UPDATE
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/events/${editData._id}`,
          data,
          { withCredentials: true }
        );
        setMessage("✅ Event updated successfully");
      } else {
        // CREATE
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/events`,
          data,
          { withCredentials: true }
        );
        setMessage("✅ Event created successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Failed to save event");
    } finally {
      setLoading(false);
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
        type="file"
        name="image"
        accept="image/*"
        ref={imageRef}
        onChange={handleFile}
      />

      {editData?.image && !imageFile && (
        <p className="hint">Existing image will be kept</p>
      )}

      <textarea
        name="description"
        placeholder="Event Description"
        rows="5"
        value={form.description}
        onChange={handleChange}
        required
      />

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editData ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
