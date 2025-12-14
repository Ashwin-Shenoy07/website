import React, { useState } from "react";
import axios from "axios";
import "./NewsForm.css";

const NewsForm = () => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image: ""
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
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/news`,
        form,
        { withCredentials: true }
      );

      setMessage("✅ News posted successfully");
      setForm({ title: "", summary: "", content: "", image: "" });

    } catch (err) {
      setMessage("❌ Failed to post news");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Post News</h2>

      {message && <p className="message">{message}</p>}

      <input name="title" placeholder="News Title" value={form.title} onChange={handleChange} required />
      <input name="summary" placeholder="Short Summary" value={form.summary} onChange={handleChange} required />
      <textarea name="content" placeholder="Full Content" rows="5" value={form.content} onChange={handleChange} required />
      <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />

      <button type="submit">Publish News</button>
    </form>
  );
};

export default NewsForm;
