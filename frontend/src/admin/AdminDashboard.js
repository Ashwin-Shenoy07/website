import React, { useContext } from "react";
import AdminLayout from "./AdminLayout";
import AdminContext from "./AdminContext";
import News from "./News";
import Event from "./Event";
import Dashboard from "./Dashboard";


const AdminDashboard = () => {
  const { activeSection } = useContext(AdminContext);

  return (
    <AdminLayout>
      {activeSection === "dashboard" && <Dashboard /> }

      {activeSection === "news" && <News />}
      {activeSection === "events" && <Event />}
      {activeSection === "players"}
    </AdminLayout>
  );
};

export default AdminDashboard;
