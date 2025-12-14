import React, { useContext } from "react";
import AdminContext from "./AdminContext";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { activeSection, setActiveSection } = useContext(AdminContext);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">CCL</div>

      <ul className="sidebar-menu">
        <li
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={activeSection === "news" ? "active" : ""}
          onClick={() => setActiveSection("news")}
        >
          News
        </li>

        <li
          className={activeSection === "events" ? "active" : ""}
          onClick={() => setActiveSection("events")}
        >
          Events
        </li>

        <li>Players</li>
        <li>Teams</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
