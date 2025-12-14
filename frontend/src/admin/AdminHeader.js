import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/auth/logout`,
        {},
        { withCredentials: true }
      );

      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed");
    }
  };

  return (
    <header className="admin-header">
      <h3>Dashboard</h3>

      <div className="admin-header-right">
        <span className="notification">🔔</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
