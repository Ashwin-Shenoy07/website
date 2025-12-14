import React, { useContext } from "react";
import AdminLayout from "./AdminLayout";
import AdminContext from "./AdminContext";
import NewsForm from "./NewsForm";
import EventForm from "./EventForm";

const AdminDashboard = () => {
  const { activeSection } = useContext(AdminContext);

  return (
    <AdminLayout>
      {activeSection === "dashboard" && (
        <>
          <h2>Dashboard</h2>
          <p>Welcome to CCL 2026 Admin Panel</p>
        </>
      )}

      {activeSection === "news" && <NewsForm />}
      {activeSection === "events" && <EventForm />}
    </AdminLayout>
  );
};

export default AdminDashboard;
