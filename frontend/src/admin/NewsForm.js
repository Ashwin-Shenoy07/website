import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewsForm.css";

const NewsForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        summary: initialData.summary,
        content: initialData.content,
        image: initialData.image || ""
      });
    }
  }, [initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    try {
      if (initialData) {
        // EDIT
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/news/${initialData._id}`,
          form,
          { withCredentials: true }
        );
        setMessage("✅ News updated successfully");
      } else {
        // CREATE
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/news`,
          form,
          { withCredentials: true }
        );
        setMessage("✅ News posted successfully");
      }

      if (onSuccess) onSuccess();

    } catch (err) {
      setMessage("❌ Failed to save news");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {message && <p className="message">{message}</p>}

      <input name="title" placeholder="News Title" value={form.title} onChange={handleChange} required />
      <input name="summary" placeholder="Short Summary" value={form.summary} onChange={handleChange} required />
      <textarea name="content" placeholder="Full Content" rows="5" value={form.content} onChange={handleChange} required />
      <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />

      <button type="submit">
        {initialData ? "Update News" : "Publish News"}
      </button>
    </form>
  );
};

export default NewsForm;
