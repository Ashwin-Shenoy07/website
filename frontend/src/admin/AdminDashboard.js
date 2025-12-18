import React, { useContext } from "react";
import AdminLayout from "./AdminLayout";
import AdminContext from "./AdminContext";
import News from "./News";
import Event from "./Event";
import Dashboard from "./Dashboard";
import Players from "./Players";


const AdminDashboard = () => {
  const { activeSection } = useContext(AdminContext);

  return (
    <AdminLayout>
      {activeSection === "dashboard" && <Dashboard /> }

      {activeSection === "news" && <News />}
      {activeSection === "events" && <Event />}
      {activeSection === "players" && <Players/>}
    </AdminLayout>
  );
};

export default AdminDashboard;
