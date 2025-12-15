import React from "react";
import axios from "axios";
import { FiPower } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/admin/auth/logout`,
      {},
      { withCredentials: true }
    );

    navigate("/admin/login", { replace: true });
  } catch (err) {
    alert("Logout failed");
  }
};

  return (
    <header className="admin-header">
      <h3>Admin Dashboard</h3>

      <div className="admin-header-right">
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FiPower size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
