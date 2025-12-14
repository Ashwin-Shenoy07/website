import React, { useState } from "react";
import NewsForm from "./NewsForm";
import EventForm from "./EventForm";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="admin-dashboard">
      <h1>CCL 2026 – Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === "news" ? "active" : ""}
          onClick={() => setActiveTab("news")}
        >
          Post News
        </button>

        <button
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          Create Event
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "news" && <NewsForm />}
        {activeTab === "events" && <EventForm />}
      </div>
    </div>
  );
};

export default AdminDashboard;
